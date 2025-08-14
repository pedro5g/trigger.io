export type HttpClientMethods =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export type ResponseType =
  | "json"
  | "text"
  | "blob"
  | "arraybuffer"
  | "document"
  | "stream";

export interface HttpClientRequestConfig<TData = any> {
  url?: string;
  method?: HttpClientMethods;
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: TData | FormData;
  timeout?: number;
  withCredentials?: boolean;
  responseType?: ResponseType;
  validateStatus?: (status: number) => boolean;
  transformRequest?: Array<
    <RType = any, DType = any>(
      data: DType,
      headers: Record<string, string>,
    ) => RType
  >;
  transformResponse?: Array<<RType = any, DType = any>(data: DType) => RType>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  skipInterceptors?: boolean;
  skipRequestInterceptors?: boolean;
  skipResponseInterceptors?: boolean;
  [key: string]: any;
}

export interface HttpClientResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: HttpClientRequestConfig;
  request?: any;
}

export type RequestInterceptor = (
  config: HttpClientRequestConfig,
) => HttpClientRequestConfig | Promise<HttpClientRequestConfig>;
export type RequestErrorInterceptor = (error: any) => any;
export type ResponseInterceptor<T = any> = (
  response: HttpClientResponse<T>,
) => HttpClientResponse<T> | Promise<HttpClientResponse<T>>;
export type ResponseErrorInterceptor = <TData = any>(
  error: HttpClientError<TData>,
) => any;
export type Interceptor<T> = { fulfilled: T | null; rejected: any };
export interface InterceptorManager<T> {
  use(onFulfilled?: T, onRejected?: any): number;
  eject(id: number): void;
  clear(): void;
  forEach(fn: (interceptor: Interceptor<T>) => void): void;
}

export const HTTP_CLIENT_ERROR_CODE = {
  TIMEOUT: "TIMEOUT",
  NETWORK_ERROR: "NETWORK_ERROR",
  EXTRACT_RESPONSE: "EXTRACT_RESPONSE",
} as const;

export interface HttpClientRequesterConfig<TData = any> {
  url?: string;
  method?: HttpClientMethods;
  baseURL?: string;
  headers: Record<string, string>;
  params?: Record<string, any>;
  data?: TData | FormData;
  timeout?: number;
  withCredentials?: boolean;
  responseType?: ResponseType;
  validateStatus?: (status: number) => boolean;
  transformRequest?: Array<
    <RType = any, DType = any>(
      data: DType,
      headers: Record<string, string>,
    ) => RType
  >;
  transformResponse?: Array<<RType = any, DType = any>(data: DType) => RType>;
  [key: string]: any;
}

export interface HttpClientError<TData> extends Error {
  config: HttpClientRequesterConfig;
  request?: any;
  response?: HttpClientResponse<TData>;
  isHttpClientError?: boolean;
  code?: string;
}

export type HttpClientSafeResponse<TData = unknown, TError = unknown> =
  | [null, TData]
  | [TError, null];
