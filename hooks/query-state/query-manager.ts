import { isClientSide } from "@/lib/utils";
import type { HistoryMode, QSChangeEvent } from "./types";
import type { useRouter } from "next/navigation";

/**
 * Custom events used to intercept query state changes
 *
 * JS by default does not have a listener to this event.
 * Similar to how libs like react-router-dom and tanstack router create
 * custom events to support search params in their hooks.
 */
const QS_EVENT = "__qschange__" as const;

/**
 *
 * function to prevent execute some operation on first render, convert sync to async function
 *
 * this function try execute `callback` on next tick of JS EventLoop
 *
 * @reference https://github.com/47ng/nuqs/blob/next/packages/nuqs/src/lib/timeout.ts
 *
 * @param callback - function called after ticks based on `ms`
 * @param ms - 0 to exec on next trick
 * @param signal - AbortController instance to prevent memory leak - makes cleanup automatic
 */
export function timeout(
  callback: () => void,
  ms: number,
  signal: AbortSignal,
): void {
  function onTick() {
    callback();
    signal.removeEventListener("abort", onAbort);
  }
  const id = setTimeout(onTick, ms);
  function onAbort() {
    clearTimeout(id);
    signal.removeEventListener("abort", onAbort);
  }
  signal.addEventListener("abort", onAbort);
}
/**
 * Intercept and modify original history object
 * Change default behavior of pushState and replaceState methods
 *
 * This ensures consistency across the entire application, because all APIs
 * using these methods will have the modified behavior.
 *
 * To ensure total control over search params and cover most cases,
 * it's necessary to intercept the methods that manipulate the URL.
 * We use "Monkey patching" for this.
 *
 * @reference https://jscrambler.com/blog/an-analysis-of-code-poisoning-monkey-patching-javascript
 *
 * Next abuses it - from a look at
 * node_modules/.pnpm/next@15.4.5_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/components/app-router.js [line - 309]
 * node_modules/.pnpm/next@15.4.5_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/lib/patch-fetch.js [line - 706]
 *
 */
class HistoryMonkeyPatchSetUp {
  private originalPushState!: typeof window.history.pushState;
  private originalReplaceState!: typeof window.history.replaceState;
  private abortController!: AbortController;
  private static historyMonkeyPatch: HistoryMonkeyPatchSetUp | undefined;
  private isPatched = false;
  private subscribers = new Set<() => void>();

  private constructor() {
    if (!isClientSide()) return;

    this.originalPushState = window.history.pushState.bind(window.history);
    this.originalReplaceState = window.history.replaceState.bind(
      window.history,
    );
    this.abortController = new AbortController();
  }

  static getInstance(): HistoryMonkeyPatchSetUp {
    if (!this.historyMonkeyPatch) {
      return (this.historyMonkeyPatch = new HistoryMonkeyPatchSetUp());
    }
    return this.historyMonkeyPatch;
  }

  private handlerUrlChange(
    oldUrl: string,
    newUrl: string,
    method: "push" | "replace",
  ) {
    if (new URL(oldUrl).href === new URL(newUrl).href) return;

    const oldParams = new URLSearchParams(new URL(oldUrl).search);
    const newParams = new URLSearchParams(new URL(newUrl).search);

    const changedKeys = new Set<string>();

    const allKeys = new Set([
      ...Array.from(oldParams.keys()),
      ...Array.from(newParams.keys()),
    ]);

    for (const key of allKeys) {
      const oldValue = oldParams.get(key);
      const newValue = newParams.get(key);
      if (oldValue !== newValue) {
        changedKeys.add(key);
      }
    }

    if (changedKeys.size > 0) {
      // Schedule the event dispatch to avoid synchronous updates during render
      timeout(
        () => {
          window.dispatchEvent(
            new CustomEvent<QSChangeEvent>(QS_EVENT, {
              detail: {
                keys: Array.from(changedKeys),
                method,
                oldUrl,
                newUrl,
              },
            }),
          );
        },
        0,
        this.abortController.signal,
      );
    }

    // Schedule subscriber notifications asynchronously
    timeout(
      () => {
        this.subscribers.forEach((callback) => callback());
      },
      0,
      this.abortController.signal,
    );
  }

  subscribe(callback: () => void) {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  safePushState<T = any>(data: T, unused: string, url?: string | URL | null) {
    this.originalPushState(data, unused, url);
  }

  safeReplaceState<T = any>(
    data: T,
    unused: string,
    url?: string | URL | null,
  ) {
    this.originalReplaceState(data, unused, url);
  }

  patch() {
    if (this.isPatched || !isClientSide()) return;

    window.history.pushState = (data, unused, url) => {
      const oldUrl = window.location.href;
      this.originalPushState(data, unused, url);
      this.handlerUrlChange(oldUrl, window.location.href, "push");
    };

    window.history.replaceState = (data, unused, url) => {
      const oldUrl = window.location.href;
      this.originalReplaceState(data, unused, url);
      this.handlerUrlChange(oldUrl, window.location.href, "replace");
    };

    this.isPatched = true;
  }

  unpatch() {
    if (!this.isPatched || !isClientSide()) return;

    window.history.pushState = this.originalPushState;
    window.history.replaceState = this.originalReplaceState;

    this.subscribers.clear();

    this.abortController.abort();
    this.isPatched = false;
  }
}

export class QueryStateManager {
  private __subscribers = new Map<string, Set<() => void>>();
  private __isInitialized = false;
  private abortController!: AbortController;
  private historyMonkeyPatch = HistoryMonkeyPatchSetUp.getInstance();
  static queryStateManager: QueryStateManager | undefined;

  private constructor() {
    if (!isClientSide()) return;

    this.abortController = new AbortController();
    this.__isInitialized = false;
  }

  static getInstance() {
    if (!this.queryStateManager) {
      /**
       * Next turbopack é uma merda
       *
       * - Hot reload create multiples singletons
       *  In `dev mode` this conditional prevent the
       *  creation multiples instances
       *
       * @reference https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
       */
      if (
        typeof window !== "undefined" &&
        process.env.NODE_ENV === "development"
      ) {
        if (window.__QSCHANGE_INITIALIZED__) {
          return (this.queryStateManager = window.__QSCHANGE_INITIALIZED__);
        } else {
          this.queryStateManager = new QueryStateManager();
          window.__QSCHANGE_INITIALIZED__ = this.queryStateManager;
          return this.queryStateManager;
        }
      }
      return (this.queryStateManager = new QueryStateManager());
    }
    return this.queryStateManager;
  }

  initialize() {
    if (this.__isInitialized) return;

    this.historyMonkeyPatch.patch();

    window.addEventListener("popstate", this.handlerQSChange.bind(this));
    window.addEventListener(QS_EVENT, this.handlerQSChange.bind(this));

    this.__isInitialized = true;
  }

  private handlerQSChange(e?: Event) {
    // Schedule notifications asynchronously to avoid synchronous updates during render
    timeout(
      () => {
        if (this.nestingEvent(e)) {
          this.notifySubscribers(e.detail.keys);
        } else if (e?.type === "popstate") {
          // For popstate (browser back/forward), notify all subscribers
          this.notifySubscribers(Array.from(this.__subscribers.keys()));
        }
      },
      0,
      this.abortController.signal,
    );
  }

  /**
   * Check and validate if event matches QSChangeEvent interface
   * @param e - Event
   * @returns boolean and narrows type to CustomEvent<QSChangeEvent>
   */
  private nestingEvent(e?: Event): e is CustomEvent<QSChangeEvent> {
    return (
      e instanceof CustomEvent &&
      "keys" in (e.detail || {}) &&
      Array.isArray(e.detail?.keys) &&
      e.detail.keys.length > 0
    );
  }

  private notifySubscribers(keys: string[]) {
    keys.forEach((key) => {
      const callbacks = this.__subscribers.get(key);
      if (callbacks) {
        callbacks.forEach((callback) => callback());
      }
    });
  }

  subscribe(key: string, callback: () => void) {
    this.initialize();

    if (!this.__subscribers.has(key)) {
      this.__subscribers.set(key, new Set());
    }
    this.__subscribers.get(key)!.add(callback);

    return () => {
      const callbacks = this.__subscribers.get(key);
      if (callbacks) {
        callbacks.delete(callback);

        if (callbacks.size === 0) {
          this.__subscribers.delete(key);
        }
        this.abortController.abort();
      }
    };
  }

  silentUpdate(
    key: string,
    value: string | null,
    method: "push" | "replace" = "replace",
  ) {
    const url = new URL(window.location.href);

    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }

    if (method === "push") {
      this.historyMonkeyPatch.safePushState({}, "", url.toString());
    } else {
      this.historyMonkeyPatch.safeReplaceState({}, "", url.toString());
    }
  }

  // Add cleanup method for hot reload
  cleanup() {
    this.historyMonkeyPatch.unpatch();
    this.__subscribers.clear();
    this.__isInitialized = false;
    this.abortController.abort();
  }
}

export const qsManager = QueryStateManager.getInstance();

export function readParam(key: string): string | null {
  if (!isClientSide()) return null;
  return new URLSearchParams(window.location.search).get(key);
}

export function writeParam(
  key: string,
  serialized: string | null,
  mode: HistoryMode = "replace",
  options: {
    shallow?: boolean;
    router?: ReturnType<typeof useRouter>;
    pathname?: string;
  } = {},
) {
  if (!isClientSide()) return;

  const { shallow = false, router, pathname } = options;

  if (!shallow && router && pathname) {
    const currentParams = new URLSearchParams(window.location.search);

    if (serialized === null) {
      currentParams.delete(key);
    } else {
      currentParams.set(key, serialized);
    }

    const queryString = currentParams.toString();
    const fullPath = `${pathname}${queryString ? "?" + queryString : ""}`;

    if (mode === "push") {
      router.push(fullPath);
    } else {
      router.replace(fullPath);
    }
    return;
  }

  const url = new URL(window.location.href);
  const params = url.searchParams;

  if (serialized === null) {
    params.delete(key);
  } else {
    params.set(key, serialized);
  }

  const next = url.toString();

  if (mode === "push") {
    window.history.pushState({}, "", next);
  } else {
    window.history.replaceState({}, "", next);
  }
}

export function subscribeQS(callback: () => void, key: string) {
  if (!isClientSide()) return () => {};
  return qsManager.subscribe(key, callback);
}
