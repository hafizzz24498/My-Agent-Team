# Security Review Checklist

Apply to affected paths; record evidence and mark irrelevant items N/A with a reason.

- **Trust boundaries:** actors, protected data, tenant boundaries, public endpoints and external services.
- **Authentication/session:** token verification, session expiry/revocation, cookie properties, CSRF where cookies authenticate state changes.
- **Authorization:** enforce server-side role, resource ownership and tenant checks on every relevant operation, including bulk/export paths.
- **Inputs/sinks:** parameterized queries, output encoding, unsafe HTML, deserialization and command/path handling.
- **Uploads:** size/type/content checks, storage location and download authorization; filenames are untrusted.
- **Outbound requests:** destination controls, redirects and access to internal services where user input influences requests.
- **Secrets/privacy:** client bundles, URLs, logs, errors and repository content; cite locations without revealing values.
- **Abuse/data integrity:** rate/cost limits, retries, idempotency and concurrent state changes where relevant.
- **Dependencies:** installed versions and reachable use; cite verified advisories or mark status unverified.
- **Validation:** recommend synthetic cross-user/cross-tenant negative tests; report inspection scope and gaps.

This checklist supports code/design review. It does not authorize production scans or establish compliance certification.
