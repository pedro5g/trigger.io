import { cache } from "react";
import type {
  ParserConfig,
  QueryStateConfig,
  UseQueryStateOptions,
} from "./types";

// i based my implementation in:
// @reference https://github.com/47ng/nuqs/blob/next/packages/nuqs/src/parsers.ts#L7

// type inspiration - totality based in type narrowing and type branding
// @reference https://github.com/colinhacks/zod/blob/main/packages/zod/src/v3/helpers/util.ts#L80
type Flags = {
  HasDefault?: true;
  HasOptions?: true;
};
// "_F" underscore indicates internal use
type ParserBuilder<T, _F extends Flags = {}> = ParserConfig<T> &
  (_F["HasDefault"] extends true
    ? UseQueryStateOptions<T>
    : {
        withDefault<D>(defaultValue: D): ParserBuilder<
          T | D,
          _F & { HasDefault: true }
        > & {
          defaultValue: D;
        };
      }) &
  (_F["HasOptions"] extends true
    ? UseQueryStateOptions<T>
    : {
        defineOptions(
          options: Partial<
            Omit<UseQueryStateOptions<T>, keyof ParserConfig<T>>
          >,
        ): ParserBuilder<T, _F & { HasOptions: true }>;
      });

export function createParser<T>(config: ParserConfig<T>): ParserBuilder<T> {
  const base = {
    ...config,
    withDefault(defaultValue: unknown) {
      return {
        ...this,
        defaultValue,
      };
    },
    defineOptions(
      options: Partial<Omit<UseQueryStateOptions<T>, keyof ParserConfig<T>>>,
    ) {
      return {
        ...this,
        ...options,
      };
    },
  };

  return base as any;
}

export const qsParserBoolean = createParser<boolean>({
  parse: (qs) => {
    return qs === "true";
  },
  serialize: (qs) => (qs ? "true" : "false"),
});

export const qsParserString = createParser<string>({
  parse: (qs) => qs ?? "",
  serialize: (qs) => qs,
});

export const qsParserInteger = createParser<number>({
  parse: (qs) => {
    const int = parseInt(qs, 10);
    return Number.isInteger(int) ? int : null;
  },
  serialize: (qs) => Math.round(qs).toString(),
});

export const qsParserFloat = createParser<number>({
  parse: (qs) => {
    const float = parseFloat(qs);
    return Number.isFinite(float) ? float : null;
  },
  serialize: (qs) => qs.toString(),
});

function compareDates(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

export const qsParserTimestamp = createParser<Date>({
  parse: (qs) => {
    const ms = parseInt(qs, 10);
    return Number.isInteger(ms) ? new Date(ms) : null;
  },
  serialize: (qs) => qs.getTime().toString(),
  equals: compareDates,
});

export const qsParserDateTime = createParser<Date>({
  parse: (qs) => {
    const date = new Date(qs);
    return Number.isFinite(date.getTime()) ? date : null;
  },
  serialize: (qs) => qs.toISOString(),
  equals: compareDates,
});

export const qsParserISODate = createParser<Date>({
  parse: (qs) => {
    const date = new Date(qs + "T00:00:00.000Z");
    return Number.isFinite(date.getTime()) ? date : null;
  },
  serialize: (qs) => qs.toISOString().split("T")[0],
  equals: compareDates,
});

export const qsParserStringLiteral = <const Literal extends string>(
  literals: readonly Literal[],
) => {
  return createParser<Literal>({
    parse: (qs): Literal | null => {
      return literals.includes(qs as Literal) ? (qs as Literal) : null;
    },
    serialize: (qs) => qs,
  });
};

export const qsParserNumberLiteral = <const Literal extends number>(
  literals: readonly Literal[],
) => {
  return createParser<Literal>({
    parse: (qs): Literal | null => {
      const num = parseFloat(qs) as Literal;
      return literals.includes(num) ? num : null;
    },
    serialize: (qs) => qs.toString(),
  });
};

export const qsParserJson = <T>(validator?: (value: unknown) => value is T) => {
  return createParser<T>({
    parse: (qs): T | null => {
      try {
        const parsed = JSON.parse(qs);
        if (validator) {
          return validator(parsed) ? parsed : null;
        }
        return parsed;
      } catch {
        return null;
      }
    },
    serialize: (qs) => JSON.stringify(qs),
    equals: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });
};

export const qsParserArray = <T>(
  itemParser: ParserConfig<T>,
  separator: string = ",",
) => {
  const encodedSeparator = encodeURIComponent(separator);

  return createParser<T[]>({
    parse: (qs): T[] | null => {
      if (qs === null || qs === "") return [];

      return qs
        .split(separator)
        .map((item) => {
          const decoded = item.replaceAll(encodedSeparator, separator);
          return itemParser.parse(decoded);
        })
        .filter((item): item is T => item !== null);
    },
    serialize: (items) => {
      if (items.length === 0) return "";

      return items
        .map((item) => {
          const serialized = itemParser.serialize(item);
          return serialized?.replaceAll(separator, encodedSeparator);
        })
        .filter((item): item is string => item !== null)
        .join(separator);
    },
    equals: (a, b) => {
      if (a.length !== b.length) return false;
      const itemEquals = itemParser.equals ?? Object.is;
      return a.every((item, index) => itemEquals(item, b[index]));
    },
  });
};

export type SearchParams = Record<string, string | string[] | undefined>;

export type LoaderInput =
  | URL
  | Request
  | URLSearchParams
  | Record<string, string | string[] | undefined>
  | string;

type ParamsSchema<T> = {
  [K in keyof T]: T[K];
};

const createLoader = <T extends Record<string, any>>(
  parsers: QueryStateConfig<T>,
  strict: boolean = false,
) => {
  // overloads
  // ensures don't have type warns by promise don't resolved, we prevent this in fist if condition
  function loadSearchParams(
    input: LoaderInput,
    strict: boolean,
  ): ParamsSchema<T>;
  function loadSearchParams(
    input: Promise<LoaderInput>,
    strict: boolean,
  ): Promise<ParamsSchema<T>>;
  function loadSearchParams(
    input: LoaderInput | Promise<LoaderInput>,
    strict: boolean,
  ): Promise<ParamsSchema<T>> | ParamsSchema<T> {
    // suspense/async support
    // ensures loading.tsx or suspense its executed
    if (input instanceof Promise) {
      // resolver promise and reinvoke loadSearchParams
      return input.then((i) => loadSearchParams(i, strict)) as Promise<
        ParamsSchema<T>
      >;
    }

    const searchParam = extractSearchParams(input);
    const results = {} as {
      [K in keyof T]: T[K];
    };

    for (const key in parsers) {
      const parser = parsers[key] as UseQueryStateOptions<T[typeof key]>;

      const query = searchParam.get(key);

      if (query === null) {
        if (strict && parser.defaultValue === undefined) {
          throw new Error(
            `Error while parsing query \`${query}\` for key \`${String(
              key,
            )}\`: [Tip]: Set a default value to prevent this  `,
          );
        }
        results[key] = parser.defaultValue;
        continue;
      }

      let parsedValue: T[typeof key] | null;
      try {
        parsedValue = parser.parse ? parser.parse(query) : (query as any);
      } catch (error) {
        if (strict) {
          throw new Error(
            `Error while parsing query \`${query}\` for key \`${String(
              key,
            )}\`: ${String(error)}`,
          );
        }
        parsedValue = null;
      }

      if (strict && query && parsedValue === null) {
        throw new Error(
          `Failed to parse query \`${query}\` for key \`${String(
            key,
          )}\` (got null)`,
        );
      }

      results[key] = parsedValue ?? parser.defaultValue;
    }

    return results;
  }

  return loadSearchParams;
};

function extractSearchParams(input: LoaderInput): URLSearchParams {
  try {
    if (input instanceof Request) {
      return input.url
        ? new URL(input.url).searchParams
        : new URLSearchParams();
    }
    if (input instanceof URL) {
      return input.searchParams;
    }
    if (input instanceof URLSearchParams) {
      return input;
    }
    if (typeof input === "object") {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(input)) {
        if (Array.isArray(value)) {
          for (const v of value) {
            searchParams.append(key, v);
          }
        } else if (value !== undefined) {
          searchParams.set(key, value);
        }
      }
      return searchParams;
    }
    if (typeof input === "string") {
      if (URL.hasOwnProperty("canParse") && URL.canParse(input)) {
        return new URL(input).searchParams;
      }
      return new URLSearchParams(input);
    }
  } catch {}
  return new URLSearchParams();
}

// private property
const $input: unique symbol = Symbol("INPUT");
export function parseSearchParams<T extends Record<string, any>>(
  parser: QueryStateConfig<T>,
) {
  const loader = createLoader(parser);

  type Cache = {
    searchParams: ParamsSchema<T>;
    [$input]?: SearchParams;
  };

  const getCache = cache<() => Cache>(() => ({
    searchParams: {} as ParamsSchema<T>,
  }));

  function parseSync(searchParams: SearchParams, strict: boolean = false) {
    const cache = getCache();
    if (Object.isFrozen(cache.searchParams)) {
      if (cache[$input] && compareSearchParams(searchParams, cache[$input])) {
        return all();
      }
      throw new Error(
        "Search params cache already populated. Don't called `parse` twice",
      );
    }
    cache.searchParams = loader(searchParams, strict);
    cache[$input] = searchParams;
    return Object.freeze(cache.searchParams);
  }

  function parse(
    searchParam: SearchParams | Promise<SearchParams>,
    strict: boolean = false,
  ) {
    if (searchParam instanceof Promise) {
      return searchParam.then((searchParam) => parseSync(searchParam, strict));
    }
    return parseSync(searchParam, strict);
  }

  function all() {
    const { searchParams } = getCache();
    if (Object.keys(searchParams).length === 0) {
      throw new Error(
        "Empty search params cache. \n [Tips]: Search params can't be accessed in Layouts, it's one layer above. \n Try called `parser` in page.tsx before.",
      );
    }
    return searchParams;
  }

  function get<K extends keyof T>(key: K): ParamsSchema<T>[K] {
    const { searchParams } = getCache();
    const entry = searchParams[key];
    if (typeof entry === "undefined") {
      throw new Error(
        `Empty search params cache. Search params can't be accessed in Layouts. in get(${String(key)}) ` +
          "\n [Tips]: Search params can't be accessed in Layouts, it's one layer above. \n Try called `parser` in page.tsx before.",
      );
    }
    return entry;
  }

  return { parse, get, all };
}

export function compareSearchParams(a: SearchParams, b: SearchParams) {
  if (Object.is(a, b)) {
    return true;
  }
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}
