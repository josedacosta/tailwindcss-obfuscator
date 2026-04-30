---
"tailwindcss-obfuscator": patch
---

CI: added a weekly version-watch cron (`Monday 08:00 UTC`) that surveils every package this project supports for SemVer-major bumps OR explicit breaking-change keywords in upstream release notes. Anti-overkill: patches and minors are intentionally not surfaced (Renovate handles those). Notification path is SMTP email when `SMTP_*` secrets are configured, GitHub-issue fallback otherwise. Adjustable via `.github/version-watch-config.json`.
