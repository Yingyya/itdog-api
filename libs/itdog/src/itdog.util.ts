import * as crypto from 'crypto';
import { RawData, WebSocket } from 'ws';
import { RegionTotal } from 'api/itdog/types';

/**
 * itdog 省份信息 没有则是境外
 */
export const ProvinceData = {
  '0': '北京',
  '1': '天津',
  '2': '上海',
  '3': '重庆',
  '4': '河北',
  '5': '河南',
  '6': '云南',
  '7': '辽宁',
  '8': '黑龙江',
  '9': '湖南',
  '10': '安徽',
  '11': '山东',
  '12': '新疆',
  '13': '江苏',
  '14': '浙江',
  '15': '江西',
  '16': '湖北',
  '17': '广西',
  '18': '甘肃',
  '19': '山西',
  '20': '内蒙古',
  '21': '陕西',
  '22': '吉林',
  '23': '福建',
  '24': '贵州',
  '25': '广东',
  '26': '青海',
  '27': '西藏',
  '28': '四川',
  '29': '宁夏',
  '30': '海南',
  '31': '台湾',
  '32': '香港',
  '33': '澳门',
  '99': '境外',
};

/**
 * itdog 运营商信息
 */
export const ISPData = {
  '1': '电信',
  '2': '联通',
  '3': '移动',
  '5': '境外',
};

/**
 * itdog 区域信息
 */
export const RegionData = {
  '1': '华东',
  '2': '华南',
  '3': '华中',
  '4': '华北',
  '5': '西南',
  '6': '西北',
  '7': '东北',
  '8': '港澳台',
  '9': '亚洲',
  '10': '欧洲',
  '11': '北美洲',
  '12': '南美洲',
  '13': '非洲',
  '14': '大洋洲',
};

export const getStatisticians = (
  results: {
    line: number;
    region: number;
    province: number;
    result?: string | any;
    name: string;
  }[],
  delay_key = 'result',
) => {
  const isp_s = {
    ['电信']: {
      nodes: 0, // 节点数
      all: 0, // 总延迟
      fast: {
        name: '', // 最快的地域名
        delay: 0, // 最快的延迟
      },
      slow: {
        name: '', // 最慢的地域名
        delay: 0, // 最慢的延迟
      },
    },
    ['移动']: {
      nodes: 0,
      all: 0,
      fast: {
        name: '',
        delay: 0,
      },
      slow: {
        name: '',
        delay: 0,
      },
    },
    ['联通']: {
      nodes: 0,
      all: 0,
      fast: {
        name: '',
        delay: 0,
      },
      slow: {
        name: '',
        delay: 0,
      },
    },
    ['境外']: {
      nodes: 0,
      all: 0,
      fast: {
        name: '',
        delay: 0,
      },
      slow: {
        name: '',
        delay: 0,
      },
    },
  };
  const region_s: {
    [key: string]: RegionTotal;
  } = {};
  const china_s = {
    nodes: 0,
    all: 0,
    fast: {
      name: '',
      delay: 0,
    },
    slow: {
      name: '',
      delay: 0,
    },
  };
  const asia_s = {
    nodes: 0,
    all: 0,
    fast: {
      name: '',
      delay: 0,
    },
    slow: {
      name: '',
      delay: 0,
    },
  };
  const all_s = {
    nodes: 0,
    all: 0,
    argv: '',
    fast: {
      name: '',
      delay: 0,
    },
    slow: {
      name: '',
      delay: 0,
    },
  };
  for (const k in RegionData) {
    region_s[RegionData[k]] = {
      nodes: 0,
      all: 0,
      fast: {
        name: '',
        delay: 0,
      },
      slow: {
        name: '',
        delay: 0,
      },
    };
  }
  for (const result of results) {
    const isp = ISPData[result.line];
    const province = ProvinceData[result.province];
    const region = RegionData[result.region];
    const num = Number(result[delay_key] || 0);
    // 统计全部
    all_s.nodes++;
    all_s.all += num;
    // 求最快
    if (all_s.fast.delay === 0 || num < all_s.fast.delay) {
      all_s.fast.delay += num;
      all_s.fast.name = result.name;
    }
    // 求最慢
    if (all_s.slow.delay === 0 || num > all_s.slow.delay) {
      all_s.slow.delay += num;
      all_s.slow.name = result.name;
    }
    // 统计 运营商
    if (isp !== undefined) {
      isp_s[isp].nodes++;
      isp_s[isp].all += num;
      // 求最快
      if (isp_s[isp].fast.delay === 0 || num < isp_s[isp].fast.delay) {
        isp_s[isp].fast.delay += num;
        isp_s[isp].fast.name = result.name;
      }
      // 求最慢
      if (isp_s[isp].slow.delay === 0 || num > isp_s[isp].slow.delay) {
        isp_s[isp].slow.delay += num;
        isp_s[isp].slow.name = result.name;
      }
    }
    // 统计 境内外
    if ([province, region].includes('境外')) {
      asia_s.nodes++;
      asia_s.all += num;
      if (asia_s.fast.delay === 0 || num < asia_s.fast.delay) {
        asia_s.fast.delay = num;
        asia_s.fast.name = result.name;
      }
      if (asia_s.slow.delay === 0 || num > asia_s.slow.delay) {
        asia_s.slow.delay = num;
        asia_s.slow.name = result.name;
      }
    } else {
      china_s.nodes++;
      china_s.all += num;
      if (china_s.fast.delay === 0 || num < china_s.fast.delay) {
        china_s.fast.delay = num;
        china_s.fast.name = result.name;
      }
      if (china_s.slow.delay === 0 || num > china_s.slow.delay) {
        china_s.slow.delay = num;
        china_s.slow.name = result.name;
      }
    }
    // 统计 区域
    if (region !== undefined) {
      region_s[region].nodes++;
      region_s[region].all += num;
      // 求最快
      if (
        region_s[region].fast.delay === 0 ||
        num < region_s[region].fast.delay
      ) {
        region_s[region].fast.delay += num;
        region_s[region].fast.name = result.name;
      }
      // 求最慢
      if (
        region_s[region].slow.delay === 0 ||
        num > region_s[region].slow.delay
      ) {
        region_s[region].slow.delay += num;
        region_s[region].slow.name = result.name;
      }
    }
  }
  all_s.argv = (all_s.nodes / all_s.all).toFixed(2);
  return {
    ...isp_s,
    ...region_s,
    ['境内']: china_s,
    ['境外']: asia_s,
    ['全部']: all_s,
  };
};

/**
 * 获取 Task Token
 * @param task_id
 */
export const getToken = (task_id: string): string => {
  const salt = 'token_20230313000136kwyktxb0tgspm00yo5';
  const hash = crypto.createHash('md5');
  hash.update(task_id + salt);
  const md5 = hash.digest('hex');
  return md5.slice(8, 24);
};

/**
 * 防抖函数
 * @param func
 * @param delay
 */
export const debounce = (func: Function, delay: number): Function => {
  let timer: any | undefined;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * 发送 ITDog 任务
 * @param taskid
 * @param num
 */
export const sendTask = <T>(taskid: string, num: number = 1): Promise<T[]> => {
  return new Promise<T[]>((resolve) => {
    if (taskid.length === 0) {
      return resolve([]);
    }
    let flag = false;
    const ws = new WebSocket('wss://www.itdog.cn/websockets');
    const result: T[] = [];
    const close = debounce(() => {
      if (!flag) {
        try {
          ws.close();
        } catch (e) {
        } finally {
          flag = true;
          resolve(result);
        }
      }
    }, 5555);
    // 发送任务
    ws.on('open', () => {
      const token = getToken(taskid);
      ws.send(
        JSON.stringify({
          task_id: taskid,
          task_token: token,
        }),
      );
      // 发送指定次数
      let i = num - 1;
      const task_id = setInterval((): void => {
        if (i <= 0) {
          clearInterval(task_id);
          return;
        }
        ws.send(
          JSON.stringify({
            task_id: taskid,
            task_token: token,
          }),
        );
        i--;
      }, 500);
    });
    // 收到结果
    ws.on('message', (message: RawData) => {
      const data: T = JSON.parse(message.toString());
      result.push(data);
      close(); // 调用防抖关闭 WebSocket 链接
    }).on('close', () => {
      flag = false;
    });
  });
};

function guard_xorEncrypt(inputString, keyString) {
  keyString += 'PTNo2n3Ev5';
  let result = '';

  for (let i = 0; i < inputString.length; i++) {
    const charCode =
      inputString.charCodeAt(i) ^ keyString.charCodeAt(i % keyString.length);
    result += String.fromCharCode(charCode);
  }

  return result;
}

export function getGuardRet(guard) {
  // const orderArray = '2|5|6|4|1|0|7|3'.split('|');
  const prefix = guard.substring(0, 8);
  const number = parseInt(guard.substring(12));
  const calculatedValue = number * 2 + 18 - 2;
  const encryptedResult = guard_xorEncrypt(calculatedValue.toString(), prefix);

  return btoa(encryptedResult);
}

export function parseSetCookies(cookies: string[]): Record<string, string> {
  //  'set-cookie': [ 'guard=3846b9b5arTI27; path=/;' ]
  const cookie: Record<string, string> = {};
  cookies.forEach((v) => {
    const c = v.split(';')[0];
    const [key, value] = c.split('=');
    cookie[key] = value;
  });
  return cookie;
}

export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
