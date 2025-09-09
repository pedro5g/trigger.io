"use client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import type {
  HistoryMode,
  QueryStateConfig,
  QueryStateSetters,
  QueryStateValues,
  ReturnTypeResolveArgs,
  SetQueryState,
  StateUpdater,
  UseQueryStateOptions,
} from "./types";
import { readParam, subscribeQS, writeParam } from "./query-manager";

function createEqualityChecker<T>(equals?: (a: T, b: T) => boolean) {
  return (a: T | null, b: T | null): boolean => {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a === undefined || b === undefined) return false;
    return equals ? equals(a, b) : Object.is(a, b);
  };
}

function shouldRemoveParam<T>(
  value: T | null,
  defaultValue: T,
  removeIfDefault: boolean,
  checkEqual: (a: T | null, b: T | null) => boolean,
): value is null {
  return (
    value === null ||
    value === undefined ||
    (removeIfDefault && checkEqual(value, defaultValue))
  );
}

/**
 * resolver useQueryState args - recibes all hook args
 * and format its
 *
 * @param args - IArguments
 * @returns - {
 *     if first arg it going an object
 *    return an iterator {
 *      key,
 *      defaultValue,
 *      config
 *    }
 *
 *    other wise returns an {
 *      key,
 *      defaultValue,
 *      config
 *    }
 *
 *  }
 */
function resolveArgs<T>(args: IArguments): ReturnTypeResolveArgs<T> {
  if (args.length === 1 && typeof args[0] === "object") {
    return {
      isObject: true,
      *[Symbol.iterator]() {
        //https://blog.risingstack.com/async-iterators-in-node-js/
        const items = Object.entries<UseQueryStateOptions<T>>(args[0]);
        for (const [key, item] of items) {
          const { defaultValue, ...rest } = item;
          yield {
            key,
            defaultValue: defaultValue,
            config: {
              ...rest,
            },
          };
        }
      },
    };
  }
  if (
    args.length === 2 &&
    typeof args[0] === "string" &&
    typeof args[1] === "object"
  ) {
    const key = args[0];
    const { defaultValue, ...rest } = args[1] as UseQueryStateOptions<T>;

    return {
      isObject: false,
      key,
      defaultValue: defaultValue,
      config: {
        ...rest,
      },
    };
  }
  const key = args[0];
  const defaultValue: T = args[1];
  const config = args[2] as Omit<UseQueryStateOptions<T>, "defaultValue">;

  return {
    isObject: false,
    key,
    defaultValue,
    config,
  };
}

/** Sentinel value to represent null/undefined in external store */
const __NULL: unique symbol = Symbol("__@@NULL");

/**
 * Hook to manage URL query parameters with granular re-renders.
 *
 * Unlike libraries like `nuqs`, this hook only re-renders components that
 * depend on the specific query parameter that changed, instead of re-rendering
 * all consumers of any query parameter.
 *
 * ### Overloads
 * ```ts
 * // 1. Object mode (multiple keys at once)
 * function useQueryState<T extends Record<string, any>>(
 *   config: QueryStateConfig<T>,
 * ): [QueryStateValues<T>, QueryStateSetters<T>];
 *
 * // 2. Key + parser/serializer
 * function useQueryState<T>(
 *   key: string,
 *   parser: UseQueryStateOptions<T>,
 * ): [T | null, SetQueryState<T>];
 *
 * // 3. Key + default value
 * function useQueryState<T>(
 *   key: string,
 *   defaultValue: T,
 *   options?: UseQueryStateOptions<T>,
 * ): [T | null, SetQueryState<T>];
 * ```
 *
 * ### Examples
 *
 * #### Single state with default value
 * ```tsx
 * const [page, setPage] = useQueryState("page", 1);
 * setPage(2); // => URL: /?page=2
 * ```
 *
 * #### State with parser/serializer
 * ```tsx
 * const [date, setDate] = useQueryState("date", {
 *   defaultValue: new Date(),
 *   parse: (v) => (v ? new Date(v) : null),
 *   serialize: (d) => d.toISOString(),
 * });
 * setDate(new Date("2025-09-09")); // => URL: /?date=2025-09-09T00%3A00%3A00.000Z
 * ```
 *
 * #### Multiple states (object mode)
 * ```tsx
 * const [values, setters] = useQueryState({
 *   page: { defaultValue: 1 },
 *   search: { defaultValue: "" },
 *   showFilters: { defaultValue: false },
 * });
 *
 * setters.page(values.page + 1); // => URL: /?page=2&search=&showFilters=false
 * ```
 *
 * @param args - Can be either:
 *   - An object config (multiple keys at once)
 *   - A single key + parser/serializer
 *   - A single key + default value (+ options)
 * @returns A tuple `[value, setter]` or `[values, setters]` depending on usage
 */

// Overload types allowed pass not equal args formats
export function useQueryState<T extends Record<string, any>>(
  config: QueryStateConfig<T>,
): [QueryStateValues<T>, QueryStateSetters<T>];
export function useQueryState<T>(
  key: string,
  parser: UseQueryStateOptions<T>,
): [T, SetQueryState<T>];
export function useQueryState<T>(
  key: string,
  defaultValue: T,
  options?: UseQueryStateOptions<T>,
): [T, SetQueryState<T>];
export function useQueryState<
  T,
  _T extends Record<string, any> = T extends Record<string, any> ? T : any,
>() {
  const router = useRouter();
  const pathname = usePathname();
  // arguments is a local variable dispose within all function in JS (but arrow functions don't have this variable)
  // this key word agrupe all args on an array order by index
  //
  const result = resolveArgs<T>(arguments);

  if (result.isObject) {
    const entries = useMemo(() => [...result], [result]);

    const results = {} as QueryStateValues<_T>;
    const setters = {} as QueryStateSetters<_T>;
    // don't worry, it's not two loops lined up
    // entries is an iterador and uses a yield internally
    // then both loops works in the same tick on demand
    for (const { key, defaultValue, config } of entries) {
      const [value, setter] = useSingleQueryState<_T[typeof key] | any>(
        key,
        defaultValue,
        config,
        { router, pathname },
      );
      results[key as keyof _T] = value;
      setters[key as keyof _T] = setter;
    }

    return [results, setters];
  }

  const { key, defaultValue, config } = result;

  return useSingleQueryState(key, defaultValue, config, { router, pathname });
}

function useSingleQueryState<T>(
  key: string,
  defaultValue: T,
  options?: Omit<UseQueryStateOptions<T>, "defaultValue">,
  routerContext?: { router: ReturnType<typeof useRouter>; pathname: string },
): [T, SetQueryState<T>] {
  const router = routerContext?.router ?? useRouter();
  const pathname = routerContext?.pathname ?? usePathname();

  const config = useMemo(
    () => ({
      parse:
        options?.parse ?? ((v: string) => (v as unknown as T) ?? defaultValue),
      serialize: options?.serialize ?? ((v: T) => String(v)),
      history: options?.history ?? ("replace" as const),
      removeIfDefault: options?.removeIfDefault ?? true,
      shallow: options?.shallow ?? true,
      checkEqual: createEqualityChecker(options?.equals),
    }),
    [
      options?.parse,
      options?.serialize,
      options?.history,
      options?.removeIfDefault,
      options?.shallow,
      options?.equals,
      defaultValue,
    ],
  );

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
      return config.parse(stringValue) ?? defaultValue;
    } catch (error) {
      console.warn(`Error parsing query param "${key}":`, error);
      return defaultValue;
    }
  }, [raw, defaultValue, config.parse, key]);

  const setValue = useCallback<SetQueryState<T>>(
    ((valueOrUpdater: T | StateUpdater<T> | Partial<T>, mode?: HistoryMode) => {
      try {
        let nextState: T;

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

        if (config.checkEqual(nextState, currentValue)) {
          return;
        }

        const actualMode = mode ?? config.history;
        const shallow = config.shallow;
        if (
          shouldRemoveParam(
            nextState,
            defaultValue,
            config.removeIfDefault,
            config.checkEqual,
          )
        ) {
          const currentParam = readParam(key);
          if (currentParam !== null) {
            writeParam(key, null, actualMode, {
              shallow,
              router,
              pathname,
            });
          }
          return;
        }

        const serialized = config.serialize(nextState);
        const currentParam = readParam(key);

        if (serialized === currentParam) {
          return;
        }

        writeParam(key, serialized, actualMode, {
          shallow,
          router,
          pathname,
        });
      } catch (error) {
        console.warn(`Error setting query param "${key}":`, error);
      }
    }) as SetQueryState<T>,
    [currentValue, key, config, defaultValue, router, pathname],
  );

  return [currentValue, setValue];
}
