import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LORDICON_THEMES, type LordIconTheme } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const getInitials = (fullname: string): string => {
  return (
    fullname
      .trim()
      .toUpperCase()
      .split(" ")
      .map((c) => c[0])
      .slice(0, 2)
      .join("") || "NA"
  );
};
