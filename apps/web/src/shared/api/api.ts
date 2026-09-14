import type { Session } from '@checkout/contracts';

import { StorageKeys } from '@/shared/config';

export interface ApiInstanceConfig {
  baseURL: string;
  headers: Record<string, string>;
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  idempotencyKey?: string;
  signal?: AbortSignal;
  skipRes?: boolean;
}

export interface ApiInternalRequest {
  method: string;
  path: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  idempotencyKey?: string;
  skipRes?: boolean;
}

export interface ApiResContext<T = unknown> {
  request: ApiInternalRequest;
  data?: T;
  error?: ApiClientError;
}

export interface ApiErrorField {
  path: string;
  message: string;
}

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly fields?: ApiErrorField[];
  readonly requestId?: string;

  constructor(
    code: string,
    message: string,
    status: number,
    fields?: ApiErrorField[],
    requestId?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.fields = fields;
    this.requestId = requestId;
  }
}

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    fields?: ApiErrorField[];
  };
  meta?: { requestId?: string };
};

type ApiSuccessBody<T> = {
  data: T;
};

const isAbortError = (error: unknown) => {
  return error instanceof Error && error.name === 'AbortError';
};

const toApiClientError = (error: unknown) => {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (error instanceof SyntaxError) {
    return new ApiClientError('PARSE_ERROR', 'Не удалось разобрать ответ сервера.', 0);
  }

  return new ApiClientError(
    'NETWORK_ERROR',
    'Не удалось выполнить запрос. Проверьте соединение.',
    0,
  );
};

const createHttpError = (payload: ApiErrorBody, status: number) => {
  return new ApiClientError(
    payload.error?.code ?? 'INTERNAL_ERROR',
    payload.error?.message ?? 'Не удалось выполнить запрос.',
    status,
    payload.error?.fields,
    payload.meta?.requestId,
  );
};

const parseResponseBody = async <T>(response: Response) => {
  try {
    return (await response.json()) as ApiSuccessBody<T> & ApiErrorBody;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    throw new ApiClientError('PARSE_ERROR', 'Не удалось разобрать ответ сервера.', response.status);
  }
};

type RequestInterceptor = (request: ApiInternalRequest) => ApiInternalRequest;
type ResponseInterceptorResult = ApiResContext | { retry: true };
type ResponseInterceptor = (
  context: ApiResContext,
) => ResponseInterceptorResult | Promise<ResponseInterceptorResult>;

const SESSION_PATH = '/sessions';

export class ApiInstance {
  private config: ApiInstanceConfig;
  private baseURL: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  readonly interceptor = {
    req: (fn: RequestInterceptor) => {
      this.requestInterceptors.push(fn);
    },
    res: (fn: ResponseInterceptor) => {
      this.responseInterceptors.push(fn);
    },
  };

  constructor(config: ApiInstanceConfig) {
    this.config = config;
    this.baseURL = config.baseURL;
  }

  get<T>(path: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('GET', path, undefined, config);
  }

  post<T>(path: string, body?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('POST', path, body, config);
  }

  put<T>(path: string, body?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('PUT', path, body, config);
  }

  delete<T>(path: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('DELETE', path, undefined, config);
  }

  private buildUrl(path: string) {
    let url = this.baseURL;

    if (path) {
      url = url + path;
    }

    return url;
  }

  private buildHeaders(config?: ApiRequestConfig) {
    return {
      ...this.config.headers,
      ...config?.headers,
    };
  }

  private applyRequestInterceptors(request: ApiInternalRequest) {
    return this.requestInterceptors.reduce((next, intercept) => intercept(next), request);
  }

  private async applyResponseInterceptors(context: ApiResContext) {
    let local = context;

    for (const intercept of this.responseInterceptors) {
      const result = await intercept(local);

      if ('retry' in result) {
        return result;
      }

      local = result;
    }

    return local;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    config?: ApiRequestConfig,
    retried = false,
  ): Promise<T> {
    const prepared = this.applyRequestInterceptors({
      method,
      path,
      url: this.buildUrl(path),
      headers: this.buildHeaders(config),
      body,
      signal: config?.signal,
      idempotencyKey: config?.idempotencyKey,
      skipRes: config?.skipRes,
    });

    const hasBody =
      prepared.body !== undefined && prepared.method !== 'GET' && prepared.method !== 'DELETE';

    const headers = { ...prepared.headers };

    if (!hasBody) {
      delete headers['Content-Type'];
    }

    let context: ApiResContext<T>;

    try {
      const response = await fetch(prepared.url, {
        method: prepared.method,
        headers,
        signal: prepared.signal,
        body: hasBody ? JSON.stringify(prepared.body) : undefined,
      });

      if (response.status === 204) {
        context = { request: prepared, data: undefined };
      } else {
        const payload = await parseResponseBody<T>(response);

        if (!response.ok) {
          context = {
            request: prepared,
            error: createHttpError(payload, response.status),
          };
        } else {
          context = { request: prepared, data: payload.data };
        }
      }
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }

      context = {
        request: prepared,
        error: toApiClientError(error),
      };
    }

    if (!prepared.skipRes) {
      const intercepted = await this.applyResponseInterceptors(context);

      if ('retry' in intercepted && intercepted.retry && !retried) {
        return this.request<T>(method, path, body, config, true);
      }

      if (!('retry' in intercepted)) {
        context = intercepted as ApiResContext<T>;
      }
    }

    if (context.error) {
      throw context.error;
    }

    return context.data as T;
  }
}

export const api = new ApiInstance({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptor.req((request) => {
  const token = localStorage.getItem(StorageKeys.sessionToken);

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  if (request.idempotencyKey) {
    request.headers['Idempotency-Key'] = request.idempotencyKey;
  }

  return request;
});

api.interceptor.res(async (context) => {
  const { error, request } = context;

  if (error?.status === 401 && request.path !== SESSION_PATH) {
    const session = await api.post<Session>(SESSION_PATH, {}, { skipRes: true });

    localStorage.setItem(StorageKeys.sessionToken, session.token);

    return { retry: true };
  }

  if (error && error.status >= 500) {
    window.alert(error.message);
  }

  return context;
});
