/**
 * Logger utility for tailwindcss-obfuscator.
 *
 * Provides a level-aware, structured logger. The default logger writes to
 * stdout/stderr with picocolors color formatting, but the implementation can
 * be replaced (e.g. for tests, JSON output, or piping into a host logger).
 */

import pc from "picocolors";
import type { Logger } from "../core/types.js";

const PREFIX = "[tw-obfuscator]";

/**
 * Log severity levels in ascending order of verbosity.
 *
 * - `silent`: no output
 * - `error`: only fatal failures
 * - `warn`: warnings + errors (default)
 * - `info`: informational messages + above
 * - `debug`: every diagnostic message
 */
export type LogLevel = "silent" | "error" | "warn" | "info" | "debug";

const LEVEL_ORDER: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

/**
 * Sink-like interface that accepts already-formatted log lines. The default
 * sink writes through `console.*`. Tests and host logger integrations can
 * provide their own sink to capture or redirect output.
 */
export interface LogSink {
  info(line: string, ...args: unknown[]): void;
  warn(line: string, ...args: unknown[]): void;
  error(line: string, ...args: unknown[]): void;
  debug(line: string, ...args: unknown[]): void;
  success(line: string, ...args: unknown[]): void;
}

const consoleSink: LogSink = {
  info: (line, ...args) => console.log(line, ...args),
  warn: (line, ...args) => console.warn(line, ...args),
  error: (line, ...args) => console.error(line, ...args),
  debug: (line, ...args) => console.log(line, ...args),
  success: (line, ...args) => console.log(line, ...args),
};

export interface CreateLoggerOptions {
  /** Highest level that will be emitted. */
  level?: LogLevel;
  /** Prefix every line with an ISO timestamp. */
  timestamp?: boolean;
  /** Disable color output (e.g. when stdout is not a TTY). */
  noColor?: boolean;
  /** Replace the default console-based sink. */
  sink?: LogSink;
}

function shouldLog(level: LogLevel, configured: LogLevel): boolean {
  return LEVEL_ORDER[level] <= LEVEL_ORDER[configured];
}

function format(
  prefix: string,
  message: string,
  color: ((s: string) => string) | null,
  withTimestamp: boolean
): string {
  const timestamp = withTimestamp ? `${new Date().toISOString()} ` : "";
  const body = `${timestamp}${prefix} ${message}`;
  return color ? color(body) : body;
}

/**
 * Create a configurable logger.
 *
 * Two call signatures are supported:
 * - `createLogger(verbose, debug)` — legacy boolean form (verbose enables
 *   info-level logging; debug enables debug-level).
 * - `createLogger(options)` — full configuration object.
 */
export function createLogger(
  verboseOrOptions: boolean | CreateLoggerOptions = false,
  debug = false
): Logger {
  let opts: Required<CreateLoggerOptions>;

  if (typeof verboseOrOptions === "boolean") {
    const verbose = verboseOrOptions;
    opts = {
      level: debug ? "debug" : verbose ? "info" : "warn",
      timestamp: false,
      noColor: false,
      sink: consoleSink,
    };
  } else {
    opts = {
      level: verboseOrOptions.level ?? "warn",
      timestamp: verboseOrOptions.timestamp ?? false,
      noColor: verboseOrOptions.noColor ?? false,
      sink: verboseOrOptions.sink ?? consoleSink,
    };
  }

  const color = opts.noColor
    ? { blue: null, yellow: null, red: null, gray: null, green: null }
    : { blue: pc.blue, yellow: pc.yellow, red: pc.red, gray: pc.gray, green: pc.green };

  return {
    info: (message, ...args) => {
      if (!shouldLog("info", opts.level)) return;
      opts.sink.info(format(PREFIX, message, color.blue, opts.timestamp), ...args);
    },
    warn: (message, ...args) => {
      if (!shouldLog("warn", opts.level)) return;
      opts.sink.warn(format(PREFIX, message, color.yellow, opts.timestamp), ...args);
    },
    error: (message, ...args) => {
      if (!shouldLog("error", opts.level)) return;
      opts.sink.error(format(PREFIX, message, color.red, opts.timestamp), ...args);
    },
    debug: (message, ...args) => {
      if (!shouldLog("debug", opts.level)) return;
      opts.sink.debug(format(`${PREFIX} [debug]`, message, color.gray, opts.timestamp), ...args);
    },
    success: (message, ...args) => {
      if (!shouldLog("info", opts.level)) return;
      opts.sink.success(format(PREFIX, message, color.green, opts.timestamp), ...args);
    },
  };
}

/**
 * Create a logger that drops every message. Useful for tests.
 */
export function createSilentLogger(): Logger {
  const noop = () => {};
  return {
    info: noop,
    warn: noop,
    error: noop,
    debug: noop,
    success: noop,
  };
}

/**
 * Format a number with locale-appropriate thousands separators.
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format a byte count as a human-readable size.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Format a duration in milliseconds.
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Log a summary of the obfuscation process.
 */
export function logSummary(
  logger: Logger,
  stats: {
    totalClasses: number;
    obfuscatedClasses: number;
    filesProcessed: number;
    duration: number;
  }
): void {
  logger.success("Obfuscation complete!");
  logger.info(`  Classes extracted: ${formatNumber(stats.totalClasses)}`);
  logger.info(`  Classes obfuscated: ${formatNumber(stats.obfuscatedClasses)}`);
  logger.info(`  Files processed: ${formatNumber(stats.filesProcessed)}`);
  logger.info(`  Duration: ${formatDuration(stats.duration)}`);
}
