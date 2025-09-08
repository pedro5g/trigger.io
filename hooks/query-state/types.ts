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
  parse?: (value: string | null) => T | null;
  serialize?: (value: T) => string;
  history?: HistoryMode;
  removeIfDefault?: boolean;
  equals?: (a: T, b: T) => boolean;
  shallow?: boolean;
}
export type StateUpdater<T> = (prevState: T) => T;
export type SetQueryState<T> = (
  value: T | Partial<T> | StateUpdater<T>,
  mode?: HistoryMode,
) => void;

export interface ParserConfig<T> {
  parse: (value: string | null) => T | null;
  serialize: (value: T) => string;
  equals?: (a: T, b: T) => boolean;
}

export interface ParserWithDefineOptions<T> extends ParserConfig<T> {
  defineOptions(
    options: Partial<Omit<UseQueryStateOptions<T>, keyof ParserConfig<T>>>,
  ): Omit<ParserWithDefineOptions<T>, "defineOptions">;
}

export interface ParserWithDefaultValue<T> extends ParserWithDefineOptions<T> {
  defaultValue: T;
}

export interface ParserChainable<T> extends ParserWithDefineOptions<T> {
  withDefault(defaultValue: T): ParserWithDefaultValue<T>;
}

export type QueryStateConfig<T extends Record<string, any>> = {
  [K in keyof T]:
    | ParserWithDefaultValue<T[K]>
    | (UseQueryStateOptions<T[K]> & { defaultValue: T[K] });
};

export type QueryStateValues<T extends Record<string, any>> = {
  [K in keyof T]: T[K] | null;
};

export type SetQueryStateMultiple<T extends Record<string, any>> = {
  [K in keyof T]: SetQueryState<T[K]>;
};

export type UseQueryState = {
  useQueryState<T extends Record<string, any>>(
    config: QueryStateConfig<NonNullable<T>>,
  ): [QueryStateValues<T>, SetQueryStateMultiple<T>];
  useQueryState<T>(
    key: string,
    parser: ParserWithDefaultValue<NonNullable<T>>,
  ): [T | null, SetQueryState<T>];
  useQueryState<T>(
    key: string,
    defaultValue: T,
    options?: UseQueryStateOptions<NonNullable<T>>,
  ): [T | null, SetQueryState<T>];
  useQueryState<T>(
    keyOrConfig: string | QueryStateConfig<any>,
    defaultValueOrParser?: T | ParserWithDefaultValue<T>,
    options?: UseQueryStateOptions<NonNullable<T>>,
  ): any;
}["useQueryState"];
