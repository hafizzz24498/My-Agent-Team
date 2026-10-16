# Repository Guidelines

## Project Structure & Module Organization

This directory starts empty, with no application code, tests, assets, or project configuration. Establish the layout when adding the first implementation and describe it in `README.md`. For a code project, use `src/` for source, `tests/` for tests, `docs/` for documentation, and `assets/` for static resources where appropriate. Create directories only when they contain relevant files.

## Build, Test, and Development Commands

No build system, dependency manifest, or development commands are currently configured. When introducing tooling, provide reproducible commands for dependency installation, local execution, building, and testing in `README.md`. Explain required runtime versions and environment variables. Keep commands aligned with checked-in scripts; verify each command from the repository root before documenting it.

## Coding Style & Naming Conventions

No language-specific style or formatter has been selected. Follow the conventions of the chosen language and configure its formatter and linter with the first implementation. Use consistent indentation within each file and descriptive names for modules, functions, and variables. Use lowercase, hyphen-separated names for general documentation, such as `docs/local-setup.md`. Keep Markdown headings descriptive and examples executable.

## Testing Guidelines

No test framework or coverage threshold is configured. Select a framework appropriate to the implementation language when adding executable code. Document test discovery, file naming, and the test command. Cover new behavior and add regression tests for bug fixes. Keep test fixtures near their tests, and record any checks that could not run with the reason.

## Commit & Pull Request Guidelines

No Git metadata or commit history is present, so no existing message convention can be inferred. When version control is initialized, use concise, imperative commit subjects, such as `Add initial project setup`. Keep commits focused on one purpose. Pull requests should describe the change, its motivation, and validation performed; link relevant issues and include screenshots for visible interface changes.

## Security & Configuration

Keep credentials and machine-specific configuration outside committed files. When configuration is introduced, provide placeholder values in an example file and ignore local secrets and generated outputs. Update this guide as concrete project conventions replace the initial guidance.
