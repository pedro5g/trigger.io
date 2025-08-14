import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  LORDICON_LIBRARY,
  LORDICON_THEMES,
  type LordIconName,
  type LordIconTheme,
} from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLordIconSrc = (name: LordIconName): string => {
  return LORDICON_LIBRARY[name];
};

export const isValidLordIconName = (name: string): name is LordIconName => {
  return name in LORDICON_LIBRARY;
};

export const getAllLordIconNames = (): LordIconName[] => {
  return Object.keys(LORDICON_LIBRARY) as LordIconName[];
};

export const getLordIconTheme = (theme: LordIconTheme) => {
  return LORDICON_THEMES[theme];
};

export const sleep = async (ms: number = 200) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

type LogLevel = "log" | "warn" | "error" | "info";

const levelStyles: Record<LogLevel, string> = {
  log: "color: #22c55e; font-weight: bold;",
  info: "color: #2b90d9; font-weight: bold;",
  warn: "color: #d9822b; font-weight: bold;",
  error: "color: #d92b2b; font-weight: bold;",
};

function log(level: LogLevel, ...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console[level](`%c[${level.toUpperCase()}] `, levelStyles[level], ...args);
  }
}

export const logger = {
  log: (...args: unknown[]) => log("log", ...args),
  info: (...args: unknown[]) => log("info", ...args),
  warn: (...args: unknown[]) => log("warn", ...args),
  error: (...args: unknown[]) => log("error", ...args),
};

export const isClientSide = () => typeof window !== "undefined";
