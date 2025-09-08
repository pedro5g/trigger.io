"use client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import type {
  HistoryMode,
  ParserWithDefaultValue,
  QueryStateConfig,
  SetQueryState,
  StateUpdater,
  UseQueryState,
  UseQueryStateOptions,
} from "./types";
import { readParam, subscribeQS, writeParam } from "./query-manager";

/** Sentinel value to represent null/undefined in external store */
const __NULL: unique symbol = Symbol("__@@NULL");

/**
 * Hook to manage URL search parameters with granular re-renders
 *
 * Unlike nuqs, this solution only re-renders components that use
 * the specific query parameter that changed, not all components
 * using any query parameter.
 *
 * @param key - The search parameter key
 * @param defaultValue - Default value when parameter is not present
 * @param options - Configuration options
 */

// Overload types allowed pass not equal args formats

export const useQueryState: UseQueryState = <T>(
  keyOrConfig: string | QueryStateConfig<any>,
  defaultValueOrParser?: T | ParserWithDefaultValue<T>,
  options?: UseQueryStateOptions<NonNullable<T>>,
): any => {
  const router = useRouter();
  const pathname = usePathname();

  const __options = Object.assign(options || {}, defaultValueOrParser);

  if (typeof keyOrConfig === "object") {
    const config = keyOrConfig as QueryStateConfig<any>;
    const results: any = {};
    const setters: any = {};

    for (const [key, parserOrOptions] of Object.entries(config)) {
      let finalOptions: UseQueryStateOptions<any>;
      let finalDefaultValue: any;

      if ("parse" in parserOrOptions && "serialize" in parserOrOptions) {
        const parser = parserOrOptions as ParserWithDefaultValue<any>;
        finalOptions = {
          parse: parser.parse,
          serialize: parser.serialize,
          equals: parser.equals,
        };
        finalDefaultValue = parser.defaultValue;
      } else {
        const { defaultValue, ...opts } = parserOrOptions as any;
        finalOptions = opts;
        finalDefaultValue = defaultValue;
      }

      const [value, setter] = useSingleQueryState(
        key,
        finalDefaultValue,
        finalOptions,
        { router, pathname },
      );
      results[key] = value;
      setters[key] = setter;
    }

    return [results, setters];
  }

  if (
    typeof defaultValueOrParser === "object" &&
    defaultValueOrParser !== null &&
    "parse" in (defaultValueOrParser as any) &&
    "serialize" in (defaultValueOrParser as any)
  ) {
    const parser = defaultValueOrParser as ParserWithDefaultValue<T>;
    return useSingleQueryState(
      keyOrConfig as string,
      parser.defaultValue,
      {
        parse: parser.parse as any,
        serialize: parser.serialize,
        equals: parser.equals,
        ...__options,
      },
      { router, pathname },
    );
  }

  return useSingleQueryState(
    keyOrConfig as string,
    defaultValueOrParser as T,
    __options,
    { router, pathname },
  );
};

function useSingleQueryState<T>(
  key: string,
  defaultValue: T,
  options?: UseQueryStateOptions<NonNullable<T>>,
  routerContext?: { router: ReturnType<typeof useRouter>; pathname: string },
): [T | null, SetQueryState<T>] {
  const router = routerContext?.router ?? useRouter();
  const pathname = routerContext?.pathname ?? usePathname();

  const parse =
    options?.parse ??
    ((v: string | null) => (v as unknown as T) ?? defaultValue);
  const serialize = options?.serialize ?? ((v: NonNullable<T>) => String(v));
  const historyMode = options?.history ?? "replace";
  const removeIfDefault = options?.removeIfDefault ?? true;
  const equals = options?.equals ?? Object.is;
  const shallow = options?.shallow ?? true;

  const getSnap = useCallback(() => {
    const value = readParam(key);
    return value ?? __NULL;
  }, [key]);

  const getServerSnap = useCallback(() => __NULL, []);

  const raw = useSyncExternalStore(
    (cb) => subscribeQS(cb, key),
    getSnap,
    getServerSnap,
  );

  // try get current value
  const currentValue = useMemo(() => {
    // if getting the sentry returns  the default value, the URL does't have the corresponding searchParam
    if (raw === __NULL) return defaultValue;
    try {
      const stringValue = String(raw);
      return parse(stringValue);
    } catch (error) {
      console.warn(`Error parsing query param "${key}":`, error);
      return defaultValue;
    }
  }, [raw, defaultValue, parse, key]);

  const checkEqual = (a: T | null, b: T | null) => {
    if (a === null && b === null) return true;
    if (a === null || a === undefined || b === null || b === undefined)
      return false;
    return equals(a, b);
  };

  const setValue = useCallback(
    ((
      valueOrUpdater: T | Partial<T> | StateUpdater<T> | null,
      mode?: HistoryMode,
    ) => {
      try {
        let nextState: T | null;

        if (typeof valueOrUpdater === "function") {
          nextState = (valueOrUpdater as StateUpdater<T>)(currentValue as T);
        } else if (
          typeof valueOrUpdater === "object" &&
          valueOrUpdater !== null &&
          !Array.isArray(valueOrUpdater) &&
          typeof currentValue === "object" &&
          currentValue !== null &&
          !Array.isArray(currentValue)
        ) {
          nextState = { ...currentValue, ...valueOrUpdater } as T;
        } else {
          nextState = valueOrUpdater as T;
        }

        if (checkEqual(nextState, currentValue)) {
          return;
        }

        if (
          nextState === null ||
          nextState === undefined ||
          (removeIfDefault && checkEqual(nextState, defaultValue))
        ) {
          const currentParam = readParam(key);
          if (currentParam !== null) {
            writeParam(key, null, mode ?? historyMode, {
              shallow,
              router,
              pathname,
            });
          }
          return;
        }

        const serialized = serialize(nextState);
        const currentParam = readParam(key);

        if (serialized === currentParam) {
          return;
        }

        writeParam(key, serialized, mode ?? historyMode, {
          shallow,
          router,
          pathname,
        });
      } catch (error) {
        console.warn(`Error setting query param "${key}":`, error);
      }
    }) as SetQueryState<T>,
    [
      currentValue,
      key,
      serialize,
      historyMode,
      removeIfDefault,
      defaultValue,
      equals,
      shallow,
      router,
      pathname,
    ],
  );

  return [currentValue, setValue];
}
