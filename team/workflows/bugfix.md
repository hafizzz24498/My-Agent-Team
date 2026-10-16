# Bug Fix Workflow

1. Lead records expected/actual behavior, affected scope and reproduction evidence. Separate a confirmed cause from a hypothesis.
2. Developer traces the failing path and checks adjacent callers. QA attempts reproduction; unavailable environments are recorded.
3. Agree the smallest correction that preserves intended business behavior. Include Security for security-related bugs and UX/UI for changed interactions.
4. Developer adds a meaningful regression check where feasible, applies the fix and runs relevant tests.
5. Independent Reviewer inspects the change. QA reruns the original reproduction and affected regression checks. Recheck any subsequent edits.
6. Documentation updates known limitations or release notes where user-visible behavior changed.
7. Lead applies checklists/done.md and reports cause, fix, evidence and remaining gaps. Do not call a bug fixed solely because the code compiles.
