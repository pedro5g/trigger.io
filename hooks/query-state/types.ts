import type { QueryStateManager } from "./query-manager";

declare global {
  interface Window {
    __QSCHANGE_INITIALIZED__?: QueryStateManager;
  }
}

export interface QSChangeEvent {
  keys: string[];
  method?: "push" | "replace";
  oldUrl?: string;
  newUrl?: string;
}

export type HistoryMode = "replace" | "push";
export interface UseQueryStateOptions<T> {
  parse: (value: string) => T | null;
  serialize?: (value: T) => string;
  history?: HistoryMode;
  removeIfDefault?: boolean;
  equals?: (a: T, b: T) => boolean;
  shallow?: boolean;
  readonly defaultValue: T;
}

export type StateUpdater<T> = (prevState: T) => T;
export interface SetQueryState<T> {
  (value: T, mode?: HistoryMode): void;
  (updater: StateUpdater<T>, mode?: HistoryMode): void;
  (partial: Partial<T>, mode?: HistoryMode): void;
}

export interface ParserConfig<T> {
  parse: (value: string) => T | null;
  serialize: (value: T) => string;
  equals?: (a: T, b: T) => boolean;
}

export type QueryStateConfig<T extends Record<string, any>> = {
  readonly [K in keyof T]: UseQueryStateOptions<T[K]>;
};

export type QueryStateValues<T extends Record<string, any>> = {
  [K in keyof T]: T[K];
};

export type QueryStateSetters<T extends Record<string, any>> = {
  [K in keyof T]: SetQueryState<T[K]>;
};

export type SetQueryStateMultiple<T extends Record<string, any>> = {
  [K in keyof T]: SetQueryState<T[K]>;
};

export type ReturnTypeResolveArgs<T> =
  | {
      isObject: true;
      [Symbol.iterator]: () => Generator<
        {
          key: string;
          defaultValue: T;
          config: {
            parse: (value: string) => T | null;
            serialize?: (value: T) => string;
            history?: HistoryMode;
            removeIfDefault?: boolean;
            equals?: (a: T, b: T) => boolean;
            shallow?: boolean;
          };
        },
        void,
        unknown
      >;
    }
  | {
      isObject: false;
      key: string;
      defaultValue: T;
      config: Omit<UseQueryStateOptions<T>, "defaultValue">;
    };
