import type { ApiBaseErrorResponse } from "../endpoints/endpoints.types";
import {
  HTTP_CLIENT_ERROR_CODE,
  type HttpClientError,
  type HttpClientRequestConfig,
  type HttpClientRequesterConfig,
  type HttpClientResponse,
  type HttpClientSafeResponse,
  type Interceptor,
  type InterceptorManager,
  type RequestInterceptor,
  type ResponseInterceptor,
  type ResponseType,
} from "./types";

const DEFAULT_CONFIG: HttpClientRequestConfig = {
  timeout: 0,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => status >= 200 && status <= 300,
  responseType: "json",
  method: "GET",
};

export class HttpClientErrorImpl<TError = unknown>
  extends Error
  implements HttpClientError<TError>
{
  config: HttpClientRequesterConfig;
  request?: any;
  response?: HttpClientResponse;
  isHttpClientError?: boolean;
  code?: string;
  constructor(
    message?: string,
    options?: {
      config?: HttpClientRequestConfig;
      isHttpClientError: boolean;
      code?: string;
      request?: any;
      response?: HttpClientResponse;
    },
  ) {
    super(message);
    this.config = (options?.config ||
      DEFAULT_CONFIG) as HttpClientRequesterConfig;
    this.request = options?.request;
    this.response = options?.response;
    this.isHttpClientError = options?.isHttpClientError;
    this.code = options?.code;
  }
}

class InterceptorManagerImpl<T> implements InterceptorManager<T> {
  private interceptors: Array<{
    fulfilled: T | null;
    rejected: any;
  }> = [];

  use(onFulfilled?: T | undefined, onRejected?: any): number {
    this.interceptors.push({
      fulfilled: onFulfilled || null,
      rejected: onRejected,
    });
    return this.interceptors.length - 1;
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = { fulfilled: null, rejected: null };
    }
  }

  clear(): void {
    this.interceptors = [];
  }

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(fn);
  }
}

export class HttpClient {
  private config: HttpClientRequestConfig;
  public interceptors: {
    request: InterceptorManager<RequestInterceptor>;
    response: InterceptorManager<ResponseInterceptor>;
  };

  constructor(config: HttpClientRequestConfig = {}) {
    this.config = {
      ...config,
      ...DEFAULT_CONFIG,
    };

    this.interceptors = {
      request: new InterceptorManagerImpl<RequestInterceptor>(),
      response: new InterceptorManagerImpl<ResponseInterceptor>(),
    };
  }

  async requester<TData = any, TError = unknown, TBody = unknown>(
    config: HttpClientRequestConfig<TBody>,
  ): Promise<HttpClientResponse<TData>> {
    const mergedConfig = this.#mergeConfig(config);
    try {
      let finalConfig = await this.#applyRequestInterceptors(mergedConfig);
      const response = await this.#makeRequest<TData>(finalConfig);
      return await this.#applyResponseInterceptors<TData>(
        response,
        finalConfig,
      );
    } catch (error) {
      return await this.#applyResponseErrorInterceptors(
        error as HttpClientError<TError>,
      );
    }
  }

  static create(config: HttpClientRequestConfig): HttpClient {
    return new HttpClient(config);
  }

  async get<TData = any>(
    url: string,
    config?: HttpClientRequestConfig,
  ): Promise<HttpClientResponse<TData>> {
    return this.requester<TData>({
      ...config,
      method: "GET",
      url,
    });
  }

  async post<TData = any, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: HttpClientRequestConfig<TBody>,
  ): Promise<HttpClientResponse<TData>> {
    return this.requester<TData, TBody>({
      ...config,
      method: "POST",
      url,
      data,
    });
  }

  async put<TData = any, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: HttpClientRequestConfig<TBody>,
  ): Promise<HttpClientResponse<TData>> {
    return this.requester<TData, TBody>({
      ...config,
      method: "PUT",
      url,
      data,
    });
  }
  async patch<TData = any, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: HttpClientRequestConfig<TBody>,
  ): Promise<HttpClientResponse<TData>> {
    return this.requester<TData, TBody>({
      ...config,
      method: "PATCH",
      url,
      data,
    });
  }

  async delete<TData = any>(
    url: string,
    config?: HttpClientRequestConfig,
  ): Promise<HttpClientResponse<TData>> {
    return this.requester<TData>({
      ...config,
      method: "DELETE",
      url,
    });
  }
  async head<TData = any>(
    url: string,
    config?: HttpClientRequestConfig,
  ): Promise<HttpClientResponse<TData>> {
    return this.requester<TData>({
      ...config,
      method: "HEAD",
      url,
    });
  }
  async options<TData = any>(
    url: string,
    config?: HttpClientRequestConfig,
  ): Promise<HttpClientResponse<TData>> {
    return this.requester<TData>({
      ...config,
      method: "OPTIONS",
      url,
    });
  }

  #mergeConfig(config: HttpClientRequestConfig): HttpClientRequestConfig {
    return {
      ...this.config,
      ...config,
      headers: {
        ...this.config.headers,
        ...config.headers,
      },
    };
  }

  async #applyRequestInterceptors(
    config: HttpClientRequestConfig,
  ): Promise<HttpClientRequestConfig> {
    let finalConfig = config;

    if (!config.skipInterceptors && !config.skipRequestInterceptors) {
      this.interceptors.request.forEach(({ fulfilled }) => {
        if (fulfilled) {
          finalConfig = fulfilled(finalConfig);
        }
      });
    }

    return finalConfig;
  }

  async #applyResponseInterceptors<T>(
    response: HttpClientResponse<T>,
    config: HttpClientRequestConfig,
  ): Promise<HttpClientResponse<T>> {
    let finalResponse = response;

    if (!config.skipInterceptors && !config.skipResponseInterceptors) {
      this.interceptors.response.forEach(({ fulfilled }) => {
        if (fulfilled) {
          finalResponse = fulfilled(finalResponse) as HttpClientResponse<T>;
        }
      });
    }

    return finalResponse;
  }

  async #applyResponseErrorInterceptors<TError = unknown>(
    error: HttpClientError<TError>,
  ): Promise<never> {
    let finalError = error;

    this.interceptors.response.forEach(({ rejected }) => {
      if (rejected) {
        try {
          const result = rejected(finalError);
          if (result) {
            finalError = result;
          }
        } catch (e) {
          finalError = e as HttpClientError<TError>;
        }
      }
    });

    throw finalError;
  }

  #buildURL(
    baseURL: string = "",
    url: string = "",
    params?: Record<string, any>,
  ): string {
    let fullURL = url;

    if (baseURL && !url.startsWith("http")) {
      fullURL = baseURL.replace(/\/+$/, "") + "/" + url.replace(/^\/+/, "");
    }

    if (params) {
      const urlParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          urlParams.append(key, String(params[key]));
        }
      });

      const paramString = urlParams.toString();

      if (paramString) {
        fullURL += (fullURL.includes("?") ? "&" : "?") + paramString;
      }
    }
    return fullURL;
  }

  async #makeRequest<T>(
    config: HttpClientRequestConfig,
  ): Promise<HttpClientResponse<T>> {
    const url = this.#buildURL(config.baseURL, config.url, config.params);
    const headers: Record<string, string> = { ...config.headers };

    let body: string | FormData | undefined = undefined;
    const methodsWithBody = ["POST", "PUT", "PATCH"];
    const currentMethod = config.method || "GET";

    if (config.data && methodsWithBody.includes(currentMethod)) {
      if (config.transformRequest && config.transformRequest.length > 0) {
        let transformedData = config.data;
        config.transformRequest.forEach((transform) => {
          transformedData = transform(transformedData, headers);
        });
        body = transformedData;
      } else if (
        typeof config.data === "object" &&
        config.data !== null &&
        headers["Content-Type"]?.toLowerCase()?.includes("application/json")
      ) {
        body = JSON.stringify(config.data || {});
      } else {
        body = config.data;
      }
    }

    if (!body || !methodsWithBody.includes(currentMethod)) {
      if (headers["Content-Type"]) {
        delete headers["Content-Type"];
      }
      if (headers["content-type"]) {
        delete headers["content-type"];
      }
      body = undefined;
    }

    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout | undefined = undefined;

    if (config.timeout && config.timeout > 0) {
      timeoutId = setTimeout(() => controller.abort(), config.timeout);
    }

    try {
      const fetchConfig: RequestInit = {
        method: config.method,
        headers,
        credentials: config.withCredentials ? "include" : "same-origin",
        signal: controller.signal,
        cache: config.cache,
        next: config.next,
      };
      if (body !== undefined && body !== null && body !== "") {
        fetchConfig.body = body;
      }
      const response = await fetch(url, fetchConfig);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (config.validateStatus && !config.validateStatus(response.status)) {
        const error = new HttpClientErrorImpl(
          `Request failed with status code ${response.status}`,
          {
            config: config,
            code: response.status.toString(),
            isHttpClientError: true,
          },
        );

        try {
          const errorData = await this.#extractResponseData(
            response,
            config.responseType,
          );
          error.response = {
            data: errorData,
            status: response.status,
            statusText: response.statusText,
            headers: this.#extractHeaders(response),
            config,
          };
        } catch (e) {}
        throw error;
      }

      let data = await this.#extractResponseData<T>(
        response,
        config.responseType,
      );

      if (config.transformResponse && config.transformResponse.length > 0) {
        config.transformResponse.forEach((transform) => {
          data = transform(data);
        });
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this.#extractHeaders(response),
        config,
      };
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (typeof error === "object" && error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            const timeoutError = new HttpClientErrorImpl("Request timeout", {
              isHttpClientError: true,
              config: config,
              code: HTTP_CLIENT_ERROR_CODE.TIMEOUT,
            });
            throw timeoutError;
          }
        }

        if (error instanceof HttpClientErrorImpl) {
          if (!error.isHttpClientError) {
            const networkError = new HttpClientErrorImpl(
              `Network Error: ${error}`,
              {
                isHttpClientError: true,
                config: config,
                code: HTTP_CLIENT_ERROR_CODE.NETWORK_ERROR,
              },
            );
            throw networkError;
          }
        }
      }

      throw error;
    }
  }

  async #extractResponseData<TData = any>(
    response: Response,
    responseType?: ResponseType,
  ): Promise<TData> {
    switch (responseType) {
      case "text":
        return (await response.text()) as TData;
      case "blob":
        return (await response.blob()) as TData;
      case "arraybuffer":
        return (await response.arrayBuffer()) as TData;
      case "document":
        return (await response.text()) as TData;
      case "json":
      default:
        try {
          return (await response.json()) as TData;
        } catch (e) {
          return (await response.text()) as TData;
        }
    }
  }

  #extractHeaders(response: Response): Record<string, string> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }
}

export const safeHttpClient = async <
  TData = unknown,
  TErrorData = ApiBaseErrorResponse,
  TError = HttpClientError<TErrorData>,
>(
  fn: () => Promise<HttpClientResponse<TData>>,
): Promise<HttpClientSafeResponse<TData, TError>> => {
  try {
    const res = await fn();
    return [null, res.data];
  } catch (error) {
    return [error as TError, null];
  }
};

export const http = new HttpClient();

export const create = (config?: HttpClientRequestConfig): HttpClient => {
  return new HttpClient(config);
};

export const get = http.get.bind(http);
export const post = http.post.bind(http);
export const put = http.put.bind(http);
export const patch = http.patch.bind(http);
export const del = http.delete.bind(http);
export const head = http.head.bind(http);
export const options = http.options.bind(http);
export const requester = http.requester.bind(http);

export default http;
