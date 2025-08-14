export interface CookiesOpts {
  domain?: string | undefined;
  encode?(value: string): string;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  maxAge?: number | undefined;
  partitioned?: boolean | undefined;
  path?: string | undefined;
  sameSite?: true | false | "lax" | "strict" | "none" | undefined;
  secure?: boolean | undefined;
}

export interface BrowserCookieOpts {
  days?: number;
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none";
  maxAge?: number;
  secure?: boolean;
  domain?: string;
  path?: string;
}

export class Cookie {
  constructor(
    public key: string,
    public value: string,
    public opts: CookiesOpts = {},
  ) {}

  toString(): string {
    const parts: string[] = [];

    const encodedValue = this.opts.encode
      ? this.opts.encode(this.value)
      : encodeURIComponent(this.value);

    parts.push(`${this.key}=${encodedValue}`);

    if (this.opts.domain) parts.push(`Domain=${this.opts.domain}`);
    if (this.opts.path) parts.push(`Path=${this.opts.path}`);
    if (this.opts.expires)
      parts.push(`Expires=${this.opts.expires.toUTCString()}`);
    if (typeof this.opts.maxAge === "number")
      parts.push(`Max-Age=${this.opts.maxAge}`);
    if (this.opts.httpOnly) parts.push("HttpOnly");
    if (this.opts.secure) parts.push("Secure");
    if (this.opts.partitioned) parts.push("Partitioned");
    if (this.opts.sameSite !== undefined) {
      if (this.opts.sameSite === true) {
        parts.push(`SameSite=Strict`);
      } else if (this.opts.sameSite !== false) {
        parts.push(
          `SameSite=${String(this.opts.sameSite).charAt(0).toUpperCase() + String(this.opts.sameSite).slice(1)}`,
        );
      }
    }

    return parts.join("; ");
  }
}

export class CookieParser {
  static parser(plainCookies: string | string[]) {
    const cookiesStr = Array.isArray(plainCookies)
      ? plainCookies
      : [plainCookies];

    const cookies: Array<Cookie> = [];
    cookiesStr.forEach((cookieStr) => {
      const parts = cookieStr.split(";").map((part) => part.trim());
      const [key_value, ...options] = parts;
      const [key, value] = key_value.split("=");

      const cookieOptions: CookiesOpts = { path: "/" };

      options.forEach((option) => {
        if (option.toLowerCase() === "httponly") cookieOptions.httpOnly = true;
        if (option.toLowerCase() === "secure") cookieOptions.secure = true;
        if (option.toLowerCase().startsWith("samesite="))
          cookieOptions.sameSite = option.split("=")[1] as
            | "lax"
            | "strict"
            | "none";
        if (option.toLowerCase().startsWith("max-age="))
          cookieOptions.maxAge = parseInt(option.split("=")[1], 10);
        if (option.toLowerCase().startsWith("expires"))
          cookieOptions.expires = new Date(option.split("=")[1]);
      });

      cookies.push(
        new Cookie(key.trim(), decodeURIComponent(value.trim()), cookieOptions),
      );
    });

    return cookies;
  }

  static fromEntries(cookies: Cookie[]) {
    const obj: Record<string, Cookie> = {};
    cookies.forEach((cookie) => {
      obj[cookie.key] = cookie;
    });

    return obj;
  }

  static toSetCookie(cookies: Cookie[]): string[] {
    return cookies.map((cookie) => cookie.toString());
  }
}

export const getCookies = () => {
  if (typeof document === "undefined") return {};

  const cookies: Record<string, string> = {};

  if (document.cookie) {
    document.cookie.split(";").forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) {
        cookies[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
  }

  return cookies;
};

export const getCookie = (key: string) => {
  const cookies = getCookies();
  return cookies[key];
};

export const setCookie = (
  name: string,
  value: string,
  options: BrowserCookieOpts = {},
) => {
  if (typeof document === "undefined") return;

  const {
    days = 1,
    maxAge,
    httpOnly,
    sameSite = "lax",
    secure = false,
    domain,
    path = "/",
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  cookieString += `; Path=${path}`;

  if (httpOnly) {
    cookieString += `; HttpOnly`;
  }

  if (days && !maxAge) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (maxAge) {
    cookieString += `; Max-Age=${maxAge}`;
  }

  cookieString += `; SameSite=${sameSite}`;

  if (secure) {
    cookieString += `; Secure`;
  }

  if (domain) {
    cookieString += `; Domain=${domain}`;
  }

  document.cookie = cookieString;
};

export const hasCookie = (key: string) => {
  if (!key) return false;
  const cookies = getCookies();
  return Object.prototype.hasOwnProperty.call(cookies, key);
};

export const deleteCookie = (key: string, opts?: BrowserCookieOpts) => {
  setCookie(key, "", { ...opts, maxAge: -1, days: -1 });
};

export const cookie = {
  getCookies,
  getCookie,
  setCookie,
  hasCookie,
  deleteCookie,
};

export function extractAndParseCookies(
  cookiesString: string | string[],
  cookieNames: string[],
) {
  const normalizeCookiesStrings = Array.isArray(cookiesString)
    ? cookiesString.join("; ")
    : cookieNames;
  const _cookies = CookieParser.parser(normalizeCookiesStrings);

  const cookies: Cookie[] = [];

  for (const [key, value] of Object.entries(
    CookieParser.fromEntries(_cookies),
  )) {
    if (!cookieNames.some((name) => name.toLowerCase() === key.toLowerCase())) {
      continue;
    }
    cookies.push(value);
  }

  return cookies;
}
