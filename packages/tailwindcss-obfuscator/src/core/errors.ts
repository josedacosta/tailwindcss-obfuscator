/**
 * Typed error hierarchy for the obfuscator.
 *
 * Public consumers can `instanceof`-check these to react to specific failure
 * modes (a missing mapping is recoverable; a transformer crash is not).
 */

/**
 * Base class for any error originating from the obfuscator. All other
 * obfuscator-specific errors extend this one.
 */
export class ObfuscatorError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ObfuscatorError";
  }
}

/**
 * Failure during the extraction phase (file scan, regex match, AST parse for
 * extraction).
 */
export class ExtractionError extends ObfuscatorError {
  readonly filePath?: string;

  constructor(message: string, opts: { filePath?: string; cause?: unknown } = {}) {
    super(message, opts.cause !== undefined ? { cause: opts.cause } : undefined);
    this.name = "ExtractionError";
    this.filePath = opts.filePath;
  }
}

/**
 * Failure while transforming a file (CSS, JSX, HTML).
 */
export class TransformError extends ObfuscatorError {
  readonly filePath?: string;

  constructor(message: string, opts: { filePath?: string; cause?: unknown } = {}) {
    super(message, opts.cause !== undefined ? { cause: opts.cause } : undefined);
    this.name = "TransformError";
    this.filePath = opts.filePath;
  }
}

/**
 * Failure persisting or loading the class-mapping file on disk.
 */
export class MappingPersistenceError extends ObfuscatorError {
  readonly mappingPath?: string;

  constructor(message: string, opts: { mappingPath?: string; cause?: unknown } = {}) {
    super(message, opts.cause !== undefined ? { cause: opts.cause } : undefined);
    this.name = "MappingPersistenceError";
    this.mappingPath = opts.mappingPath;
  }
}

/**
 * Failure loading the user configuration file.
 */
export class ConfigError extends ObfuscatorError {
  readonly configPath?: string;

  constructor(message: string, opts: { configPath?: string; cause?: unknown } = {}) {
    super(message, opts.cause !== undefined ? { cause: opts.cause } : undefined);
    this.name = "ConfigError";
    this.configPath = opts.configPath;
  }
}
