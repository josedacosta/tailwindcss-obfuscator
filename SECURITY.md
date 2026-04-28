# Security Policy

## Supported Versions

We provide security updates for the latest minor release on the `main` branch. Older versions may receive critical fixes at the maintainers' discretion.

| Version  | Supported   |
| -------- | ----------- |
| latest   | Yes         |
| < latest | Best effort |

## Reporting a Vulnerability

Please **do not** open public issues for security vulnerabilities.

Use one of the following private channels:

1. **GitHub Security Advisories** (preferred): open a draft advisory at
   <https://github.com/josedacosta/tailwindcss-obfuscator/security/advisories/new>
2. **Email**: [contact@josedacosta.info](mailto:contact@josedacosta.info)
3. **Maintainer**: [josedacosta.info](https://www.josedacosta.info)

We will acknowledge your report within 72 hours and aim to provide a remediation timeline within 7 days. Coordinated disclosure is appreciated.

## Scope

In scope:

- The published `tailwindcss-obfuscator` npm package and its CLI.
- Plugins exposed under `tailwindcss-obfuscator/{vite,webpack,rollup,esbuild,nuxt}`.
- Build artifacts produced by the obfuscation pipeline.

Out of scope:

- Sample applications under `apps/` (used for end-to-end testing only).
- Vulnerabilities in third-party dependencies (please report upstream).
