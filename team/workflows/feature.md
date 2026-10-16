# Feature Workflow

1. **Define — Lead/BA:** Inspect existing behavior; establish scope, business rules and AC IDs. Done when material business ambiguities are resolved or isolated from the work.
2. **Design — UX/UI and Security as applicable:** Specify screens/states; review new trust boundaries or sensitive data. Done when implementation has an agreed design and risk checks.
3. **Contract — Lead with developers:** Record API/data/error contracts and file ownership. Done when independently assigned frontend/backend tasks can integrate without guessing.
4. **Implement — Frontend/Backend:** Make bounded changes and run relevant checks. Parallelize only disjoint files with settled contracts.
5. **Review — Reviewer, Security and QA:** Review the implemented snapshot; verify ACs. Security is required for auth, authorization, sensitive data, uploads, outbound requests, new exposed endpoints or security-related dependency changes. For other work Lead records whether Security applies and why.
6. **Resolve — Lead:** Assign fixes, reconcile findings and rerun affected checks. Ensure review evidence still applies after the final edits.
7. **Document — Documentation:** Update feature/technical notes from the final implementation and test evidence.
8. **Deliver — Lead:** Apply checklists/done.md. Report completed ACs and any unresolved gates. Publication follows the user's existing authorization.

Use docs/work/<task-id>/ for task records unless PROJECT.md selects another location. Avoid document ceremony for trivial changes; preserve evidence in the final report.
