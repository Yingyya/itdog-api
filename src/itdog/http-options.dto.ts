export class HttpOptionsDto {
  readonly url: string;
  readonly method?: string;
  readonly ipv4?: string;
  readonly cookies?: string;
  readonly ua?: string;
  readonly referer?: string;
  readonly host?: string;
  readonly host_s?: string;
}
