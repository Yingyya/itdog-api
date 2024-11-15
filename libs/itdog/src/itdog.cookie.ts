const cookies: Record<string, string> = {};

export function setCookie(key: string, value: string): void {
  cookies[key] = value;
}

export function getCookie(key: string): string | null {
  return cookies[key];
}

export function getCookiesString(): string {
  return Object.keys(cookies)
    .map((key) => `${key}=${cookies[key]}`)
    .join(';');
}

export function getCookies() {
  return cookies;
}

export function clearCookies(): void {
  console.log('clearCookie');
  Object.keys(cookies).forEach((key: string) => {
    delete cookies[key];
  });
}
