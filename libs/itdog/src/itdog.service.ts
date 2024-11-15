import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import {
  delay,
  getGuardRet,
  getStatisticians,
  parseSetCookies,
  sendTask,
} from 'api/itdog/itdog.util';
import {
  DNS_TYPE,
  ODNS,
  OHttp,
  OPing,
  OTcping,
  PingResponse,
  TCPingResponse,
} from 'api/itdog/types';
import { HttpOptionsDto } from '../../../src/itdog/http-options.dto';
import {
  clearCookies,
  getCookie,
  getCookies,
  getCookiesString,
  setCookie,
} from 'api/itdog/itdog.cookie';

@Injectable()
export class ItdogService {
  /**
   * 获取 任务ID
   * @param config
   * @private
   */
  private getTaskId(config: AxiosRequestConfig): Promise<string> {
    return new Promise((resolve) => {
      const refreshCookie = async (response: AxiosResponse) => {
        // 清除已有的 cookie 重新获取
        clearCookies();
        const cookies = parseSetCookies(response.headers?.['set-cookie']);
        Object.keys(cookies).forEach((key) => {
          setCookie(key, cookies[key]);
        });
        // 已有 guardok 重新进行请求
        const guardok = getCookie('guardok');
        if (guardok?.length > 0) {
          await delay(2000);
          return this.getTaskId(config);
        }
        // 获取到 guard 计算 guardret
        const guard = getCookie('guard');
        if (guard?.length > 0) {
          const guardRet = getGuardRet(guard);
          setCookie('guardret', guardRet);
          await delay(2000);
          return this.getTaskId(config);
        }
      };
      const cookie = getCookiesString();
      console.log('axios get cookie', cookie);
      config = {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.44',
          origin: 'https://www.itdog.cn',
          referer: config.url,
          'Content-type': 'application/x-www-form-urlencoded',
        },
        timeout: 1000 * 10,
        ...config,
      };
      config.headers['Cookie'] = `${cookie};${config.headers['Cookie'] ?? ''}`;
      console.log(config);
      axios<string>(config)
        .then((response) => {
          const cookies = parseSetCookies(response.headers?.['set-cookie']);
          Object.keys(cookies).forEach((key) => {
            setCookie(key, cookies[key]);
          });
          const body = response.data;
          const regex = /var task_id='(.+)';/g;
          const match = regex.exec(body);
          if (match !== null) {
            return resolve(match[1]);
          } else {
            if (body.indexOf('/_guard/auto.js') !== -1) {
              return refreshCookie(response as AxiosResponse).then(resolve);
            }
          }
          return resolve('');
        })
        .catch((e: AxiosError) => {
          if ((Object.keys(getCookies()).length ?? 0) == 0) {
            return refreshCookie(e?.response as AxiosResponse).then(resolve);
          }
          return resolve('');
        });
    });
  }

  public async ping(host: string): Promise<{}> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `https://www.itdog.cn/ping/${host}`,
      data: {
        line: '',
        button_click: 'yes',
      },
    };
    const taskId = await this.getTaskId(config);
    if (taskId.length === 0) {
      console.log('id获取失败');
      return {};
    }
    const data = await sendTask<OPing>(taskId);
    // 解析为新格式
    const results = data
      .map((v): PingResponse => {
        const ip: string | undefined = v?.ip;
        let result: string | undefined = v?.result;
        const name: string | undefined = v?.name;
        const address: string | undefined = v?.address;
        if (name === undefined && address === undefined) {
          return {};
        }
        if (result !== undefined) {
          result = `${result}ms`;
        }
        return {
          ip,
          delay: result,
          node: name,
          address,
        };
      })
      .filter(
        (v: NonNullable<unknown>): boolean => Object.keys(v).length !== 0,
      );
    const total = getStatisticians(data);
    return {
      results,
      total,
    };
  }

  public async tcping(host: string, port: number): Promise<{}> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `https://www.itdog.cn/tcping/${host}:${port}`,
      data: {
        line: '',
        button_click: 'yes',
      },
    };
    const taskId = await this.getTaskId(config);
    if (taskId.length === 0) {
      return {};
    }
    const data = await sendTask<OTcping>(taskId);
    const results = data
      .map((v): TCPingResponse => {
        const ip: string | undefined = v?.ip;
        let result: string | undefined = v?.result;
        const name: string | undefined = v?.name;
        const address: string | undefined = v?.address;
        if (name === undefined && address === undefined) {
          return {};
        }
        if (result !== undefined) {
          result = `${result}ms`;
        }
        return {
          ip,
          delay: result,
          node: name,
          address,
          port,
        };
      })
      .filter(
        (v: NonNullable<unknown>): boolean => Object.keys(v).length !== 0,
      );
    const total = getStatisticians(data);
    return {
      results,
      total,
    };
  }

  public async http(httpOptions: HttpOptionsDto) {
    const uri = new URL(httpOptions.url);
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `https://www.itdog.cn/http/`,
      data: {
        ...httpOptions,
        check_mode: 'fast',
        host: httpOptions.url,
        host_s: uri.host,
      },
    };
    const taskId = await this.getTaskId(config);
    if (taskId.length === 0) {
      return {};
    }
    const data = await sendTask<OHttp>(taskId);
    const results = data
      .map((v) => {
        if (v.type !== 'success') {
          return {};
        }
        return {
          address: v.address,
          node: v.name,
          ip: v.ip,
          http_code: v.http_code,
          redirect_time: `${v.redirect_time}ms`,
          redirect: v.redirect,
          ssl_time: `${v.ssl_time}ms`,
          dns_time: `${v.dns_time}ms`,
          connect_time: `${v.connect_time}ms`,
          all_time: `${v.all_time}ms`,
          head: v.head.replace(/<br>/g, '\n'),
        };
      })
      .filter(
        (v: NonNullable<unknown>): boolean => Object.keys(v).length !== 0,
      );
    const total = getStatisticians(data, 'all_time');
    return {
      results,
      total,
    };
  }

  public async dns(domain: string, type: DNS_TYPE, server = '223.5.5.5') {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `https://www.itdog.cn/dns/${domain}`,
      data: {
        domain,
        dns_type: type.toLowerCase(),
        dns_server: server,
      },
    };
    const taskId = await this.getTaskId(config);
    if (taskId.length === 0) {
      return {};
    }
    const data = await sendTask<ODNS>(taskId);
    const results = data
      .map((v) => {
        if (v.type !== 'success') {
          return {
            node: v.name,
            delay: `-1ms`,
            result: v.result,
          };
        }
        return {
          node: v.name,
          delay: `${v.time}ms`,
          result: v.result,
        };
      })
      .filter(
        (v: NonNullable<unknown>): boolean => Object.keys(v).length !== 0,
      );
    const total = getStatisticians(data, 'time');
    return {
      results,
      total,
    };
  }
}
