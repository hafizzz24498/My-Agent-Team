# Release Summary Workflow

1. Lead identifies the exact baseline and target commit/change set, product version convention and intended audience. If no baseline is available, ask or clearly bound the supplied change list.
2. Documentation collects implemented feature changes, fixes, compatibility/migration notes and known issues from code and evidence.
3. QA supplies actual validation status. Reviewer/Security findings are included with disposition; unresolved release gates remain visible.
4. Documentation drafts templates/release.md and updates feature added-in/changed-in history and existing changelog.
5. Lead checks that every claim corresponds to the target snapshot and distinguishes kit version from product version.
6. Deliver the draft. Tagging, publication, production migration and deployment are separate actions requiring covering authorization; no deployment automation is included.
