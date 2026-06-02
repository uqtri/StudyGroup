# Defect Report

Defects are mapped to **Function Code**, **UTCID** (decision-table test case), and **Decision Table condition** that exposed the issue.

| ID | Function Code | UTCID | Condition Category | Sub Condition | Module | Description | Status |
|----|---------------|-------|-------------------|---------------|--------|-------------|--------|
| DEF-001 | setUserStatus | UTCID02 | Input: status (body) | INACTIVE rejected by validation | Users | `users.validation.js` used `isIn(['ACTIVE', 'SUSPENDED'])`, omitting `INACTIVE`. Validation failed before service logic ran. | FIXED |
| DEF-002 | setUserStatus | UTCID01 | Input: status (body) | INACTIVE | Users | After DEF-001 fix, UTCID01 happy path for INACTIVE status confirmed passing in `users.service.test.js` (UTCID01). | VERIFIED |

---

## Defect–UTCID Traceability Notes

- **DEF-001** was found while executing **UTCID02** (Validation Error) and **UTCID01** (Happy Path) rows for `setUserStatus` Confirm: Return Status matrix.
- Expected: `400` only for invalid status values; `200` for ACTIVE, INACTIVE, SUSPENDED.
- Actual (before fix): `400` for INACTIVE due to validation schema gap.
- Fix: Added `INACTIVE` to allowed status array in `users.validation.js`.
- Regression test: `UTCID01 - should update status if requester is admin` and validation cases in Decision Table UTCID02 column.

---

## Open Observations (Code vs API Inventory — not defects, documented in Decision Tables)

| Function Code | API Inventory Statement | Source Code Behavior |
|---------------|-------------------------|----------------------|
| markAttendance | Creator or LEADER marks others | Only session **creator** may mark others |
| updateResourceFolder | Creator or LEADER edits | Only **group leader/creator** may edit |
| removePost / removeComment | Author or LEADER/ADMIN | **Author only** |
| listPosts / getPostById | Group-scoped access implied | Auth required; no membership check in service |

These discrepancies are reflected in Decision Tables (source-code driven) and should be reconciled in API inventory or implementation in a future sprint.
