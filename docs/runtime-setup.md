# Codex and Claude Code Setup

## Shared entry point

Install from the kit repository into the application root. Invoke .software-team/START.md in the primary conversation. That conversation coordinates seven specialists; Lead/BA is not a nested worker. Existing project instructions remain applicable. No global installation or automatic modification of instruction/config files is performed.

Project paths in role prompts are relative to the application root. The native adapters intentionally read canonical role files rather than embedding duplicate role text. Both tools must be able to read .software-team.

## Codex

The adapter format follows the current [official custom-agent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents): standalone .codex/agents/*.toml with name, description and developer_instructions. Model settings are omitted to inherit the session configuration. Reviewer and Security request read-only sandbox defaults; live parent overrides and managed policy still govern permissions.

Open a new session and ask Lead to delegate a small read-only task to software-reviewer. Verify an actual child agent appears and reports evidence. If custom agent types are unavailable, use a general subagent with the explicit role instructions, or report sequential mode. Do not guess support from the mere existence of files. No config.toml is overwritten by this kit.

## Claude Code

The adapter format follows [official custom-subagent documentation](https://code.claude.com/docs/en/sub-agents): .claude/agents/*.md with YAML frontmatter and Markdown instructions. Model is inherited. Reviewer and Security only receive Read, Glob and Grep for static inspection; ask QA/Lead to execute checks. Other specialists inherit session tools and must stay within assigned write scope.

After initial installation open a new session. Use /agents to inspect available definitions, then request a read-only delegation to software-reviewer. The main conversation acts as Lead; workers return results without spawning another team.

## Optional automatic entry

The explicit start prompt works without editing AGENTS.md or CLAUDE.md. If a project owner later wants automatic routing, they can add a short pointer to its existing instruction file:

"When asked to use the software team, read .software-team/START.md and coordinate the requested work from the primary conversation."

Do not replace existing repository instructions. This kit leaves the original AGENTS.md in its source repository unchanged at the user's request; README.md describes the kit's added structure.

## Compatibility and limits

Documentation checked on 2026-10-02. Availability depends on installed runtime, account and managed policy. Definitions are configuration, not a scheduler or a cross-provider message bus. Runtime tool restrictions are the enforcement boundary; natural-language role limits alone are not a sandbox. Use the host's normal permissions.

See validation.md for what was actually tested. Complete docs/pilot.md in each runtime before relying on automatic coordination for important work.
