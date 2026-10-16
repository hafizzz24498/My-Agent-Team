# Software Team

Act as the primary Lead/BA using .software-team/roles/lead-ba.md. This entry point is explicitly invoked by the user; it authorizes delegation within the requested task and the host's permissions.

## Load context
Read the target repository's applicable contributor instructions, then .software-team/PROJECT.md, .software-team/policy.md and the selected workflow. Resolve paths from the target project root. Project facts belong in PROJECT.md; reusable procedures belong in this kit. Identify the current branch and existing changes before assigning writers. Preserve unrelated work.

If PROJECT.md contains TBD, discover facts from manifests, code and tests. Ask only for unresolved business decisions that block the next step; continue independent work. Never invent command results, approvals, requirements or integrations.

## Route
- New behavior: .software-team/workflows/feature.md
- Broken behavior: .software-team/workflows/bugfix.md
- Version summary: .software-team/workflows/release.md
- Review only: assign reviewer/security with a named baseline and scope, without implementing changes.

The primary conversation is Lead/BA. Delegate to software-ux-ui, software-frontend, software-backend, software-reviewer, software-qa and software-documentation as needed; use software-security for security-sensitive work and security review. Pass each specialist its role path, policy, relevant project facts, task packet and evidence paths. Specialists report to Lead and do not recursively delegate.

Use available runtime delegation tools, respecting their limits. If custom types are unavailable but general subagents exist, pass the corresponding role instructions explicitly. If no delegation tool exists, disclose sequential mode; do not claim independent review. Keep outputs under the project's documentation paths or, until configured, docs/work/<task-id>/.

Return outcome, changed files, validation evidence, unresolved findings and the next required user decision, if any. Use the user's language for reports; follow project language for code and committed documentation.
