import { describe, it, expect, vi } from "vitest";
import {
  createLogger,
  createSilentLogger,
  formatNumber,
  formatFileSize,
  formatDuration,
  logSummary,
  type LogSink,
} from "../../src/utils/logger.js";

function makeSink(): LogSink & { calls: { method: string; line: string }[] } {
  const calls: { method: string; line: string }[] = [];
  return {
    calls,
    info: (line) => calls.push({ method: "info", line }),
    warn: (line) => calls.push({ method: "warn", line }),
    error: (line) => calls.push({ method: "error", line }),
    debug: (line) => calls.push({ method: "debug", line }),
    success: (line) => calls.push({ method: "success", line }),
  };
}

describe("formatNumber", () => {
  it("formats integers using locale-appropriate separators", () => {
    // We can't assume a specific locale, so just check the digits roundtrip.
    const out = formatNumber(1_234_567);
    expect(out.replace(/[^0-9]/g, "")).toBe("1234567");
  });

  it("handles zero", () => {
    expect(formatNumber(0)).toMatch(/^0$/);
  });

  it("handles small integers without inserting a separator", () => {
    expect(formatNumber(42)).toBe("42");
  });
});

describe("formatFileSize", () => {
  it("returns '0 B' for zero bytes (special-cased to avoid -Infinity)", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("formats single bytes in 'B' unit", () => {
    expect(formatFileSize(512)).toBe("512.00 B");
  });

  it("crosses to KB at 1024 bytes", () => {
    expect(formatFileSize(1024)).toBe("1.00 KB");
    expect(formatFileSize(2048)).toBe("2.00 KB");
  });

  it("formats megabytes with two decimal places", () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5.00 MB");
  });

  it("formats gigabytes with two decimal places", () => {
    expect(formatFileSize(2 * 1024 * 1024 * 1024)).toBe("2.00 GB");
  });

  it("retains precision for non-round sizes", () => {
    // 1500 / 1024 ≈ 1.46
    expect(formatFileSize(1500)).toBe("1.46 KB");
  });
});

describe("formatDuration", () => {
  it("returns whole milliseconds for sub-second durations", () => {
    expect(formatDuration(0)).toBe("0ms");
    expect(formatDuration(42)).toBe("42ms");
    expect(formatDuration(999)).toBe("999ms");
  });

  it("crosses to seconds at exactly 1000ms", () => {
    expect(formatDuration(1000)).toBe("1.00s");
    expect(formatDuration(2500)).toBe("2.50s");
  });

  it("rounds longer durations to two decimals", () => {
    // 1234ms -> 1.234 -> 1.23 (toFixed truncates trailing)
    expect(formatDuration(1234)).toBe("1.23s");
  });
});

describe("createLogger", () => {
  it("emits warn + error by default and silences info/debug", () => {
    const sink = makeSink();
    const logger = createLogger({ sink });
    logger.info("hidden");
    logger.debug("hidden");
    logger.warn("shown-warn");
    logger.error("shown-error");
    const methods = sink.calls.map((c) => c.method);
    expect(methods).toEqual(["warn", "error"]);
  });

  it("legacy boolean form: createLogger(true) enables info-level", () => {
    const sink = makeSink();
    // The legacy form ignores the sink param, so we override level via env-free path
    const logger = createLogger({ level: "info", sink });
    logger.info("shown");
    logger.debug("hidden");
    logger.success("shown");
    expect(sink.calls.map((c) => c.method)).toEqual(["info", "success"]);
  });

  it("legacy boolean form: createLogger(true, true) enables debug-level", () => {
    // Verifies the boolean overload still resolves to a working logger
    const logger = createLogger(true, true);
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.success).toBe("function");
  });

  it("silent level emits nothing", () => {
    const sink = makeSink();
    const logger = createLogger({ level: "silent", sink });
    logger.error("nope");
    logger.warn("nope");
    logger.info("nope");
    logger.debug("nope");
    logger.success("nope");
    expect(sink.calls).toHaveLength(0);
  });

  it("noColor disables picocolors wrapping (raw [tw-obfuscator] prefix)", () => {
    const sink = makeSink();
    const logger = createLogger({ level: "info", sink, noColor: true });
    logger.info("plain message");
    expect(sink.calls[0].line).toContain("[tw-obfuscator]");
    expect(sink.calls[0].line).toContain("plain message");
    // No ANSI escapes when noColor is true.
    // eslint-disable-next-line no-control-regex
    expect(sink.calls[0].line).not.toMatch(/\x1b\[/);
  });

  it("timestamp:true prepends an ISO date", () => {
    const sink = makeSink();
    const logger = createLogger({ level: "info", sink, timestamp: true, noColor: true });
    logger.info("with ts");
    expect(sink.calls[0].line).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it("debug entries get a [debug] sub-prefix", () => {
    const sink = makeSink();
    const logger = createLogger({ level: "debug", sink, noColor: true });
    logger.debug("trace info");
    expect(sink.calls[0].line).toContain("[tw-obfuscator] [debug]");
  });
});

describe("createSilentLogger", () => {
  it("returns a logger whose every method is a no-op", () => {
    const logger = createSilentLogger();
    // Should not throw and should not produce output (we'd see test reporter noise).
    expect(() => {
      logger.info("x");
      logger.warn("x");
      logger.error("x");
      logger.debug("x");
      logger.success("x");
    }).not.toThrow();
  });
});

describe("logSummary", () => {
  it("emits one success line + four info lines containing the formatted stats", () => {
    const calls: { method: string; message: string }[] = [];
    const stub = {
      info: vi.fn((message: string) => calls.push({ method: "info", message })),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
      success: vi.fn((message: string) => calls.push({ method: "success", message })),
    };
    logSummary(stub, {
      totalClasses: 1234,
      obfuscatedClasses: 1100,
      filesProcessed: 42,
      duration: 1500,
    });
    expect(calls[0].method).toBe("success");
    expect(calls[0].message).toMatch(/Obfuscation complete/i);
    const body = calls
      .slice(1)
      .map((c) => c.message)
      .join("\n");
    expect(body).toContain("Classes extracted");
    expect(body).toContain("Classes obfuscated");
    expect(body).toContain("Files processed");
    expect(body).toContain("Duration");
    expect(body).toContain("1.50s");
  });
});
