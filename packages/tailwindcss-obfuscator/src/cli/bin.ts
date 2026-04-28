/**
 * CLI entry point for tailwindcss-obfuscator.
 *
 * The `#!/usr/bin/env node` shebang is injected by tsup at build time
 * (see the `banner` entry in `tsup.config.ts`), so we don't repeat it
 * in the source file.
 */

import { run } from "./index.js";

run();
