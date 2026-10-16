# Validation Record

Date: 2026-10-02

## Executed

Ran the exported `runChecks()` from `scripts/verify.mjs` in the available Node REPL runtime against temporary directories. All 10 checks passed:

1. Seven unique specialist definitions and eight role documents.
2. Generated adapter snapshots match the canonical roster and renderer.
3. Dry run creates no files.
4. Both-runtime installation preserves existing AGENTS.md, CLAUDE.md and Codex settings.
5. Reinstallation is idempotent and preserves edited PROJECT.md.
6. A conflicting definition stops the install before any new files are written.
7. Codex-only and Claude-only installation write only the selected runtime definitions.
8. Invalid options, missing target and a parent-file collision are rejected.
9. Symlink/junction destinations are refused without writes to their targets.
10. Markdown local links resolve.

The original root AGENTS.md was compared byte-for-byte and remained unchanged.

## Not executed

- Launching native Codex or Claude Code and observing their custom-agent loaders or actual delegation.
- Native runtime parsing of generated TOML/YAML; definitions were checked against the documented minimal format and generated snapshots.
- End-to-end implementation in a React/Next.js/.NET/NestJS application: this directory contains the reusable kit, not an application.
- Shell CLI execution in this session: process creation was denied by the environment; the same installer functions were exercised through Node REPL.

These checks establish installer behavior, not full runtime compatibility. Follow [the runtime setup guide](runtime-setup.md) and [pilot](pilot.md) in each installed runtime.
