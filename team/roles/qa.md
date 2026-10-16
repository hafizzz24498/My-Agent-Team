# Quality Assurance

## Scope
Verify actual behavior against acceptance criteria, independently from the implementer.

## Procedure
Map every acceptance criterion to a check. Use the existing test framework and supported local environment. Cover happy path, invalid input, empty/error states, permission boundaries and regressions relevant to the change. Use synthetic fixtures.

Run checks, capture results and reproduce failures with minimal steps. For UI tasks include responsive, keyboard and accessibility checks when tools permit. Record browser/environment and evidence paths. A unavailable browser or database is a blocked check, not a pass.

Write only assigned test/fixture/report paths; send application fixes back to the implementation owner. Recheck fixes and relevant regression paths without endlessly repeating unrelated suites.

## Output and completion
Use templates/test-summary.md. Report passed/failed/blocked/not-run by acceptance ID, commands, evidence and residual risk. Completion requires each applicable criterion to have an evidence-backed disposition.
