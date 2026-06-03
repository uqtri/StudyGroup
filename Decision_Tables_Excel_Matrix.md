# Excel Matrix Format

> Single merged decision matrix per function code.
> **Decision Table Rules:** (1) Each UTCID = one execution path. (2) Within the same condition group, only one mutually-exclusive sub-condition is `O` per UTCID. (3) Every `O` maps to a real scenario. (4) Every condition row is mapped to at least one UTCID. (5) Sections: Precondition, Input, Repository, Security, Business Rule, Confirm, Result. (6) Preserve UTCIDs and scenarios.
> UTCID convention: **UTCID01** = Happy Path | **UTCID02** = Validation Error | **UTCID03** = Business Rule Error | **UTCID04** = Authorization Error | **UTCID05** = Exception / Dependency Failure | Additional UTCIDs for extra branches.

**Column structure:** `Condition` | `Sub Condition` | `UTCID01` â€¦ `UTCID0N`

**Row groups:**
- **Condition** â†’ Precondition, Input (req.body), Repository, Security, Business Rule
- **Confirm** â†’ Return Status, Return Body, Exception, Log Message
- **Result** â†’ Type, Pass/Fail, Executed Date, Defect ID


## Module: Auth

### Function Code: `register`

**Service:** Authentication Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| â€” Condition â€” |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: email: valid@email.com | O |  |  | O | O |
| Input (req.body) | Input: email: duplicate@email.com (already registered) |  |  | O |  |  |
| Input (req.body) | Input: email: invalid-email |  | O |  |  |  |
| Input (req.body) | Input: email: null / missing |  |  |  |  |  |
| Input (req.body) | Input: email: empty string |  |  |  |  |  |
| Input (req.body) | Input: password: validPassword123 (8+ chars, uppercase, digit) | O |  | O | O | O |
| Input (req.body) | Input: password: invalid format (missing uppercase/digit/length) |  | O |  |  |  |
| Input (req.body) | Input: password: null / missing |  |  |  |  |  |
| Input (req.body) | Input: password: empty string |  |  |  |  |  |
| Input (req.body) | Input: fullName: valid name (2-100 chars) | O |  | O | O | O |
| Input (req.body) | Input: fullName: invalid length (<2 or >100) |  | O |  |  |  |
| Input (req.body) | Input: fullName: null / missing |  |  |  |  |  |
| Repository | authRepository.findByEmail: User Not Found | O |  |  | O | O |
| Repository | authRepository.findByEmail: Duplicate User |  |  | O |  |  |
| Repository | authRepository.findByEmail: Query Error |  | O |  |  |  |
| Repository | authRepository.findRoleByName(MEMBER): Role Found | O |  |  |  | O |
| Repository | authRepository.findRoleByName(MEMBER): Role Not Found |  |  |  | O |  |
| Repository | authRepository.createUser: Success | O |  |  |  |  |
| Repository | authRepository.createUser: Query Error |  |  |  |  | O |
| Repository | authRepository.createRefreshToken: Success | O |  |  |  |  |
| Repository | authRepository.createRefreshToken: Query Error |  |  |  |  | O |
| Security | bcrypt.hash: Success | O |  |  |  |  |
| Security | bcrypt.hash: Error |  |  |  |  | O |
| Security | jwt.sign (access): Success | O |  |  |  |  |
| Security | jwt.sign (access): Fail |  |  |  |  | O |
| Security | jwt.sign (refresh): Success | O |  |  |  |  |
| Security | jwt.sign (refresh): Fail |  |  |  |  | O |
| Business Rule | Email Registration: Email Available | O |  |  |  | O |
| Business Rule | Email Registration: Email Already Registered |  |  | O |  |  |
| Business Rule | Default Role: MEMBER Role Configured | O |  |  |  | O |
| Business Rule | Default Role: MEMBER Role Missing |  |  |  | O |  |
| â€” Confirm â€” |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |
| Return Status | 400 |  | O |  | O |  |
| Return Status | 409 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { user, accessToken, refreshToken } | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Email already registered |  |  | O |  |  |
| Return Body | Default role not configured |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.conflict (Email exists) |  |  | O |  |  |
| Exception | ApiError.badRequest (No role) |  |  |  | O |  |
| Exception | Prisma/bcrypt/jwt Error |  |  |  |  | O |
| Log Message | Registration successful | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Conflict: email exists |  |  | O |  |  |
| Log Message | Default role missing |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| â€” Result â€” |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `login`

**Service:** Authentication Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| â€” Condition â€” |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  | O |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  | O |
| Precondition | JWT Service Fail |  |  |  |  | O |  |
| Precondition | bcrypt Service OK | O | O | O | O |  | O |
| Precondition | bcrypt Service Fail |  |  |  |  | O |  |
| Precondition | Cloudinary Service OK | O | O | O | O |  | O |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |  |
| Precondition | LiveKit Service OK | O | O | O | O |  | O |
| Precondition | LiveKit Service Fail |  |  |  |  | O |  |
| Input (req.body) | Input: email: valid@email.com | O |  | O | O | O | O |
| Input (req.body) | Input: email: nonexistent@email.com |  |  |  |  |  |  |
| Input (req.body) | Input: email: invalid-email |  | O |  |  |  |  |
| Input (req.body) | Input: email: null / missing |  |  |  |  |  |  |
| Input (req.body) | Input: password: validPassword123 | O |  | O | O | O |  |
| Input (req.body) | Input: password: wrongPassword |  |  |  |  |  | O |
| Input (req.body) | Input: password: null / missing |  | O |  |  |  |  |
| Input (req.body) | Input: password: empty string |  |  |  |  |  |  |
| Repository | authRepository.findByEmail: User Found | O |  | O | O |  | O |
| Repository | authRepository.findByEmail: User Not Found |  | O |  |  |  |  |
| Repository | authRepository.findByEmail: Query Error |  |  |  |  | O |  |
| Repository | authRepository.createRefreshToken: Success | O |  |  |  |  |  |
| Security | bcrypt.compare: TRUE | O |  |  |  |  |  |
| Security | bcrypt.compare: FALSE |  |  |  |  |  | O |
| Security | bcrypt.compare: Error |  | O |  |  |  |  |
| Security | jwt.sign: Success | O |  |  |  |  |  |
| Security | jwt.sign: Fail |  |  |  |  | O |  |
| Security | User Status: ACTIVE | O |  |  |  |  | O |
| Security | User Status: INACTIVE |  |  | O |  |  |  |
| Security | User Status: SUSPENDED |  |  |  | O |  |  |
| Business Rule | Account Status: ACTIVE (login allowed) | O |  |  |  |  |  |
| Business Rule | Account Status: INACTIVE (login denied) |  |  | O |  |  |  |
| Business Rule | Account Status: SUSPENDED (login denied) |  |  |  | O |  |  |
| Business Rule | Credentials: Password Match | O |  |  |  |  |  |
| Business Rule | Credentials: Password Mismatch |  |  |  |  |  | O |
| â€” Confirm â€” |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |  |
| Return Status | 401 |  |  |  |  |  | O |
| Return Status | 403 |  |  | O | O |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | { user, accessToken, refreshToken } | O |  |  |  |  |  |
| Return Body | Validation error |  | O |  |  |  |  |
| Return Body | Invalid credentials |  |  |  |  |  | O |
| Return Body | Account banned message |  |  |  | O |  |  |
| Return Body | Account is not active |  |  | O |  |  |  |
| Exception | None | O |  |  |  |  |  |
| Exception | ApiError.badRequest |  | O |  |  |  |  |
| Exception | ApiError.unauthorized |  |  |  |  |  | O |
| Exception | ApiError.forbidden (SUSPENDED) |  |  |  | O |  |  |
| Exception | ApiError.forbidden (INACTIVE) |  |  | O |  |  |  |
| Log Message | Login successful | O |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Invalid credentials |  |  |  |  |  | O |
| Log Message | Account banned |  |  |  | O |  |  |
| â€” Result â€” |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | Wrong Password |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `me`

**Service:** Authentication Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| â€” Condition â€” |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Repository | prisma.user.findFirst (auth middleware): ACTIVE user found | O |  |  |  |  |
| Repository | prisma.user.findFirst (auth middleware): null (inactive/deleted) |  |  | O |  | O |
| Repository | authRepository.findById (service): User Found | O |  |  |  |  |
| Repository | authRepository.findById (service): User Not Found |  |  | O |  | O |
| Repository | authRepository.findById (service): Query Error |  | O |  |  |  |
| Security | Authorization Bearer token: Present | O |  |  |  |  |
| Security | Authorization Bearer token: Absent |  |  |  | O |  |
| Security | jwt.verify (access): Success | O |  |  |  |  |
| Security | jwt.verify (access): Invalid Signature |  |  |  | O |  |
| Security | jwt.verify (access): Expired Token |  |  |  |  |  |
| Security | jwt.verify (access): Error |  | O |  |  |  |
| Security | User Status (middleware): ACTIVE | O |  |  |  |  |
| Security | User Status (middleware): INACTIVE / deletedAt set |  |  |  | O |  |
| Business Rule | Controller calls authService.getProfile(req.user.id) | O |  |  |  |  |
| â€” Confirm â€” |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 401 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Sanitized user profile | O |  |  |  |  |
| Return Body | Access token required / Invalid token |  |  |  | O |  |
| Return Body | User not found |  |  | O |  |  |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository/Dependency Error |  |  |  |  | O |
| Log Message | Operation successful | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Business rule rejected |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| â€” Result â€” |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `refresh`

**Service:** Authentication Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-----------|---------------|---|---|---|---|---|---|---|
| â€” Condition â€” |  |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  | O | O |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  | O | O |
| Precondition | JWT Service Fail |  |  |  |  | O |  |  |
| Precondition | bcrypt Service OK | O | O | O | O |  | O | O |
| Precondition | bcrypt Service Fail |  |  |  |  | O |  |  |
| Precondition | Cloudinary Service OK | O | O | O | O |  | O | O |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |  |  |
| Precondition | LiveKit Service OK | O | O | O | O |  | O | O |
| Precondition | LiveKit Service Fail |  |  |  |  | O |  |  |
| Input (req.body) | Input: refreshToken (body/cookie): present valid string | O |  |  | O | O | O | O |
| Input (req.body) | Input: refreshToken (body/cookie): absent / null / empty |  |  | O |  |  |  |  |
| Input (req.body) | Input: refreshToken (body/cookie): invalid JWT string |  | O |  |  |  |  |  |
| Repository | authRepository.findRefreshToken: Stored token found with user | O |  |  |  |  | O | O |
| Repository | authRepository.findRefreshToken: Not Found |  |  | O |  | O |  |  |
| Repository | authRepository.findRefreshToken: Query Error |  |  |  |  |  |  |  |
| Repository | stored.expiresAt: >= now | O |  |  |  |  |  |  |
| Repository | stored.expiresAt: < now (expired) |  |  |  |  | O |  |  |
| Repository | authRepository.deleteRefreshToken: Success (rotation) | O |  | O |  |  | O | O |
| Repository | authRepository.createRefreshToken: Success | O |  | O |  |  | O | O |
| Security | verifyRefreshToken: Success | O |  | O |  |  |  |  |
| Security | verifyRefreshToken: Invalid Signature |  |  |  | O |  |  |  |
| Security | verifyRefreshToken: Expired Token |  |  |  |  |  |  |  |
| Security | verifyRefreshToken: Error |  |  |  |  |  |  |  |
| Security | stored.user.status: ACTIVE | O |  |  |  |  |  |  |
| Security | stored.user.status: INACTIVE |  |  |  | O |  | O | O |
| Security | stored.user.status: SUSPENDED |  |  |  |  |  |  |  |
| Business Rule | Token Rotation: SHA-256 hash before DB lookup | O |  |  |  |  |  |  |
| Business Rule | Token Rotation: Delete old token, issue new pair on success |  | O |  |  |  |  |  |
| â€” Confirm â€” |  |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |  |  |
| Return Status | 401 |  |  | O | O | O |  |  |
| Return Status | 403 |  |  |  |  |  | O | O |
| Return Status | 500 |  |  |  |  |  |  |  |
| Return Body | { user, accessToken, refreshToken } | O |  |  |  |  |  |  |
| Return Body | Refresh token required |  |  | O |  |  |  |  |
| Return Body | Invalid / expired refresh token |  |  |  | O | O |  |  |
| Return Body | Account banned / not active |  |  |  |  |  | O | O |
| Exception | None | O |  |  |  |  |  |  |
| Exception | ApiError.badRequest |  | O |  |  |  |  |  |
| Exception | ApiError.unauthorized |  |  | O | O | O |  |  |
| Exception | ApiError.forbidden |  |  |  |  |  | O | O |
| Log Message | Operation successful | O |  |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |  |
| Log Message | Business rule rejected |  |  | O |  |  |  |  |
| Log Message | Authorization denied |  |  |  | O |  |  |  |
| Log Message | Unhandled exception |  |  |  |  | O |  |  |
| â€” Result â€” |  |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | Forbidden - Inactive Account | Forbidden - Suspended Account |
| Pass/Fail |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |

---

### Function Code: `logout`

**Service:** Authentication Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| â€” Condition â€” |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  | O |
| Input (req.body) | Input: refreshToken (body/cookie): present | O |  |  |  |
| Input (req.body) | Input: refreshToken (body/cookie): absent |  | O | O |  |
| Input (req.body) | Input: req.user.id: present (from authenticate) | O | O |  |  |
| Input (req.body) | Input: req.user.id: absent |  |  | O |  |
| Repository | authRepository.deleteRefreshToken: Called when refreshToken present | O |  |  |  |
| Repository | authRepository.deleteRefreshToken: Error swallowed (.catch) |  | O |  |  |
| Repository | authRepository.deleteUserRefreshTokens: Called when no token + userId |  | O |  |  |
| Repository | authRepository.deleteUserRefreshTokens: Query Error | O |  |  |  |
| Security | authenticate middleware: PASS | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  | O |
| Business Rule | Branch: if (refreshToken) â†’ deleteRefreshToken | O |  |  |  |
| Business Rule | Branch: else if (userId) â†’ deleteUserRefreshTokens |  | O |  |  |
| Business Rule | Branch: Always returns true from service |  |  | O |  |
| â€” Confirm â€” |  |  |  |  |  |
| Return Status | 200 | O | O | O |  |
| Return Status | 401 |  |  |  | O |
| Return Body | Logged out successfully | O | O | O |  |
| Return Body | Unauthorized |  |  |  | O |
| Exception | None | O | O | O |  |
| Exception | ApiError.unauthorized |  |  |  | O |
| Log Message | Logged out successfully | O | O | O |  |
| Log Message | Auth failed |  |  |  | O |
| â€” Result â€” |  |  |  |  |  |
| Type |  | Happy Path - Refresh Token Provided | Happy Path - userId Only | Happy Path - Neither Token Nor userId | Authorization Error |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---


## Module: Users

### Function Code: `getUserById`

**Service:** User Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| â€” Condition â€” |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: id (param): Existing User ID |  |  |  | O | O |
| Input (req.body) | Input: id (param): Invalid UUID |  |  | O |  |  |
| Repository | usersRepository.findById: User Found (deletedAt: null) |  |  | O |  |  |
| Repository | usersRepository.findById: User Not Found |  |  |  |  |  |
| Repository | usersRepository.findById: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS / FAIL |  |  |  | O |  |
| Business Rule | Lookup: formatUser maps roles array | O | O |  |  |  |
| â€” Confirm â€” |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Formatted user | O |  |  |  |  |
| Return Body | User not found |  |  | O |  |  |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository/Dependency Error |  |  |  |  | O |
| Log Message | Operation successful | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Business rule rejected |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| â€” Result â€” |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `listUsers`

**Service:** User Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| â€” Condition â€” |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: page (query): valid int >= 1 / default | O |  | O | O | O |
| Input (req.body) | Input: limit (query): valid int 1-100 / default | O |  | O | O | O |
| Input (req.body) | Input: search (query): optional string | O |  |  |  |  |
| Input (req.body) | Input: status (query): ACTIVE / INACTIVE / SUSPENDED / invalid |  | O | O | O |  |
| Repository | usersRepository.findMany: Success | O |  |  |  |  |
| Repository | usersRepository.findMany: Query Error |  |  |  |  | O |
| Repository | usersRepository.count: Success | O |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  | O | O |  |
| Security | authorize(ADMIN): PASS / FAIL |  |  | O | O |  |
| Business Rule | Filter: query.status â†’ where.status | O |  |  |  |  |
| Business Rule | Filter: query.search â†’ OR fullName/email contains |  | O |  |  |  |
| â€” Confirm â€” |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Paginated users | O |  |  |  |  |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository/Dependency Error |  |  |  |  | O |
| Log Message | Operation successful | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Business rule rejected |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| â€” Result â€” |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `removeUser`

**Service:** User Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| â€” Condition â€” |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: id (param): valid UUID / invalid UUID |  | O |  |  |  |
| Repository | usersRepository.softDelete: Success (deletedAt + status INACTIVE) | O | O |  |  |  |
| Repository | usersRepository.softDelete: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS / FAIL |  |  | O | O |  |
| Security | authorize(ADMIN): PASS / FAIL |  |  | O | O |  |
| Business Rule | Soft Delete: No explicit not-found check in service | O | O |  |  |  |
| â€” Confirm â€” |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | User deactivated (null) | O |  |  |  |  |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository/Dependency Error |  |  |  |  | O |
| Log Message | Operation successful | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Business rule rejected |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| â€” Result â€” |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `setUserStatus`

**Service:** User Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 | UTCID08 |
|-----------|---------------|---|---|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  | O | O | O |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  | O | O | O |
| Precondition | JWT Service Fail |  |  |  |  | O |  |  |  |
| Precondition | bcrypt Service OK | O | O | O | O |  | O | O | O |
| Precondition | bcrypt Service Fail |  |  |  |  | O |  |  |  |
| Precondition | Cloudinary Service OK | O | O | O | O |  | O | O | O |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |  |  |  |
| Precondition | LiveKit Service OK | O | O | O | O |  | O | O | O |
| Precondition | LiveKit Service Fail |  |  |  |  | O |  |  |  |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O |  |  | O | O | O |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |  |  |
| Input (req.params) | Input: id (param): Existing User ID | O |  |  |  |  | O |  | O |
| Input (req.params) | Input: id (param): Non-Existing User ID |  |  |  |  |  |  | O |  |
| Input (req.body) | Input: status (body): ACTIVE | O |  |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): INACTIVE |  |  |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): SUSPENDED |  |  |  |  |  | O |  |  |
| Input (req.body) | Input: status (body): Invalid value |  | O |  |  |  |  |  |  |
| Repository | usersRepository.findById (requester): Found | O |  | O | O |  | O |  | O |
| Repository | usersRepository.findById (requester): Query Error |  |  |  |  | O |  |  |  |
| Repository | usersRepository.findById (target): Found | O |  |  |  |  | O |  | O |
| Repository | usersRepository.findById (target): Not Found |  |  |  |  |  |  | O |  |
| Repository | usersRepository.findById (target): Query Error |  |  |  |  | O |  |  |  |
| Repository | usersRepository.update: Success | O |  |  |  |  | O |  |  |
| Repository | usersRepository.update: Query Error |  |  |  |  | O |  |  |  |
| Repository | usersRepository.revokeRefreshTokens: Called on SUSPENDED |  |  |  |  |  | O |  |  |
| Repository | usersRepository.revokeRefreshTokens: Query Error |  |  |  |  | O |  |  |  |
| Security | authorize(ADMIN) middleware: PASS | O | O | O |  |  | O | O | O |
| Security | authorize(ADMIN) middleware: FAIL |  |  |  | O |  |  |  |  |
| Security | requesterIsAdmin (service check): TRUE | O |  | O |  |  | O | O | O |
| Security | requesterIsAdmin (service check): FALSE |  |  |  | O |  |  |  |  |
| Security | targetIsAdmin: TRUE |  |  |  |  |  |  |  | O |
| Security | targetIsAdmin: FALSE | O |  |  |  |  | O | O |  |
| Business Rule | id === requesterId: TRUE |  |  | O |  |  |  |  |  |
| Business Rule | id === requesterId: FALSE | O |  |  |  |  | O | O | O |
| Business Rule | status SUSPENDED → revokeRefreshTokens: Triggered |  |  |  |  |  | O |  |  |
| Business Rule | status SUSPENDED → revokeRefreshTokens: Not Triggered | O |  |  |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  | O |  |  |
| Return Status | 400 |  | O | O |  |  |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |  | O |
| Return Status | 404 |  |  |  |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |  |  |  |
| Return Body | Updated user with new status | O |  |  |  |  | O |  |  |
| Return Body | Validation error details |  | O |  |  |  |  |  |  |
| Return Body | Cannot change your own account status |  |  | O |  |  |  |  |  |
| Return Body | Forbidden (not admin) |  |  |  | O |  |  |  |  |
| Return Body | Internal server error |  |  |  |  | O |  |  |  |
| Return Body | User not found |  |  |  |  |  |  | O |  |
| Return Body | Cannot change an admin account status |  |  |  |  |  |  |  | O |
| Exception | None | O |  |  |  |  | O |  |  |
| Exception | ApiError.badRequest (validation) |  | O |  |  |  |  |  |  |
| Exception | ApiError.badRequest (self status change) |  |  | O |  |  |  |  |  |
| Exception | ApiError.forbidden (not admin) |  |  |  | O |  |  |  |  |
| Exception | ApiError.notFound (user not found) |  |  |  |  |  |  | O |  |
| Exception | ApiError.forbidden (target is admin) |  |  |  |  |  |  |  | O |
| Exception | Repository / Dependency Error |  |  |  |  | O |  |  |  |
| Log Message | User status updated successfully | O |  |  |  |  | O |  |  |
| Log Message | Refresh tokens revoked (SUSPENDED) |  |  |  |  |  | O |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |  |  |
| Log Message | Cannot change own status |  |  | O |  |  |  |  |  |
| Log Message | Authorization denied (not admin) |  |  |  | O |  |  |  |  |
| Log Message | User not found |  |  |  |  |  |  | O |  |
| Log Message | Cannot change admin status |  |  |  |  |  |  |  | O |
| Log Message | Unhandled exception |  |  |  |  | O |  |  |  |
| — Result — |  |  |  |  |  |  |  |  |  |
| Type |  | Happy Path - ACTIVE | Validation Error | Business Rule - Self Change | Authorization Error | Exception / Dependency Failure | Happy Path - SUSPENDED | Business Rule - User Not Found | Business Rule - Target is Admin |
| Pass/Fail |  |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |  |

---

### Function Code: `updateUser`

**Service:** User Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  | O |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  | O |
| Precondition | JWT Service Fail |  |  |  | O |  |
| Precondition | bcrypt Service OK | O | O | O |  | O |
| Precondition | bcrypt Service Fail |  |  |  | O |  |
| Precondition | Cloudinary Service OK | O | O | O |  | O |
| Precondition | Cloudinary Service Fail |  |  |  | O |  |
| Precondition | LiveKit Service OK | O | O | O |  | O |
| Precondition | LiveKit Service Fail |  |  |  | O |  |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O |  | O |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |
| Input (req.body) | Input: fullName (body): valid string 2-100 chars | O |  |  |  | O |
| Input (req.body) | Input: fullName (body): invalid length (<2 or >100) |  | O |  |  |  |
| Input (req.body) | Input: bio (body): valid string max 500 | O |  |  |  | O |
| Input (req.body) | Input: bio (body): exceeds 500 chars |  | O |  |  |  |
| Input (req.body) | Input: avatar (body): valid URL | O |  |  |  | O |
| Input (req.body) | Input: avatar (body): invalid URL |  | O |  |  |  |
| Repository | usersRepository.findById (requester): Found (ADMIN) when id !== requesterId |  |  |  |  | O |
| Repository | usersRepository.findById (requester): Found (non-ADMIN) when id !== requesterId |  |  | O |  |  |
| Repository | usersRepository.findById (requester): Not called when id === requesterId | O |  |  |  |  |
| Repository | usersRepository.update: Success | O |  |  |  | O |
| Repository | usersRepository.update: Query Error |  |  |  | O |  |
| Security | authenticate middleware: PASS | O | O | O |  | O |
| Security | authenticate middleware: FAIL |  |  |  | O |  |
| Security | Self Update: id === requesterId → allowed | O |  |  |  |  |
| Security | Admin Update: requester has ADMIN role |  |  |  |  | O |
| Security | Forbidden: Non-admin updating other user |  |  | O |  |  |
| Business Rule | Update Fields: fullName, bio, avatar only | O |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  | O |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 401 |  |  |  | O |  |
| Return Status | 403 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  |  |
| Return Body | Updated user object | O |  |  |  | O |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Unauthorized |  |  |  | O |  |
| Return Body | Forbidden |  |  | O |  |  |
| Exception | None | O |  |  |  | O |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.unauthorized |  |  |  | O |  |
| Exception | ApiError.forbidden |  |  | O |  |  |
| Exception | Repository / Dependency Error |  |  |  |  |  |
| Log Message | User updated successfully | O |  |  |  | O |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Authorization denied |  |  | O | O |  |
| Log Message | Unhandled exception |  |  |  |  |  |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path - Self Update | Validation Error | Authorization Error - Forbidden | Authorization Error - Unauthenticated | Happy Path - Admin Updates Other |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Groups

### Function Code: `approveJoinRequest`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: requestId (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: requestId (param): Invalid UUID |  | O |  |  |  |  |
| Repository | groupsRepository.findJoinRequestById: Request Found PENDING | O |  |  |  | O |  |
| Repository | groupsRepository.findJoinRequestById: Request Found NOT PENDING |  |  | O |  |  |  |
| Repository | groupsRepository.findJoinRequestById: Not Found |  |  |  | O |  |  |
| Repository | groupsRepository.findJoinRequestById: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: LEADER membership found | O |  |  |  |  |  |
| Repository | groupsRepository.isMember: Not found or not LEADER |  |  |  |  | O |  |
| Repository | groupsRepository.updateJoinRequest: Success | O |  |  |  |  |  |
| Repository | groupsRepository.updateJoinRequest: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.addMember: Success | O |  |  |  |  |  |
| Repository | groupsRepository.addMember: Query Error |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Security | Requester is group LEADER: TRUE | O |  |  |  |  |  |
| Security | Requester is group LEADER: FALSE |  |  |  |  | O |  |
| Business Rule | Join Request Status: PENDING | O |  |  |  |  |  |
| Business Rule | Join Request Status: NOT PENDING |  |  | O |  |  |  |
| Business Rule | approveJoinRequest delegates to handleJoinRequest(APPROVED) | O |  |  |  |  |  |
| Business Rule | On APPROVED: addMember with role MEMBER | O |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  |  | O |  |
| Return Status | 404 |  |  |  | O |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | Approved join request object | O |  |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Join request is no longer pending |  |  | O |  |  |  |
| Return Body | Join request not found |  |  |  | O |  |  |
| Return Body | Forbidden (not a leader) |  |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.badRequest (not pending) |  |  | O |  |  |  |
| Exception | ApiError.notFound (request not found) |  |  |  | O |  |  |
| Exception | ApiError.forbidden (not leader) |  |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Join request approved | O |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Request no longer pending |  |  | O |  |  |  |
| Log Message | Request not found |  |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Pending | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `cancelJoinRequest`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: id / groupId (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: id / groupId (param): Invalid UUID |  | O |  |  |  |
| Repository | groupsRepository.findJoinRequest: PENDING request found | O |  |  |  |  |
| Repository | groupsRepository.findJoinRequest: Request not found |  |  | O |  |  |
| Repository | groupsRepository.findJoinRequest: Request NOT PENDING |  |  |  | O |  |
| Repository | groupsRepository.findJoinRequest: Query Error |  |  |  |  | O |
| Repository | groupsRepository.deleteJoinRequest: Success | O |  |  |  |  |
| Repository | groupsRepository.deleteJoinRequest: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Business Rule | Join Request Status: PENDING | O |  |  |  |  |
| Business Rule | Join Request Status: NOT PENDING |  |  |  | O |  |
| Business Rule | Join Request: Exists for this user+group | O |  |  |  |  |
| Business Rule | Join Request: Does not exist |  |  | O |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | true (cancelled successfully) | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Join request not found |  |  | O |  |  |
| Return Body | Only pending requests can be cancelled |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound (request not found) |  |  | O |  |  |
| Exception | ApiError.badRequest (not pending) |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Join request cancelled | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Request not found |  |  | O |  |  |
| Log Message | Request not pending |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Business Rule - Not Pending | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `createGroup`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| — Condition — |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O | O |  |  |
| Precondition | JWT Service Fail |  |  | O |  |
| Precondition | bcrypt Service OK | O | O |  |  |
| Precondition | bcrypt Service Fail |  |  | O |  |
| Precondition | Cloudinary Service OK | O | O |  |  |
| Precondition | Cloudinary Service Fail |  |  | O |  |
| Precondition | LiveKit Service OK | O | O |  |  |
| Precondition | LiveKit Service Fail |  |  | O |  |
| Input (req.body) | Input: name (body): valid string 3-100 chars | O |  |  |  |
| Input (req.body) | Input: name (body): missing or invalid length |  | O |  |  |
| Input (req.body) | Input: description (body): optional string | O |  |  |  |
| Input (req.body) | Input: subject (body): valid non-empty string | O |  |  |  |
| Input (req.body) | Input: subject (body): empty or missing |  | O |  |  |
| Input (req.body) | Input: maxMembers (body): valid int 2-100 | O |  |  |  |
| Input (req.body) | Input: maxMembers (body): invalid int or out of range |  | O |  |  |
| Repository | groupsRepository.create: Success | O |  |  |  |
| Repository | groupsRepository.create: Query Error |  |  |  | O |
| Security | authenticate middleware: PASS | O | O |  |  |
| Security | authenticate middleware: FAIL |  |  | O |  |
| Business Rule | Creator auto-assigned as LEADER member | O |  |  |  |
| Business Rule | createdBy set to userId | O |  |  |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |
| Return Status | 400 |  | O |  |  |
| Return Status | 401 |  |  | O |  |
| Return Status | 500 |  |  |  | O |
| Return Body | Created group object | O |  |  |  |
| Return Body | Validation error details |  | O |  |  |
| Return Body | Unauthorized |  |  | O |  |
| Return Body | Internal server error |  |  |  | O |
| Exception | None | O |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |
| Exception | ApiError.unauthorized |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  | O |
| Log Message | Group created successfully | O |  |  |  |
| Log Message | Validation failed |  | O |  |  |
| Log Message | Authorization denied |  |  | O |  |
| Log Message | Unhandled exception |  |  |  | O |
| — Result — |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---

### Function Code: `getGroupById`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |
| Repository | groupsRepository.findById: Group Found ACTIVE | O |  |  | O |  |  |
| Repository | groupsRepository.findById: Group Found ARCHIVED |  |  |  |  | O |  |
| Repository | groupsRepository.findById: Not Found |  |  | O |  |  |  |
| Repository | groupsRepository.findById: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.findJoinRequest: PENDING request found | O |  |  |  |  |  |
| Repository | groupsRepository.findJoinRequest: No pending request |  |  |  | O |  |  |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Security | Requester is group LEADER: TRUE |  |  |  |  |  |  |
| Security | Requester is group LEADER: FALSE | O |  |  | O | O |  |
| Security | Requester is group LEADER: TRUE (includes joinRequests) |  |  |  |  |  |  |
| Business Rule | Group Status: ACTIVE → accessible by all | O |  |  |  |  |  |
| Business Rule | Group Status: ARCHIVED + isAdmin: FALSE → notFound | O |  |  |  | O |  |
| Business Rule | Leader: joinRequests visible | O |  |  |  |  |  |
| Business Rule | Non-leader: joinRequests removed from response | O |  |  | O | O |  |
| Business Rule | userId present: check myJoinRequest | O |  |  | O |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  | O |  |  |
| Return Status | 400 |  | O |  |  |  |  |
| Return Status | 404 |  |  | O |  | O |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | Group object (with myJoinRequest if pending) | O |  |  | O |  |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Group not found |  |  | O |  | O |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  | O |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Group retrieved successfully | O |  |  | O |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Group not found |  |  | O |  | O |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - Active Group | Validation Error | Business Rule - Not Found | Happy Path - No Pending Request | Business Rule - Archived (Non-Admin) | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `handleJoinRequest`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-----------|---------------|---|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  | O |
| Input (req.params) | Input: requestId (param): Valid UUID | O | O |  | O | O | O |  |
| Input (req.params) | Input: requestId (param): Invalid UUID |  |  | O |  |  |  |  |
| Input (req.body) | Input: status (body): APPROVED | O |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): REJECTED |  | O |  |  |  |  |  |
| Input (req.body) | Input: status (body): Invalid value |  |  | O |  |  |  |  |
| Repository | groupsRepository.findJoinRequestById: Request Found PENDING | O | O |  |  |  | O |  |
| Repository | groupsRepository.findJoinRequestById: Request Found NOT PENDING |  |  |  |  | O |  |  |
| Repository | groupsRepository.findJoinRequestById: Not Found |  |  |  | O |  |  |  |
| Repository | groupsRepository.findJoinRequestById: Query Error |  |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: LEADER membership found | O | O |  |  |  |  |  |
| Repository | groupsRepository.isMember: Not found or not LEADER |  |  |  |  |  | O |  |
| Repository | groupsRepository.updateJoinRequest: Success | O | O |  |  |  |  |  |
| Repository | groupsRepository.updateJoinRequest: Query Error |  |  |  |  |  |  | O |
| Repository | groupsRepository.addMember: Success (APPROVED only) | O |  |  |  |  |  |  |
| Repository | groupsRepository.addMember: Query Error |  |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  |  | O |
| Security | Requester is group LEADER: TRUE | O | O |  |  |  |  |  |
| Security | Requester is group LEADER: FALSE |  |  |  |  |  | O |  |
| Business Rule | Join Request Status: PENDING | O | O |  |  |  |  |  |
| Business Rule | Join Request Status: NOT PENDING |  |  |  |  | O |  |  |
| Business Rule | On APPROVED: addMember with role MEMBER | O |  |  |  |  |  |  |
| Business Rule | On REJECTED: no member added |  | O |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |  |
| Return Status | 200 | O | O |  |  |  |  |  |
| Return Status | 400 |  |  | O |  | O |  |  |
| Return Status | 403 |  |  |  |  |  | O |  |
| Return Status | 404 |  |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  |  |  | O |
| Return Body | Updated join request (APPROVED) | O |  |  |  |  |  |  |
| Return Body | Updated join request (REJECTED) |  | O |  |  |  |  |  |
| Return Body | Validation error details |  |  | O |  |  |  |  |
| Return Body | Join request not found |  |  |  | O |  |  |  |
| Return Body | Request no longer pending |  |  |  |  | O |  |  |
| Return Body | Forbidden (not a leader) |  |  |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  |  |  | O |
| Exception | None | O | O |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  |  | O |  |  |  |
| Exception | ApiError.badRequest (not pending) |  |  |  |  | O |  |  |
| Exception | ApiError.forbidden (not leader) |  |  |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  |  |  | O |
| Log Message | Join request approved | O |  |  |  |  |  |  |
| Log Message | Join request rejected |  | O |  |  |  |  |  |
| Log Message | Validation failed |  |  | O |  |  |  |  |
| Log Message | Request not found |  |  |  | O |  |  |  |
| Log Message | Request no longer pending |  |  |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |  |
| Type |  | Happy Path - Approve | Happy Path - Reject | Validation Error | Business Rule - Not Found | Business Rule - Not Pending | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |

---

### Function Code: `listGroups`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.query) | Input: page (query): valid int >= 1 | O |  | O | O |  |
| Input (req.query) | Input: page (query): invalid / missing (defaults) | O |  |  |  |  |
| Input (req.query) | Input: limit (query): valid int 1-100 | O |  | O | O |  |
| Input (req.query) | Input: limit (query): invalid value |  | O |  |  |  |
| Input (req.query) | Input: search (query): present string | O |  |  |  |  |
| Input (req.query) | Input: search (query): absent | O |  | O | O |  |
| Input (req.query) | Input: myGroups (query): true |  |  | O |  |  |
| Input (req.query) | Input: myGroups (query): false / absent | O |  |  | O |  |
| Input (req.query) | Input: status (query): ACTIVE / ARCHIVED / DELETED | O |  |  | O |  |
| Input (req.query) | Input: status (query): invalid value |  | O |  |  |  |
| Repository | groupsRepository.findMany: Success | O |  | O | O |  |
| Repository | groupsRepository.findMany: Query Error |  |  |  |  | O |
| Repository | groupsRepository.count: Success | O |  | O | O |  |
| Repository | groupsRepository.count: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O |  |  |
| Security | authenticate middleware: FAIL |  |  |  | O |  |
| Business Rule | isAdmin=FALSE → default filter status=ACTIVE | O |  |  |  |  |
| Business Rule | myGroups=true → filter by userId membership | O |  | O |  |  |
| Business Rule | Pagination applied: skip + take | O |  | O | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  | O |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 401 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Paginated groups list | O |  | O |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Unauthorized |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  | O |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.unauthorized |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Groups listed successfully | O |  | O |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path - Default Listing | Validation Error | Happy Path - My Groups Filter | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `rejectJoinRequest`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: requestId (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: requestId (param): Invalid UUID |  | O |  |  |  |  |
| Repository | groupsRepository.findJoinRequestById: Request Found PENDING | O |  |  |  | O |  |
| Repository | groupsRepository.findJoinRequestById: Request Found NOT PENDING |  |  | O |  |  |  |
| Repository | groupsRepository.findJoinRequestById: Not Found |  |  |  | O |  |  |
| Repository | groupsRepository.findJoinRequestById: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: LEADER membership found | O |  |  |  |  |  |
| Repository | groupsRepository.isMember: Not found or not LEADER |  |  |  |  | O |  |
| Repository | groupsRepository.updateJoinRequest (REJECTED): Success | O |  |  |  |  |  |
| Repository | groupsRepository.updateJoinRequest: Query Error |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Security | Requester is group LEADER: TRUE | O |  |  |  |  |  |
| Security | Requester is group LEADER: FALSE |  |  |  |  | O |  |
| Business Rule | Join Request Status: PENDING | O |  |  |  |  |  |
| Business Rule | Join Request Status: NOT PENDING |  |  | O |  |  |  |
| Business Rule | rejectJoinRequest delegates to handleJoinRequest(REJECTED) | O |  |  |  |  |  |
| Business Rule | On REJECTED: no addMember called | O |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  |  | O |  |
| Return Status | 404 |  |  |  | O |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | Rejected join request object | O |  |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Request no longer pending |  |  | O |  |  |  |
| Return Body | Join request not found |  |  |  | O |  |  |
| Return Body | Forbidden (not a leader) |  |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.badRequest (not pending) |  |  | O |  |  |  |
| Exception | ApiError.notFound |  |  |  | O |  |  |
| Exception | ApiError.forbidden (not leader) |  |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Join request rejected | O |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Request no longer pending |  |  | O |  |  |  |
| Log Message | Request not found |  |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Pending | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `removeGroup`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |
| Repository | groupsRepository.findById: Group Found | O |  |  | O | O |  |
| Repository | groupsRepository.findById: Not Found |  |  | O |  |  |  |
| Repository | groupsRepository.findById: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.softDelete: Success | O |  |  |  | O |  |
| Repository | groupsRepository.softDelete: Query Error |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Security | isAdmin: TRUE |  |  |  |  | O |  |
| Security | isAdmin: FALSE | O |  |  | O |  |  |
| Business Rule | createdBy === userId: TRUE | O |  |  |  |  |  |
| Business Rule | createdBy === userId: FALSE (and not admin) |  |  |  | O |  |  |
| Business Rule | isAdmin OR createdBy === userId → allowed | O |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  | O |  |
| Return Status | 400 |  | O |  |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | true (deleted) | O |  |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Group not found |  |  | O |  |  |  |
| Return Body | Forbidden |  |  |  | O |  |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Group removed successfully | O |  |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Group not found |  |  | O |  |  |  |
| Log Message | Authorization denied |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - Creator Removes Own Group | Validation Error | Business Rule - Group Not Found | Authorization Error | Happy Path - Admin Removes Group | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `requestJoin`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 | UTCID08 |
|-----------|---------------|---|---|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |  | O |
| Input (req.params) | Input: id / groupId (param): Valid UUID | O |  | O | O | O | O | O |  |
| Input (req.params) | Input: id / groupId (param): Invalid UUID |  | O |  |  |  |  |  |  |
| Repository | groupsRepository.findById: Group Found ACTIVE | O |  |  |  |  |  |  |  |
| Repository | groupsRepository.findById: Group Found NOT ACTIVE |  |  |  | O |  |  |  |  |
| Repository | groupsRepository.findById: Not Found |  |  | O |  |  |  |  |  |
| Repository | groupsRepository.findById: Query Error |  |  |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: Already a member |  |  |  |  | O |  |  |  |
| Repository | groupsRepository.isMember: Not a member | O |  |  |  |  | O | O |  |
| Repository | groupsRepository.findJoinRequest: Pending request exists |  |  |  |  |  | O |  |  |
| Repository | groupsRepository.findJoinRequest: No pending request | O |  |  |  |  |  | O |  |
| Repository | groupsRepository.createJoinRequest: Success | O |  |  |  |  |  |  |  |
| Repository | groupsRepository.createJoinRequest: Query Error |  |  |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  |  |  | O |
| Business Rule | Group Status: ACTIVE → accepting members | O |  |  |  |  |  |  |  |
| Business Rule | Group Status: NOT ACTIVE → reject |  |  |  | O |  |  |  |  |
| Business Rule | Already a member → conflict |  |  |  |  | O |  |  |  |
| Business Rule | Pending request exists → conflict |  |  |  |  |  | O |  |  |
| Business Rule | members.length >= maxMembers → full |  |  |  |  |  |  | O |  |
| Business Rule | All checks pass → createJoinRequest | O |  |  |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |  |  |  |
| Return Status | 400 |  | O |  | O |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |  |  |  |
| Return Status | 409 |  |  |  |  | O | O |  |  |
| Return Status | 500 |  |  |  |  |  |  |  | O |
| Return Body | Created join request object | O |  |  |  |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |  |  |  |
| Return Body | Group not found |  |  | O |  |  |  |  |  |
| Return Body | Group is not accepting members |  |  |  | O |  |  |  |  |
| Return Body | Already a member |  |  |  |  | O |  |  |  |
| Return Body | Join request already pending |  |  |  |  |  | O |  |  |
| Return Body | Group is full |  |  |  |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  |  |  |  | O |
| Exception | None | O |  |  |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |  |  |
| Exception | ApiError.badRequest (not accepting members) |  |  |  | O |  |  |  |  |
| Exception | ApiError.conflict (already member) |  |  |  |  | O |  |  |  |
| Exception | ApiError.conflict (pending request) |  |  |  |  |  | O |  |  |
| Exception | ApiError.badRequest (group full) |  |  |  |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  |  |  |  | O |
| Log Message | Join request created | O |  |  |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |  |  |
| Log Message | Group not found |  |  | O |  |  |  |  |  |
| Log Message | Group not accepting members |  |  |  | O |  |  |  |  |
| Log Message | Already a member |  |  |  |  | O |  |  |  |
| Log Message | Pending request exists |  |  |  |  |  | O |  |  |
| Log Message | Group is full |  |  |  |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Business Rule - Not Active | Business Rule - Already Member | Business Rule - Pending Exists | Business Rule - Group Full | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |  |

---

### Function Code: `setGroupStatus`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |
| Input (req.body) | Input: status (body): ARCHIVED | O |  |  |  |  |  |
| Input (req.body) | Input: status (body): ACTIVE |  |  |  |  | O |  |
| Input (req.body) | Input: status (body): Invalid value |  | O |  |  |  |  |
| Repository | groupsRepository.findById: Group Found | O |  |  | O | O |  |
| Repository | groupsRepository.findById: Not Found |  |  | O |  |  |  |
| Repository | groupsRepository.findById: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.update: Success | O |  |  |  | O |  |
| Repository | groupsRepository.update: Query Error |  |  |  |  |  | O |
| Repository | notificationsService.notifyUsers: Success | O |  |  |  | O |  |
| Repository | notificationsService.notifyUsers: Error |  |  |  |  |  | O |
| Security | authorize(ADMIN) middleware: PASS | O | O | O |  | O |  |
| Security | authorize(ADMIN) middleware: FAIL |  |  |  | O |  |  |
| Security | isAdmin (service check): TRUE | O |  |  |  | O |  |
| Security | isAdmin (service check): FALSE |  |  |  | O |  |  |
| Business Rule | Status ARCHIVED → notifies creator: "Group banned" | O |  |  |  |  |  |
| Business Rule | Status ACTIVE → notifies creator: "Group restored" |  |  |  |  | O |  |
| Business Rule | Group not found → notFound |  |  | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  | O |  |
| Return Status | 400 |  | O |  |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | Updated group with new status | O |  |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Group not found |  |  | O |  |  |  |
| Return Body | Forbidden (not admin) |  |  |  | O |  |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Group status updated (ARCHIVED) | O |  |  |  |  |  |
| Log Message | Group status updated (ACTIVE/restored) |  |  |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Group not found |  |  | O |  |  |  |
| Log Message | Authorization denied |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - Archive Group | Validation Error | Business Rule - Not Found | Authorization Error | Happy Path - Restore Group | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `updateGroup`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| — Condition — |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |
| Input (req.body) | Input: name (body): valid string 3-100 | O |  |  |  |
| Input (req.body) | Input: name (body): invalid length |  | O |  |  |
| Input (req.body) | Input: description (body): optional string | O |  |  |  |
| Input (req.body) | Input: subject (body): optional non-empty string | O |  |  |  |
| Input (req.body) | Input: maxMembers (body): optional int 2-100 | O |  |  |  |
| Repository | groupsRepository.isMember: LEADER membership found | O |  |  |  |
| Repository | groupsRepository.isMember: Not found or not LEADER |  |  | O |  |
| Repository | groupsRepository.update: Success | O |  |  |  |
| Repository | groupsRepository.update: Query Error |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  | O |
| Security | Requester is group LEADER: TRUE | O |  |  |  |
| Security | Requester is group LEADER: FALSE |  |  | O |  |
| Business Rule | Only LEADER can update group | O |  |  |  |
| Business Rule | Non-leader → forbidden |  |  | O |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |
| Return Status | 400 |  | O |  |  |
| Return Status | 403 |  |  | O |  |
| Return Status | 500 |  |  |  | O |
| Return Body | Updated group object | O |  |  |  |
| Return Body | Validation error details |  | O |  |  |
| Return Body | Forbidden (not a leader) |  |  | O |  |
| Return Body | Internal server error |  |  |  | O |
| Exception | None | O |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |
| Exception | ApiError.forbidden |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  | O |
| Log Message | Group updated successfully | O |  |  |  |
| Log Message | Validation failed |  | O |  |  |
| Log Message | Authorization denied |  |  | O |  |
| Log Message | Unhandled exception |  |  |  | O |
| — Result — |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---


## Module: Sessions

### Function Code: `createSession`

**Service:** Sessions Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  | O |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  | O |
| Precondition | JWT Service Fail |  |  |  |  | O |  |
| Precondition | bcrypt Service OK | O | O | O | O |  | O |
| Precondition | bcrypt Service Fail |  |  |  |  | O |  |
| Precondition | Cloudinary Service OK | O | O | O | O |  | O |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |  |
| Precondition | LiveKit Service OK | O | O | O | O |  | O |
| Precondition | LiveKit Service Fail |  |  |  |  | O |  |
| Input (req.body) | Input: groupId (body): Valid UUID | O |  | O | O |  | O |
| Input (req.body) | Input: groupId (body): Invalid UUID |  | O |  |  |  |  |
| Input (req.body) | Input: title (body): valid string 3-150 chars | O |  | O | O |  | O |
| Input (req.body) | Input: title (body): invalid length (<3 or >150) |  | O |  |  |  |  |
| Input (req.body) | Input: startNow (body): true |  |  |  |  |  | O |
| Input (req.body) | Input: startNow (body): false / absent | O |  | O | O |  |  |
| Input (req.body) | Input: startTime (body): valid ISO8601 | O |  |  |  |  |  |
| Input (req.body) | Input: startTime (body): missing (when startNow=false) |  | O |  |  |  |  |
| Input (req.body) | Input: endTime (body): valid ISO8601 | O |  |  |  |  |  |
| Input (req.body) | Input: endTime (body): missing (when startNow=false) |  |  |  | O |  |  |
| Input (req.body) | Input: meetingLink (body): valid URL | O |  |  |  |  | O |
| Input (req.body) | Input: notifyMembers (body): true | O |  |  |  |  | O |
| Input (req.body) | Input: notifyMembers (body): false | O |  | O |  |  |  |
| Repository | groupsRepository.isMember: User is a member | O |  |  | O |  | O |
| Repository | groupsRepository.isMember: User is NOT a member |  |  | O |  |  |  |
| Repository | sessionsRepository.create: Success | O |  |  |  |  | O |
| Repository | sessionsRepository.create: Query Error |  |  |  |  | O |  |
| Repository | notificationsService.notifyUsers: Success (when notifyMembers) | O |  |  |  |  | O |
| Repository | notificationsService.notifyUsers: Error |  |  |  |  | O |  |
| Security | authenticate middleware: PASS | O | O | O | O |  | O |
| Security | authenticate middleware: FAIL |  |  |  |  | O |  |
| Business Rule | isMember=TRUE → allowed to create | O |  |  |  |  | O |
| Business Rule | isMember=FALSE → forbidden |  |  | O |  |  |  |
| Business Rule | startNow=true → status=IN_PROGRESS, no endTime required |  |  |  |  |  | O |
| Business Rule | startNow=false → status=SCHEDULED, endTime required | O |  |  |  |  |  |
| Business Rule | startNow=false and !endTime → badRequest |  |  |  | O |  |  |
| Business Rule | notifyMembers=true → call notifyMembers() | O |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  | O |
| Return Status | 400 |  | O |  | O |  |  |
| Return Status | 403 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | Created session object | O |  |  |  |  | O |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Must be a group member |  |  | O |  |  |  |
| Return Body | End time is required for scheduled sessions |  |  |  | O |  |  |
| Return Body | Internal server error |  |  |  |  | O |  |
| Exception | None | O |  |  |  |  | O |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.forbidden (not member) |  |  | O |  |  |  |
| Exception | ApiError.badRequest (endTime required) |  |  |  | O |  |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |  |
| Log Message | Session created (SCHEDULED) | O |  |  |  |  |  |
| Log Message | Session created (IN_PROGRESS) |  |  |  |  |  | O |
| Log Message | Members notified | O |  |  |  |  | O |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Not a group member |  |  | O |  |  |  |
| Log Message | End time required |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  | O |  |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - Scheduled Session | Validation Error | Authorization Error - Not Member | Business Rule - Missing End Time | Exception / Dependency Failure | Happy Path - Start Now |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `endSession`

**Service:** Sessions Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-----------|---------------|---|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |  |
| Repository | sessionsRepository.findById: Session Found SCHEDULED | O |  |  |  | O |  |  |
| Repository | sessionsRepository.findById: Session Found IN_PROGRESS |  |  |  |  |  | O |  |
| Repository | sessionsRepository.findById: Session Found COMPLETED |  |  |  | O |  |  |  |
| Repository | sessionsRepository.findById: Session Found CANCELLED |  |  |  | O |  |  |  |
| Repository | sessionsRepository.findById: Not Found |  |  | O |  |  |  |  |
| Repository | sessionsRepository.findById: Query Error |  |  |  |  |  |  | O |
| Repository | sessionsRepository.update (status CANCELLED): Success | O |  |  |  |  |  |  |
| Repository | sessionsRepository.update (status COMPLETED): Success |  |  |  |  |  | O |  |
| Repository | sessionsRepository.update: Query Error |  |  |  |  |  |  | O |
| Repository | deleteLiveKitRoom: Called for IN_PROGRESS session |  |  |  |  |  | O |  |
| Repository | deleteLiveKitRoom: Error |  |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  |  | O |
| Security | assertCanManageSession: Creator | O |  |  |  |  | O |  |
| Security | assertCanManageSession: Group LEADER | O |  |  | O |  |  |  |
| Security | assertCanManageSession: Neither → forbidden |  |  |  |  | O |  |  |
| Business Rule | Session Status: SCHEDULED → ends as CANCELLED | O |  |  |  |  |  |  |
| Business Rule | Session Status: IN_PROGRESS → ends as COMPLETED + deleteLiveKitRoom |  |  |  |  |  | O |  |
| Business Rule | Session Status: COMPLETED / CANCELLED → already ended → badRequest |  |  |  | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  | O |  |
| Return Status | 400 |  | O |  | O |  |  |  |
| Return Status | 403 |  |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |  |
| Return Status | 500 |  |  |  |  |  |  | O |
| Return Body | Updated session (CANCELLED) | O |  |  |  |  |  |  |
| Return Body | Updated session (COMPLETED) |  |  |  |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |  |  |  |
| Return Body | Session not found |  |  | O |  |  |  |  |
| Return Body | Session is already ended |  |  |  | O |  |  |  |
| Return Body | Forbidden |  |  |  |  | O |  |  |
| Return Body | Internal server error |  |  |  |  |  |  | O |
| Exception | None | O |  |  |  |  | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |  |
| Exception | ApiError.badRequest (already ended) |  |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  |  | O |  |  |
| Exception | Repository / Dependency Error |  |  |  |  |  |  | O |
| Log Message | Session ended (CANCELLED) | O |  |  |  |  |  |  |
| Log Message | Session ended (COMPLETED) + LiveKit room deleted |  |  |  |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |  |  |  |
| Log Message | Session not found |  |  | O |  |  |  |  |
| Log Message | Session already ended |  |  |  | O |  |  |  |
| Log Message | Authorization denied |  |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |  |
| Type |  | Happy Path - End SCHEDULED (CANCELLED) | Validation Error | Business Rule - Not Found | Business Rule - Already Ended | Authorization Error | Happy Path - End IN_PROGRESS (COMPLETED) | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |

---

### Function Code: `getLiveKitToken`

**Service:** Sessions Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-----------|---------------|---|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O |  |  |  |  |  |  |
| Precondition | LiveKit Service Not Configured |  |  |  |  |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |  |
| Repository | sessionsRepository.findById: Session Found IN_PROGRESS | O |  |  |  | O |  |  |
| Repository | sessionsRepository.findById: Session Found NOT IN_PROGRESS |  |  |  | O |  |  |  |
| Repository | sessionsRepository.findById: Not Found |  |  | O |  |  |  |  |
| Repository | sessionsRepository.findById: Query Error |  |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  |  | O |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  |  | O |  |  |
| Repository | createLiveKitToken: Success | O |  |  |  |  |  |  |
| Repository | createLiveKitToken: Error |  |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  |  | O |
| Security | User is group member: TRUE | O |  |  |  |  |  |  |
| Security | User is group member: FALSE |  |  |  |  | O |  |  |
| Business Rule | Session Status: IN_PROGRESS → allowed | O |  |  |  |  |  |  |
| Business Rule | Session Status: NOT IN_PROGRESS → badRequest |  |  |  | O |  |  |  |
| Business Rule | LiveKit Configured: TRUE | O |  |  |  |  |  |  |
| Business Rule | LiveKit Configured: FALSE → internal error |  |  |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |  |
| Return Status | 400 |  | O |  | O |  |  |  |
| Return Status | 403 |  |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |  |
| Return Status | 500 |  |  |  |  |  | O | O |
| Return Body | { token, serverUrl, roomName } | O |  |  |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |  |  |
| Return Body | Session not found |  |  | O |  |  |  |  |
| Return Body | Session is not in progress |  |  |  | O |  |  |  |
| Return Body | Must be a group member to join |  |  |  |  | O |  |  |
| Return Body | LiveKit is not configured on the server |  |  |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  |  |  | O |
| Exception | None | O |  |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |  |
| Exception | ApiError.badRequest (not in progress) |  |  |  | O |  |  |  |
| Exception | ApiError.forbidden (not member) |  |  |  |  | O |  |  |
| Exception | ApiError.internal (LiveKit not configured) |  |  |  |  |  | O |  |
| Exception | Repository / LiveKit Service Error |  |  |  |  |  |  | O |
| Log Message | LiveKit token generated | O |  |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |  |
| Log Message | Session not found |  |  | O |  |  |  |  |
| Log Message | Session not in progress |  |  |  | O |  |  |  |
| Log Message | Not a group member |  |  |  |  | O |  |  |
| Log Message | LiveKit not configured |  |  |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Business Rule - Not In Progress | Authorization Error | Business Rule - LiveKit Not Configured | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |

---

### Function Code: `getSessionById`

**Service:** Sessions Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| — Condition — |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |
| Repository | sessionsRepository.findById: Session Found | O |  |  |  |
| Repository | sessionsRepository.findById: Not Found |  |  | O |  |
| Repository | sessionsRepository.findById: Query Error |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  | O |
| Business Rule | Return full session object if found | O |  |  |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |
| Return Status | 400 |  | O |  |  |
| Return Status | 404 |  |  | O |  |
| Return Status | 500 |  |  |  | O |
| Return Body | Session object | O |  |  |  |
| Return Body | Validation error details |  | O |  |  |
| Return Body | Session not found |  |  | O |  |
| Return Body | Internal server error |  |  |  | O |
| Exception | None | O |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |
| Exception | ApiError.notFound |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  | O |
| Log Message | Session retrieved successfully | O |  |  |  |
| Log Message | Validation failed |  | O |  |  |
| Log Message | Session not found |  |  | O |  |
| Log Message | Unhandled exception |  |  |  | O |
| — Result — |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---

### Function Code: `listSessions`

**Service:** Sessions Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.query) | Input: page (query): valid int >= 1 | O |  | O | O |  |
| Input (req.query) | Input: limit (query): valid int 1-100 | O |  | O | O |  |
| Input (req.query) | Input: groupId (query): valid UUID | O |  |  | O |  |
| Input (req.query) | Input: groupId (query): invalid UUID |  | O |  |  |  |
| Input (req.query) | Input: upcoming (query): true |  |  | O |  |  |
| Input (req.query) | Input: upcoming (query): false / absent | O |  |  | O |  |
| Input (req.query) | Input: mySessions (query): true |  |  |  | O |  |
| Input (req.query) | Input: mySessions (query): false / absent | O |  | O |  |  |
| Repository | sessionsRepository.findMany: Success | O |  | O | O |  |
| Repository | sessionsRepository.findMany: Query Error |  |  |  |  | O |
| Repository | sessionsRepository.count: Success | O |  | O | O |  |
| Repository | sessionsRepository.count: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Business Rule | Filter: upcoming=true → startTime >= now, status=SCHEDULED |  |  | O |  |  |
| Business Rule | Filter: mySessions=true → group members filter | O |  |  | O |  |
| Business Rule | All sessions have deletedAt: null filter | O |  | O | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  | O | O |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Paginated sessions list | O |  | O | O |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  | O | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Sessions listed successfully | O |  | O | O |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path - Default Listing | Validation Error | Happy Path - Upcoming Filter | Happy Path - My Sessions Filter | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `notifyMembers`

**Service:** Sessions Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |
| Repository | sessionsRepository.findById: Session Found | O |  |  | O |  |
| Repository | sessionsRepository.findById: Not Found |  |  | O |  |  |
| Repository | sessionsRepository.findById: Query Error |  |  |  |  | O |
| Repository | groupsRepository.getMemberUserIds: Success | O |  |  |  |  |
| Repository | groupsRepository.getMemberUserIds: Query Error |  |  |  |  | O |
| Repository | notificationsService.notifyUsers: Success | O |  |  |  |  |
| Repository | notificationsService.notifyUsers: Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | assertCanManageSession: Creator | O |  |  |  |  |
| Security | assertCanManageSession: Group LEADER | O |  |  |  |  |
| Security | assertCanManageSession: Neither → forbidden |  |  |  | O |  |
| Business Rule | recipientIds excludes sender (userId) | O |  |  |  |  |
| Business Rule | Returns { notified: count } | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { notified: count } | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Session not found |  |  | O |  |  |
| Return Body | Forbidden (not creator or leader) |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository / Notification Error |  |  |  |  | O |
| Log Message | Members notified successfully | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Session not found |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `removeSession`

**Service:** Sessions Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |
| Repository | sessionsRepository.findById: Session Found | O |  |  | O |  |
| Repository | sessionsRepository.findById: Not Found |  |  | O |  |  |
| Repository | sessionsRepository.findById: Query Error |  |  |  |  | O |
| Repository | sessionsRepository.softDelete: Success | O |  |  |  |  |
| Repository | sessionsRepository.softDelete: Query Error |  |  |  |  | O |
| Repository | deleteLiveKitRoom: Called | O |  |  |  |  |
| Repository | deleteLiveKitRoom: Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | createdBy === userId: TRUE | O |  |  |  |  |
| Security | createdBy === userId: FALSE |  |  |  | O |  |
| Business Rule | Only creator can remove session | O |  |  |  |  |
| Business Rule | Non-creator → forbidden |  |  |  | O |  |
| Business Rule | deleteLiveKitRoom called before softDelete | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | true (deleted) | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Session not found |  |  | O |  |  |
| Return Body | Forbidden (not creator) |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository / LiveKit Error |  |  |  |  | O |
| Log Message | Session removed | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Session not found |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `updateSession`

**Service:** Sessions Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |
| Input (req.body) | Input: title (body): optional string 3-150 | O |  |  |  |  |
| Input (req.body) | Input: title (body): invalid length |  | O |  |  |  |
| Input (req.body) | Input: startTime (body): optional ISO8601 | O |  |  |  |  |
| Input (req.body) | Input: endTime (body): optional ISO8601 | O |  |  |  |  |
| Input (req.body) | Input: meetingLink (body): optional URL | O |  |  |  |  |
| Input (req.body) | Input: meetingLink (body): invalid URL |  | O |  |  |  |
| Input (req.body) | Input: status (body): valid session status | O |  |  |  |  |
| Input (req.body) | Input: status (body): invalid value |  | O |  |  |  |
| Repository | sessionsRepository.findById: Session Found | O |  |  | O |  |
| Repository | sessionsRepository.findById: Not Found |  |  | O |  |  |
| Repository | sessionsRepository.findById: Query Error |  |  |  |  | O |
| Repository | sessionsRepository.update: Success | O |  |  |  |  |
| Repository | sessionsRepository.update: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | assertCanManageSession: Creator | O |  |  |  |  |
| Security | assertCanManageSession: Group LEADER | O |  |  |  |  |
| Security | assertCanManageSession: Neither → forbidden |  |  |  | O |  |
| Business Rule | Update allowed fields: title, description, startTime, endTime, meetingLink, status | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Updated session object | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Session not found |  |  | O |  |  |
| Return Body | Forbidden (not creator or leader) |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Session updated successfully | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Session not found |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Attendance

### Function Code: `listAttendance`

**Service:** Attendance Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 |
|-----------|---------------|---|---|---|
| — Condition — |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |
| Precondition | JWT Service OK | O | O |  |
| Precondition | JWT Service Fail |  |  | O |
| Precondition | bcrypt Service OK | O | O |  |
| Precondition | bcrypt Service Fail |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  |
| Precondition | Cloudinary Service Fail |  |  | O |
| Precondition | LiveKit Service OK | O | O |  |
| Precondition | LiveKit Service Fail |  |  | O |
| Input (req.params) | Input: sessionId (param): Valid UUID | O |  |  |
| Input (req.params) | Input: sessionId (param): Invalid UUID |  | O |  |
| Repository | attendanceRepository.findBySession: Success | O |  |  |
| Repository | attendanceRepository.findBySession: Query Error |  |  | O |
| Security | authenticate middleware: PASS | O | O |  |
| Security | authenticate middleware: FAIL |  |  | O |
| Business Rule | Returns all attendance records for the session | O |  |  |
| — Confirm — |  |  |  |  |
| Return Status | 200 | O |  |  |
| Return Status | 400 |  | O |  |
| Return Status | 500 |  |  | O |
| Return Body | Attendance records array | O |  |  |
| Return Body | Validation error details |  | O |  |
| Return Body | Internal server error |  |  | O |
| Exception | None | O |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |
| Exception | Repository / Dependency Error |  |  | O |
| Log Message | Attendance listed successfully | O |  |  |
| Log Message | Validation failed |  | O |  |
| Log Message | Unhandled exception |  |  | O |
| — Result — |  |  |  |  |
| Type |  | Happy Path | Validation Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |
| Executed Date |  |  |  |  |
| Defect ID |  |  |  |  |

---

### Function Code: `markAttendance`

**Service:** Attendance Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: sessionId (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: sessionId (param): Invalid UUID |  | O |  |  |  |  |
| Input (req.body) | Input: userId (body): optional UUID (target user) | O |  |  | O |  |  |
| Input (req.body) | Input: userId (body): absent (marks own) | O |  | O |  | O |  |
| Input (req.body) | Input: status (body): PRESENT | O |  |  |  |  |  |
| Input (req.body) | Input: status (body): ABSENT |  |  | O |  |  |  |
| Input (req.body) | Input: status (body): LATE |  |  |  |  | O |  |
| Input (req.body) | Input: status (body): EXCUSED |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): invalid value |  | O |  |  |  |  |
| Repository | sessionsRepository.findById: Session Found | O |  | O | O | O |  |
| Repository | sessionsRepository.findById: Not Found |  |  |  |  |  |  |
| Repository | sessionsRepository.findById: Query Error |  |  |  |  |  | O |
| Repository | attendanceRepository.upsert: Success | O |  | O |  | O |  |
| Repository | attendanceRepository.upsert: Query Error |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Security | markerId === userId (self-mark): TRUE | O |  | O |  | O |  |
| Security | markerId !== userId (marking other): TRUE |  |  |  | O |  |  |
| Security | session.createdBy === markerId: TRUE |  |  |  | O |  |  |
| Security | session.createdBy !== markerId (unauthorized other-mark): TRUE |  |  |  |  |  |  |
| Business Rule | Self mark: markerId === userId → allowed | O |  | O |  | O |  |
| Business Rule | Mark other: session.createdBy === markerId → allowed |  |  |  | O |  |  |
| Business Rule | Mark other: session.createdBy !== markerId → forbidden |  |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  | O | O | O |  |
| Return Status | 400 |  | O |  |  |  |  |
| Return Status | 403 |  |  |  |  |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | Upserted attendance record | O |  | O | O | O |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  | O | O | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.forbidden (marking other without permission) |  |  |  |  |  |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Attendance marked (PRESENT) | O |  |  |  |  |  |
| Log Message | Attendance marked (ABSENT) |  |  | O |  |  |  |
| Log Message | Attendance marked (LATE) |  |  |  |  | O |  |
| Log Message | Session creator marked for other user |  |  |  | O |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - Self Mark PRESENT | Validation Error | Happy Path - Self Mark ABSENT | Happy Path - Creator Marks Other | Happy Path - Self Mark LATE | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `recordJoin`

**Service:** Attendance Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: sessionId (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: sessionId (param): Invalid UUID |  | O |  |  |  |  |
| Repository | sessionsRepository.findById: Session Found IN_PROGRESS | O |  |  |  | O |  |
| Repository | sessionsRepository.findById: Session Found NOT IN_PROGRESS |  |  |  | O |  |  |
| Repository | sessionsRepository.findById: Not Found |  |  | O |  |  |  |
| Repository | sessionsRepository.findById: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  |  |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  |  | O |  |
| Repository | attendanceRepository.upsert (PRESENT): Success | O |  |  |  |  |  |
| Repository | attendanceRepository.upsert: Query Error |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Security | groupsRepository.isMember: TRUE → authorized | O |  |  |  |  |  |
| Security | groupsRepository.isMember: FALSE → forbidden |  |  |  |  | O |  |
| Business Rule | Session Status: IN_PROGRESS → record join | O |  |  |  |  |  |
| Business Rule | Session Status: NOT IN_PROGRESS → badRequest |  |  |  | O |  |  |
| Business Rule | Auto sets status=PRESENT, checkedAt=now | O |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O |  | O |  |  |
| Return Status | 403 |  |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | Attendance record (PRESENT) | O |  |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Session not found |  |  | O |  |  |  |
| Return Body | Session is not in progress |  |  |  | O |  |  |
| Return Body | Must be a group member |  |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.badRequest (not in progress) |  |  |  | O |  |  |
| Exception | ApiError.forbidden (not member) |  |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Join recorded (PRESENT) | O |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Session not found |  |  | O |  |  |  |
| Log Message | Session not in progress |  |  |  | O |  |  |
| Log Message | Not a group member |  |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Business Rule - Not In Progress | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---


## Module: Resource Folders

### Function Code: `createResourceFolder`

**Service:** Resource Folders Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| — Condition — |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  | O |
| Input (req.body) | Input: groupId (body): Valid UUID | O |  | O |  |
| Input (req.body) | Input: groupId (body): Invalid UUID |  | O |  |  |
| Input (req.body) | Input: name (body): valid string 1-100 | O |  |  |  |
| Input (req.body) | Input: name (body): empty or exceeds 100 chars |  | O |  |  |
| Input (req.body) | Input: description (body): optional string max 500 | O |  |  |  |
| Input (req.body) | Input: description (body): exceeds 500 chars |  | O |  |  |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  | O |  |
| Repository | resourceFoldersRepository.create: Success | O |  |  |  |
| Repository | resourceFoldersRepository.create: Query Error |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  | O |
| Security | User is group member: TRUE | O |  |  |  |
| Security | User is group member: FALSE |  |  | O |  |
| Business Rule | createdBy set to userId | O |  |  |  |
| Business Rule | description trimmed, null if empty | O |  |  |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |
| Return Status | 400 |  | O |  |  |
| Return Status | 403 |  |  | O |  |
| Return Status | 500 |  |  |  | O |
| Return Body | Created resource folder object | O |  |  |  |
| Return Body | Validation error details |  | O |  |  |
| Return Body | Must be a group member |  |  | O |  |
| Return Body | Internal server error |  |  |  | O |
| Exception | None | O |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |
| Exception | ApiError.forbidden (not member) |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  | O |
| Log Message | Resource folder created | O |  |  |  |
| Log Message | Validation failed |  | O |  |  |
| Log Message | Not a group member |  |  | O |  |
| Log Message | Unhandled exception |  |  |  | O |
| — Result — |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---

### Function Code: `getResourceFolderById`

**Service:** Resource Folders Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |
| Repository | resourceFoldersRepository.findById: Folder Found | O |  |  | O |  |
| Repository | resourceFoldersRepository.findById: Not Found |  |  | O |  |  |
| Repository | resourceFoldersRepository.findById: Query Error |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  | O |  |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | User is group member: TRUE | O |  |  |  |  |
| Security | User is group member: FALSE |  |  |  | O |  |
| Business Rule | Folder found → check membership | O |  |  |  |  |
| Business Rule | Not a member → forbidden |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Resource folder object | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Folder not found |  |  | O |  |  |
| Return Body | Must be a group member |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Resource folder retrieved | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Folder not found |  |  | O |  |  |
| Log Message | Not a group member |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `listResourceFolders`

**Service:** Resource Folders Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.query) | Input: groupId (query): Valid UUID | O |  |  | O |  |  |
| Input (req.query) | Input: groupId (query): Invalid UUID |  | O |  |  |  |  |
| Input (req.query) | Input: groupId (query): absent |  |  | O |  | O |  |
| Input (req.query) | Input: myGroups (query): true |  |  |  |  | O |  |
| Input (req.query) | Input: myGroups (query): false / absent | O |  | O | O |  |  |
| Input (req.query) | Input: page (query): valid int | O |  |  | O | O |  |
| Input (req.query) | Input: limit (query): valid int | O |  |  | O | O |  |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  |  |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  | O |  |  |
| Repository | resourceFoldersRepository.findMany: Success | O |  |  |  | O |  |
| Repository | resourceFoldersRepository.findMany: Query Error |  |  |  |  |  | O |
| Repository | resourceFoldersRepository.count: Success | O |  |  |  | O |  |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Business Rule | myGroups=true → filter by userId members | O |  |  |  | O |  |
| Business Rule | groupId present → check membership | O |  |  |  |  |  |
| Business Rule | neither groupId nor myGroups → badRequest |  |  | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  | O |  |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | Paginated resource folders | O |  |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | groupId or myGroups is required |  |  | O |  |  |  |
| Return Body | Must be a group member |  |  |  | O |  |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.badRequest (missing params) |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Resource folders listed | O |  |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Missing required query params |  |  | O |  |  |  |
| Log Message | Not a group member |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - By Group ID | Validation Error | Business Rule - Missing Params | Authorization Error | Happy Path - My Groups | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `updateResourceFolder`

**Service:** Resource Folders Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |
| Input (req.body) | Input: name (body): optional valid string 1-100 | O |  |  |  |  |  |
| Input (req.body) | Input: name (body): invalid length |  | O |  |  |  |  |
| Input (req.body) | Input: description (body): optional string max 500 | O |  |  |  |  |  |
| Repository | resourceFoldersRepository.findById: Folder Found | O |  |  | O | O |  |
| Repository | resourceFoldersRepository.findById: Not Found |  |  | O |  |  |  |
| Repository | resourceFoldersRepository.findById: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  | O |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  | O |  |  |
| Repository | groupsRepository.findById: Group Found (for isLeader check) | O |  |  |  |  |  |
| Repository | resourceFoldersRepository.update: Success | O |  |  |  |  |  |
| Repository | resourceFoldersRepository.update: Query Error |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Security | isLeader (createdBy === userId OR role LEADER): TRUE | O |  |  |  |  |  |
| Security | isLeader: FALSE (is member but not leader) |  |  |  |  | O |  |
| Security | User is NOT a group member |  |  |  | O |  |  |
| Business Rule | Only group leaders can edit folders | O |  |  |  |  |  |
| Business Rule | Non-leader member → forbidden |  |  |  |  | O |  |
| Business Rule | Non-member → forbidden |  |  |  | O |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |  |
| Return Status | 403 |  |  |  | O | O |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | Updated resource folder object | O |  |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Folder not found |  |  | O |  |  |  |
| Return Body | Must be a group member |  |  |  | O |  |  |
| Return Body | Only group leaders can edit folders |  |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden (not member) |  |  |  | O |  |  |
| Exception | ApiError.forbidden (not leader) |  |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Resource folder updated | O |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Folder not found |  |  | O |  |  |  |
| Log Message | Not a group member |  |  |  | O |  |  |
| Log Message | Not a group leader |  |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error - Not Member | Authorization Error - Not Leader | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---


## Module: Resources

### Function Code: `createResource`

**Service:** Resources Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: groupId (body): Valid UUID | O |  | O | O |  |
| Input (req.body) | Input: groupId (body): Invalid UUID |  | O |  |  |  |
| Input (req.body) | Input: folderId (body): Valid UUID | O |  | O | O |  |
| Input (req.body) | Input: folderId (body): Invalid UUID |  | O |  |  |  |
| Input (req.body) | Input: title (body): valid string 2-150 | O |  |  |  |  |
| Input (req.body) | Input: title (body): invalid length |  | O |  |  |  |
| Input (req.body) | Input: fileUrl (body): valid URL | O |  |  |  |  |
| Input (req.body) | Input: fileUrl (body): invalid URL |  | O |  |  |  |
| Input (req.body) | Input: fileType (body): non-empty string | O |  |  |  |  |
| Input (req.body) | Input: fileType (body): missing or empty |  | O |  |  |  |
| Repository | groupsRepository.isMember: User is a member | O |  |  | O |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  | O |  |  |
| Repository | resourceFoldersRepository.findById: Folder Found, groupId matches | O |  |  |  |  |
| Repository | resourceFoldersRepository.findById: Not Found or groupId mismatch |  |  |  | O |  |
| Repository | resourcesRepository.create: Success | O |  |  |  |  |
| Repository | resourcesRepository.create: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | User is group member: TRUE | O |  |  |  |  |
| Security | User is group member: FALSE |  |  | O |  |  |
| Business Rule | Folder must belong to the specified group | O |  |  |  |  |
| Business Rule | Folder not found or belongs to different group → badRequest |  |  |  | O |  |
| Business Rule | uploadedBy set to userId | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |
| Return Status | 400 |  | O |  | O |  |
| Return Status | 403 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Created resource object | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Must be a group member |  |  | O |  |  |
| Return Body | Invalid folder for this group |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.forbidden (not member) |  |  | O |  |  |
| Exception | ApiError.badRequest (invalid folder) |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Resource created | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Not a group member |  |  | O |  |  |
| Log Message | Invalid folder for group |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Authorization Error | Business Rule - Invalid Folder | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `getResourceById`

**Service:** Resources Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |
| Repository | resourcesRepository.findById: Resource Found | O |  |  | O |  |
| Repository | resourcesRepository.findById: Not Found |  |  | O |  |  |
| Repository | resourcesRepository.findById: Query Error |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  | O |  |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | User is group member: TRUE | O |  |  |  |  |
| Security | User is group member: FALSE |  |  |  | O |  |
| Business Rule | Resource found → assertMember check | O |  |  |  |  |
| Business Rule | Not a member → forbidden |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Resource object | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Resource not found |  |  | O |  |  |
| Return Body | Must be a group member |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Resource retrieved | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Resource not found |  |  | O |  |  |
| Log Message | Not a group member |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `listResources`

**Service:** Resources Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.query) | Input: groupId (query): Valid UUID | O |  |  | O |  |  |
| Input (req.query) | Input: groupId (query): Invalid UUID |  | O |  |  |  |  |
| Input (req.query) | Input: folderId (query): Valid UUID |  |  |  |  | O |  |
| Input (req.query) | Input: folderId (query): Invalid UUID |  | O |  |  |  |  |
| Input (req.query) | Input: page (query): valid int | O |  |  | O | O |  |
| Input (req.query) | Input: limit (query): valid int | O |  |  | O | O |  |
| Repository | resourceFoldersRepository.findById: Folder Found (when folderId param) |  |  |  |  | O |  |
| Repository | resourceFoldersRepository.findById: Not Found |  |  | O |  |  |  |
| Repository | groupsRepository.isMember (when groupId): User is a member | O |  |  |  |  |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  | O |  |  |
| Repository | groupsRepository.isMember (when folderId): User is a member |  |  |  |  | O |  |
| Repository | resourcesRepository.findMany: Success | O |  |  |  | O |  |
| Repository | resourcesRepository.findMany: Query Error |  |  |  |  |  | O |
| Repository | resourcesRepository.count: Success | O |  |  |  | O |  |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Business Rule | folderId present → validate folder exists then assertMember |  |  |  |  | O |  |
| Business Rule | groupId present → assertMember |  |  |  |  |  |  |
| Business Rule | folderId not found → notFound |  |  | O |  |  |  |
| Business Rule | Not a member → forbidden |  |  |  | O |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  | O |  |
| Return Status | 400 |  | O |  |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | Paginated resources list | O |  |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Folder not found |  |  | O |  |  |  |
| Return Body | Must be a group member |  |  |  | O |  |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound (folder) |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Resources listed | O |  |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Folder not found |  |  | O |  |  |  |
| Log Message | Not a group member |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - By Group | Validation Error | Business Rule - Folder Not Found | Authorization Error | Happy Path - By Folder | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `removeResource`

**Service:** Resources Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |
| Repository | resourcesRepository.findById: Resource Found | O |  |  | O | O |  |
| Repository | resourcesRepository.findById: Not Found |  |  | O |  |  |  |
| Repository | resourcesRepository.findById: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  | O | O |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  |  |  |  |
| Repository | groupsRepository.findById (for isLeader check): Success | O |  |  |  | O |  |
| Repository | resourcesRepository.softDelete: Success | O |  |  |  | O |  |
| Repository | resourcesRepository.softDelete: Query Error |  |  |  |  |  | O |
| Repository | notificationsService.notifyUsers (leader deletes other): Success |  |  |  |  | O |  |
| Repository | notificationsService.notifyUsers: Error |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Security | isUploader (uploadedBy === userId): TRUE | O |  |  |  |  |  |
| Security | isUploader: FALSE, isLeader: TRUE |  |  |  |  | O |  |
| Security | isUploader: FALSE, isLeader: FALSE → forbidden |  |  |  | O |  |  |
| Business Rule | Uploader can always delete own resource | O |  |  |  |  |  |
| Business Rule | Leader can delete any resource + notify uploader |  |  |  |  | O |  |
| Business Rule | Neither uploader nor leader → forbidden |  |  |  | O |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  | O |  |
| Return Status | 400 |  | O |  |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | true (deleted) | O |  |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Resource not found |  |  | O |  |  |  |
| Return Body | Forbidden |  |  |  | O |  |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | Repository / Notification Error |  |  |  |  |  | O |
| Log Message | Resource removed (by uploader) | O |  |  |  |  |  |
| Log Message | Resource removed (by leader) + uploader notified |  |  |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Resource not found |  |  | O |  |  |  |
| Log Message | Authorization denied |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - Uploader Removes Own | Validation Error | Business Rule - Not Found | Authorization Error | Happy Path - Leader Removes Other | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `toggleStarResource`

**Service:** Resources Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |
| Repository | resourcesRepository.findById: Resource Found | O |  |  | O | O |  |
| Repository | resourcesRepository.findById: Not Found |  |  | O |  |  |  |
| Repository | resourcesRepository.findById: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  | O |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  | O |  |  |
| Repository | resourcesRepository.findRating: Rating exists (already starred) |  |  |  |  | O |  |
| Repository | resourcesRepository.findRating: No rating (not starred) | O |  |  |  |  |  |
| Repository | resourcesRepository.createRating: Success (star) | O |  |  |  |  |  |
| Repository | resourcesRepository.deleteRating: Success (unstar) |  |  |  |  | O |  |
| Repository | resourcesRepository.createRating / deleteRating: Query Error |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Security | User is group member: TRUE | O |  |  |  | O |  |
| Security | User is group member: FALSE |  |  |  | O |  |  |
| Business Rule | Rating not exists → createRating → { starred: true } | O |  |  |  |  |  |
| Business Rule | Rating exists → deleteRating → { starred: false } |  |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  | O |  |
| Return Status | 400 |  | O |  |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | { starred: true } | O |  |  |  |  |  |
| Return Body | { starred: false } |  |  |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Resource not found |  |  | O |  |  |  |
| Return Body | Must be a group member |  |  |  | O |  |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Resource starred | O |  |  |  |  |  |
| Log Message | Resource unstarred |  |  |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Resource not found |  |  | O |  |  |  |
| Log Message | Not a group member |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - Star Resource | Validation Error | Business Rule - Not Found | Authorization Error | Happy Path - Unstar Resource | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---


## Module: Posts

### Function Code: `createPost`

**Service:** Posts Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| — Condition — |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  | O |
| Input (req.body) | Input: groupId (body): Valid UUID | O |  | O |  |
| Input (req.body) | Input: groupId (body): Invalid UUID |  | O |  |  |
| Input (req.body) | Input: title (body): valid string 3-200 | O |  |  |  |
| Input (req.body) | Input: title (body): invalid length |  | O |  |  |
| Input (req.body) | Input: content (body): non-empty string | O |  |  |  |
| Input (req.body) | Input: content (body): empty or missing |  | O |  |  |
| Input (req.body) | Input: attachments (body): valid array max 10 | O |  |  |  |
| Input (req.body) | Input: attachments (body): invalid entries |  | O |  |  |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  | O |  |
| Repository | postsRepository.create: Success | O |  |  |  |
| Repository | postsRepository.create: Query Error |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  | O |
| Security | User is group member: TRUE | O |  |  |  |
| Security | User is group member: FALSE |  |  | O |  |
| Business Rule | authorId set to userId | O |  |  |  |
| Business Rule | attachments default to [] if absent | O |  |  |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |
| Return Status | 400 |  | O |  |  |
| Return Status | 403 |  |  | O |  |
| Return Status | 500 |  |  |  | O |
| Return Body | Created post object with vote metadata | O |  |  |  |
| Return Body | Validation error details |  | O |  |  |
| Return Body | Must be a group member |  |  | O |  |
| Return Body | Internal server error |  |  |  | O |
| Exception | None | O |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |
| Exception | ApiError.forbidden |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  | O |
| Log Message | Post created | O |  |  |  |
| Log Message | Validation failed |  | O |  |  |
| Log Message | Not a group member |  |  | O |  |
| Log Message | Unhandled exception |  |  |  | O |
| — Result — |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---

### Function Code: `getPostById`

**Service:** Posts Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| — Condition — |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |
| Repository | postsRepository.findById: Post Found | O |  |  |  |
| Repository | postsRepository.findById: Not Found |  |  | O |  |
| Repository | postsRepository.findById: Query Error |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  | O |
| Business Rule | Returns post with vote metadata (mapPost) | O |  |  |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |
| Return Status | 400 |  | O |  |  |
| Return Status | 404 |  |  | O |  |
| Return Status | 500 |  |  |  | O |
| Return Body | Post object with vote metadata | O |  |  |  |
| Return Body | Validation error details |  | O |  |  |
| Return Body | Post not found |  |  | O |  |
| Return Body | Internal server error |  |  |  | O |
| Exception | None | O |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |
| Exception | ApiError.notFound |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  | O |
| Log Message | Post retrieved | O |  |  |  |
| Log Message | Validation failed |  | O |  |  |
| Log Message | Post not found |  |  | O |  |
| Log Message | Unhandled exception |  |  |  | O |
| — Result — |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---

### Function Code: `listPosts`

**Service:** Posts Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.query) | Input: groupId (query): Valid UUID | O |  |  | O |  |
| Input (req.query) | Input: groupId (query): Invalid UUID |  | O |  |  |  |
| Input (req.query) | Input: page (query): valid int | O |  | O | O |  |
| Input (req.query) | Input: myGroups (query): true |  |  |  | O |  |
| Input (req.query) | Input: myGroups (query): false / absent | O |  | O |  |  |
| Input (req.query) | Input: sortBy (query): votes |  |  | O |  |  |
| Input (req.query) | Input: sortBy (query): createdAt (default) | O |  |  | O |  |
| Input (req.query) | Input: sortOrder (query): asc / desc | O |  | O | O |  |
| Repository | postsRepository.findMany: Success | O |  |  | O |  |
| Repository | postsRepository.findManyForVoteSort: Success |  |  | O |  |  |
| Repository | postsRepository.findMany: Query Error |  |  |  |  | O |
| Repository | postsRepository.count: Success | O |  |  | O |  |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Business Rule | sortBy=votes → findManyForVoteSort, in-memory sort |  |  | O |  |  |
| Business Rule | sortBy=createdAt → DB sort | O |  |  | O |  |
| Business Rule | myGroups=true → filter by user membership |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  | O | O |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Paginated posts with vote metadata | O |  | O | O |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  | O | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Posts listed | O |  | O | O |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path - By Date | Validation Error | Happy Path - Sort by Votes | Happy Path - My Groups Filter | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `removePost`

**Service:** Posts Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |
| Repository | postsRepository.findById: Post Found | O |  |  | O |  |
| Repository | postsRepository.findById: Not Found |  |  | O |  |  |
| Repository | postsRepository.findById: Query Error |  |  |  |  | O |
| Repository | postsRepository.softDelete: Success | O |  |  |  |  |
| Repository | postsRepository.softDelete: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | authorId === userId: TRUE | O |  |  |  |  |
| Security | authorId === userId: FALSE |  |  |  | O |  |
| Business Rule | Only the post author can delete | O |  |  |  |  |
| Business Rule | Non-author → forbidden |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | true (deleted) | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Post not found |  |  | O |  |  |
| Return Body | Forbidden (not author) |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Post removed | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Post not found |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `updatePost`

**Service:** Posts Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |
| Input (req.body) | Input: title (body): optional string 3-200 | O |  |  | O |  |  |
| Input (req.body) | Input: title (body): invalid length |  | O |  |  |  |  |
| Input (req.body) | Input: content (body): optional non-empty string | O |  |  | O |  |  |
| Input (req.body) | Input: title AND content both absent |  |  |  |  | O |  |
| Repository | postsRepository.findById: Post Found | O |  |  | O | O |  |
| Repository | postsRepository.findById: Not Found |  |  | O |  |  |  |
| Repository | postsRepository.findById: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  | O |  |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  | O |  |  |
| Repository | postsRepository.update: Success | O |  |  |  |  |  |
| Repository | postsRepository.update: Query Error |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Security | authorId === userId: TRUE | O |  |  |  |  |  |
| Security | authorId === userId: FALSE |  |  |  | O |  |  |
| Security | User is group member: TRUE | O |  |  |  |  |  |
| Security | User is group member: FALSE |  |  |  | O |  |  |
| Business Rule | Only author can update | O |  |  |  |  |  |
| Business Rule | Non-author → forbidden |  |  |  | O |  |  |
| Business Rule | Nothing to update (!title && !content) → badRequest |  |  |  |  | O |  |
| Business Rule | editedAt set on update | O |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O |  |  | O |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | Updated post with vote metadata | O |  |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Post not found |  |  | O |  |  |  |
| Return Body | Forbidden |  |  |  | O |  |  |
| Return Body | Nothing to update |  |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | ApiError.badRequest (nothing to update) |  |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Post updated | O |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Post not found |  |  | O |  |  |  |
| Log Message | Authorization denied |  |  |  | O |  |  |
| Log Message | Nothing to update |  |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error | Business Rule - Nothing to Update | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `votePost`

**Service:** Posts Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-----------|---------------|---|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |  |
| Input (req.body) | Input: value (body): 1 (upvote) | O |  |  |  |  |  |  |
| Input (req.body) | Input: value (body): -1 (downvote) |  |  |  |  |  | O |  |
| Input (req.body) | Input: value (body): invalid (not 1 or -1) |  | O |  |  |  |  |  |
| Repository | postsRepository.findById: Post Found | O |  |  | O | O | O |  |
| Repository | postsRepository.findById: Not Found |  |  | O |  |  |  |  |
| Repository | postsRepository.findById: Query Error |  |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  | O | O |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  | O |  |  |  |
| Repository | postsRepository.upsertVote: Success (new/changed vote) | O |  |  |  |  | O |  |
| Repository | postsRepository.removeVote: Success (same vote toggle) |  |  |  |  | O |  |  |
| Repository | postsRepository.upsertVote / removeVote: Query Error |  |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  |  | O |
| Security | User is group member: TRUE | O |  |  |  | O | O |  |
| Security | User is group member: FALSE |  |  |  | O |  |  |  |
| Business Rule | existing.value === value (same vote) → removeVote (toggle off) |  |  |  |  | O |  |  |
| Business Rule | existing.value !== value → upsertVote | O |  |  |  |  | O |  |
| Business Rule | No existing vote → upsertVote | O |  |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  | O | O |  |
| Return Status | 400 |  | O |  |  |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |  |
| Return Status | 404 |  |  | O |  |  |  |  |
| Return Status | 500 |  |  |  |  |  |  | O |
| Return Body | { voteScore, userVote: 1 } | O |  |  |  |  |  |  |
| Return Body | { voteScore, userVote: null } (removed vote) |  |  |  |  | O |  |  |
| Return Body | { voteScore, userVote: -1 } |  |  |  |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |  |  |  |
| Return Body | Post not found |  |  | O |  |  |  |  |
| Return Body | Must be a group member |  |  |  | O |  |  |  |
| Return Body | Internal server error |  |  |  |  |  |  | O |
| Exception | None | O |  |  |  | O | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |  |
| Exception | Repository / Dependency Error |  |  |  |  |  |  | O |
| Log Message | Post upvoted | O |  |  |  |  |  |  |
| Log Message | Vote removed (toggle off) |  |  |  |  | O |  |  |
| Log Message | Post downvoted |  |  |  |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |  |  |  |
| Log Message | Post not found |  |  | O |  |  |  |  |
| Log Message | Not a group member |  |  |  | O |  |  |  |
| Log Message | Unhandled exception |  |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |  |
| Type |  | Happy Path - Upvote | Validation Error | Business Rule - Not Found | Authorization Error | Happy Path - Toggle Off | Happy Path - Downvote | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |

---


## Module: Comments

### Function Code: `createComment`

**Service:** Comments Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-----------|---------------|---|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  | O |
| Input (req.body) | Input: postId (body): Valid UUID | O |  | O | O | O | O |  |
| Input (req.body) | Input: postId (body): Invalid UUID |  | O |  |  |  |  |  |
| Input (req.body) | Input: content (body): valid string 1-2000 | O |  | O | O | O | O |  |
| Input (req.body) | Input: content (body): empty or >2000 chars |  | O |  |  |  |  |  |
| Input (req.body) | Input: parentCommentId (body): valid UUID |  |  |  |  |  | O |  |
| Input (req.body) | Input: parentCommentId (body): absent | O |  | O | O | O |  |  |
| Input (req.body) | Input: parentCommentId (body): UUID pointing to wrong post |  |  |  |  |  |  |  |
| Input (req.body) | Input: mentionedUserIds (body): valid UUID array | O |  |  |  |  | O |  |
| Input (req.body) | Input: mentionedUserIds (body): absent | O |  | O | O |  |  |  |
| Repository | postsRepository.findById: Post Found | O |  |  | O | O | O |  |
| Repository | postsRepository.findById: Not Found |  |  | O |  |  |  |  |
| Repository | postsRepository.findById: Query Error |  |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  | O | O |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  | O |  |  |  |
| Repository | commentsRepository.findById (parent): Valid parent found |  |  |  |  |  | O |  |
| Repository | commentsRepository.findById (parent): Not found or wrong post |  |  |  |  |  |  |  |
| Repository | commentsRepository.create: Success | O |  |  |  |  | O |  |
| Repository | commentsRepository.create: Query Error |  |  |  |  |  |  | O |
| Repository | notificationsService.notifyUsers (reply): Success |  |  |  |  |  | O |  |
| Repository | notificationsService.notifyUsers (mention): Success | O |  |  |  |  | O |  |
| Security | authenticate middleware: PASS | O | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  |  | O |
| Security | User is group member: TRUE | O |  |  |  | O | O |  |
| Security | User is group member: FALSE |  |  |  | O |  |  |  |
| Business Rule | Top-level comment (no parentCommentId) | O |  |  |  |  |  |  |
| Business Rule | Reply comment (parentCommentId present) |  |  |  |  |  | O |  |
| Business Rule | Invalid parent (wrong post) → badRequest |  |  |  |  |  |  |  |
| Business Rule | mentionUserIds filtered to group members only | O |  |  |  |  | O |  |
| Business Rule | Reply parent author auto-mentioned/notified |  |  |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  | O |  |
| Return Status | 400 |  | O |  |  |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |  |
| Return Status | 404 |  |  | O |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |  | O |
| Return Body | Created comment with vote metadata | O |  |  |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |  |  |  |
| Return Body | Post not found |  |  | O |  |  |  |  |
| Return Body | Must be a group member |  |  |  | O |  |  |  |
| Return Body | Internal server error |  |  |  |  | O |  | O |
| Exception | None | O |  |  |  |  | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |  |
| Exception | ApiError.notFound (post) |  |  | O |  |  |  |  |
| Exception | ApiError.forbidden (not member) |  |  |  | O |  |  |  |
| Exception | Repository / Notification Error |  |  |  |  | O |  | O |
| Log Message | Comment created (top-level) | O |  |  |  |  |  |  |
| Log Message | Reply created + notification sent |  |  |  |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |  |  |  |
| Log Message | Post not found |  |  | O |  |  |  |  |
| Log Message | Not a group member |  |  |  | O |  |  |  |
| Log Message | Unhandled exception |  |  |  |  | O |  | O |
| — Result — |  |  |  |  |  |  |  |  |
| Type |  | Happy Path - Top-Level Comment | Validation Error | Business Rule - Post Not Found | Authorization Error | Exception / Dependency Failure | Happy Path - Reply Comment | Exception - DB Error |
| Pass/Fail |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |

---

### Function Code: `listCommentsByPost`

**Service:** Comments Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: postId (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: postId (param): Invalid UUID |  | O |  |  |  |
| Input (req.query) | Input: sort (query): newest (default) | O |  |  |  |  |
| Input (req.query) | Input: sort (query): votes |  |  |  | O |  |
| Input (req.query) | Input: sort (query): invalid value |  | O |  |  |  |
| Repository | postsRepository.findById: Post Found | O |  |  | O |  |
| Repository | postsRepository.findById: Not Found |  |  | O |  |  |
| Repository | postsRepository.findById: Query Error |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  | O |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  |  |  |
| Repository | commentsRepository.findAllByPostId: Success | O |  |  | O |  |
| Repository | commentsRepository.findAllByPostId: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | User is group member: TRUE | O |  |  | O |  |
| Security | User is group member: FALSE |  |  |  |  |  |
| Business Rule | sort=newest → sort by createdAt DESC | O |  |  |  |  |
| Business Rule | sort=votes → sortByVoteScore DESC |  |  |  | O |  |
| Business Rule | buildCommentTree: nested replies structure | O |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  | O |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Nested comment tree (newest sort) | O |  |  |  |  |
| Return Body | Nested comment tree (vote sort) |  |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Post not found |  |  | O |  |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Comments listed (newest) | O |  |  |  |  |
| Log Message | Comments listed (votes) |  |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Post not found |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path - Newest Sort | Validation Error | Business Rule - Not Found | Happy Path - Votes Sort | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `removeComment`

**Service:** Comments Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |
| Repository | commentsRepository.findById: Comment Found | O |  |  | O |  |
| Repository | commentsRepository.findById: Not Found |  |  | O |  |  |
| Repository | commentsRepository.findById: Query Error |  |  |  |  | O |
| Repository | commentsRepository.softDelete: Success | O |  |  |  |  |
| Repository | commentsRepository.softDelete: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | authorId === userId: TRUE | O |  |  |  |  |
| Security | authorId === userId: FALSE |  |  |  | O |  |
| Business Rule | Only comment author can delete | O |  |  |  |  |
| Business Rule | Non-author → forbidden |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | true (deleted) | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Comment not found |  |  | O |  |  |
| Return Body | Forbidden (not author) |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Comment removed | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Comment not found |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `updateComment`

**Service:** Comments Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |
| Input (req.body) | Input: content (body): valid string 1-2000 | O |  |  |  |  |
| Input (req.body) | Input: content (body): empty or >2000 |  | O |  |  |  |
| Repository | commentsRepository.findById: Comment Found | O |  |  | O |  |
| Repository | commentsRepository.findById: Not Found |  |  | O |  |  |
| Repository | commentsRepository.findById: Query Error |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  | O |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  | O |  |
| Repository | commentsRepository.update: Success | O |  |  |  |  |
| Repository | commentsRepository.update: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | authorId === userId: TRUE | O |  |  |  |  |
| Security | authorId === userId: FALSE |  |  |  | O |  |
| Security | User is group member: TRUE | O |  |  |  |  |
| Security | User is group member: FALSE |  |  |  | O |  |
| Business Rule | Only author can update comment | O |  |  |  |  |
| Business Rule | Non-author → forbidden |  |  |  | O |  |
| Business Rule | editedAt set on update | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Updated comment with vote metadata | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Comment not found |  |  | O |  |  |
| Return Body | Forbidden (not author or not member) |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Comment updated | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Comment not found |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `voteComment`

**Service:** Comments Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |  |
| Input (req.body) | Input: value (body): 1 (upvote) | O |  |  |  |  |  |
| Input (req.body) | Input: value (body): -1 (downvote) |  |  |  |  | O |  |
| Input (req.body) | Input: value (body): invalid value |  | O |  |  |  |  |
| Repository | commentsRepository.findById: Comment Found | O |  |  | O | O |  |
| Repository | commentsRepository.findById: Not Found |  |  | O |  |  |  |
| Repository | commentsRepository.findById: Query Error |  |  |  |  |  | O |
| Repository | groupsRepository.isMember: User is a member | O |  |  |  | O |  |
| Repository | groupsRepository.isMember: User is NOT a member |  |  |  | O |  |  |
| Repository | commentsRepository.findByIdDetailed: existingVote found | O |  |  |  |  |  |
| Repository | commentsRepository.findByIdDetailed: no existing vote |  |  |  |  | O |  |
| Repository | commentsRepository.upsertVote: Success | O |  |  |  | O |  |
| Repository | commentsRepository.removeVote: Success (same value toggle) |  |  |  |  |  |  |
| Repository | commentsRepository.upsertVote / removeVote: Query Error |  |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  | O |
| Security | User is group member: TRUE | O |  |  |  | O |  |
| Security | User is group member: FALSE |  |  |  | O |  |  |
| Business Rule | existingVote === value → removeVote (toggle off) | O |  |  |  |  |  |
| Business Rule | existingVote !== value → upsertVote |  |  |  |  | O |  |
| Business Rule | No existing vote → upsertVote |  |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  | O |  |
| Return Status | 400 |  | O |  |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  |  | O |
| Return Body | { voteScore, userVote: null } (vote removed) | O |  |  |  |  |  |
| Return Body | { voteScore, userVote: -1 } (downvote) |  |  |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |  |  |
| Return Body | Comment not found |  |  | O |  |  |  |
| Return Body | Must be a group member |  |  |  | O |  |  |
| Return Body | Internal server error |  |  |  |  |  | O |
| Exception | None | O |  |  |  | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | Repository / Dependency Error |  |  |  |  |  | O |
| Log Message | Vote toggled off | O |  |  |  |  |  |
| Log Message | Comment downvoted |  |  |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Comment not found |  |  | O |  |  |  |
| Log Message | Not a group member |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - Toggle Vote Off | Validation Error | Business Rule - Not Found | Authorization Error | Happy Path - Downvote | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---


## Module: Notifications

### Function Code: `getUnreadCount`

**Service:** Notifications Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 |
|-----------|---------------|---|---|---|
| — Condition — |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |
| Precondition | JWT Service OK | O |  |  |
| Precondition | JWT Service Fail |  | O |  |
| Precondition | bcrypt Service OK | O |  |  |
| Precondition | bcrypt Service Fail |  | O |  |
| Precondition | Cloudinary Service OK | O |  |  |
| Precondition | Cloudinary Service Fail |  | O |  |
| Precondition | LiveKit Service OK | O |  |  |
| Precondition | LiveKit Service Fail |  | O |  |
| Repository | notificationsRepository.count (isRead: false): Success | O |  |  |
| Repository | notificationsRepository.count: Query Error |  |  | O |
| Security | authenticate middleware: PASS | O |  |  |
| Security | authenticate middleware: FAIL |  | O |  |
| Business Rule | Counts notifications where isRead=false for userId | O |  |  |
| — Confirm — |  |  |  |  |
| Return Status | 200 | O |  |  |
| Return Status | 401 |  | O |  |
| Return Status | 500 |  |  | O |
| Return Body | { count: number } | O |  |  |
| Return Body | Unauthorized |  | O |  |
| Return Body | Internal server error |  |  | O |
| Exception | None | O |  |  |
| Exception | ApiError.unauthorized |  | O |  |
| Exception | Repository / Dependency Error |  |  | O |
| Log Message | Unread count returned | O |  |  |
| Log Message | Authorization denied |  | O |  |
| Log Message | Unhandled exception |  |  | O |
| — Result — |  |  |  |  |
| Type |  | Happy Path | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |
| Executed Date |  |  |  |  |
| Defect ID |  |  |  |  |

---

### Function Code: `listNotifications`

**Service:** Notifications Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| — Condition — |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  | O |
| Input (req.query) | Input: page (query): valid int | O |  | O |  |
| Input (req.query) | Input: limit (query): valid int | O |  | O |  |
| Input (req.query) | Input: unread (query): true |  |  | O |  |
| Input (req.query) | Input: unread (query): false / absent | O |  |  |  |
| Repository | notificationsRepository.findMany: Success | O |  | O |  |
| Repository | notificationsRepository.findMany: Query Error |  |  |  | O |
| Repository | notificationsRepository.count: Success | O |  | O |  |
| Security | authenticate middleware: PASS | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  | O |
| Business Rule | unread=true → filter isRead=false | O |  | O |  |
| Business Rule | Pagination applied | O |  | O |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 200 | O |  | O |  |
| Return Status | 400 |  | O |  |  |
| Return Status | 500 |  |  |  | O |
| Return Body | Paginated notifications list | O |  |  |  |
| Return Body | Paginated unread notifications |  |  | O |  |
| Return Body | Validation error details |  | O |  |  |
| Return Body | Internal server error |  |  |  | O |
| Exception | None | O |  | O |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |
| Exception | Repository / Dependency Error |  |  |  | O |
| Log Message | Notifications listed | O |  |  |  |
| Log Message | Unread notifications listed |  |  | O |  |
| Log Message | Validation failed |  | O |  |  |
| Log Message | Unhandled exception |  |  |  | O |
| — Result — |  |  |  |  |  |
| Type |  | Happy Path - All Notifications | Validation Error | Happy Path - Unread Only | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---

### Function Code: `markAllNotificationsRead`

**Service:** Notifications Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 |
|-----------|---------------|---|---|---|
| — Condition — |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |
| Precondition | JWT Service OK | O |  |  |
| Precondition | JWT Service Fail |  | O |  |
| Precondition | bcrypt Service OK | O |  |  |
| Precondition | bcrypt Service Fail |  | O |  |
| Precondition | Cloudinary Service OK | O |  |  |
| Precondition | Cloudinary Service Fail |  | O |  |
| Precondition | LiveKit Service OK | O |  |  |
| Precondition | LiveKit Service Fail |  | O |  |
| Repository | notificationsRepository.markAllRead: Success | O |  |  |
| Repository | notificationsRepository.markAllRead: Query Error |  |  | O |
| Security | authenticate middleware: PASS | O |  |  |
| Security | authenticate middleware: FAIL |  | O |  |
| Business Rule | Marks all notifications as read for userId | O |  |  |
| — Confirm — |  |  |  |  |
| Return Status | 200 | O |  |  |
| Return Status | 401 |  | O |  |
| Return Status | 500 |  |  | O |
| Return Body | Success confirmation | O |  |  |
| Return Body | Unauthorized |  | O |  |
| Return Body | Internal server error |  |  | O |
| Exception | None | O |  |  |
| Exception | ApiError.unauthorized |  | O |  |
| Exception | Repository / Dependency Error |  |  | O |
| Log Message | All notifications marked read | O |  |  |
| Log Message | Authorization denied |  | O |  |
| Log Message | Unhandled exception |  |  | O |
| — Result — |  |  |  |  |
| Type |  | Happy Path | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |
| Executed Date |  |  |  |  |
| Defect ID |  |  |  |  |

---

### Function Code: `markNotificationRead`

**Service:** Notifications Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| — Condition — |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O | O |  |  |
| Precondition | JWT Service Fail |  |  | O |  |
| Precondition | bcrypt Service OK | O | O |  |  |
| Precondition | bcrypt Service Fail |  |  | O |  |
| Precondition | Cloudinary Service OK | O | O |  |  |
| Precondition | Cloudinary Service Fail |  |  | O |  |
| Precondition | LiveKit Service OK | O | O |  |  |
| Precondition | LiveKit Service Fail |  |  | O |  |
| Input (req.params) | Input: id (param): Valid UUID | O |  |  |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |
| Repository | notificationsRepository.markRead: Success | O |  |  |  |
| Repository | notificationsRepository.markRead: Query Error |  |  |  | O |
| Security | authenticate middleware: PASS | O | O |  |  |
| Security | authenticate middleware: FAIL |  |  | O |  |
| Business Rule | Marks specific notification as read for userId | O |  |  |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |
| Return Status | 400 |  | O |  |  |
| Return Status | 401 |  |  | O |  |
| Return Status | 500 |  |  |  | O |
| Return Body | Updated notification | O |  |  |  |
| Return Body | Validation error details |  | O |  |  |
| Return Body | Unauthorized |  |  | O |  |
| Return Body | Internal server error |  |  |  | O |
| Exception | None | O |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |
| Exception | ApiError.unauthorized |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  | O |
| Log Message | Notification marked read | O |  |  |  |
| Log Message | Validation failed |  | O |  |  |
| Log Message | Authorization denied |  |  | O |  |
| Log Message | Unhandled exception |  |  |  | O |
| — Result — |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---


## Module: Dashboard

### Function Code: `getGroupStats`

**Service:** Dashboard Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: groupId (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: groupId (param): Invalid UUID |  | O |  |  |  |
| Repository | prisma.studyGroup.findFirst: Group Found | O |  |  |  |  |
| Repository | prisma.studyGroup.findFirst: Not Found |  |  | O |  |  |
| Repository | prisma.studyGroup.findFirst: Query Error |  |  |  |  | O |
| Repository | prisma.studySession.groupBy: Success | O |  |  |  |  |
| Repository | prisma.groupMember.findMany: Success | O |  |  |  |  |
| Repository | prisma DB queries: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | authorize(ADMIN) middleware: PASS | O | O | O |  |  |
| Security | authorize(ADMIN) middleware: FAIL |  |  |  | O |  |
| Security | user.roles includes ADMIN: TRUE | O |  |  |  |  |
| Security | user.roles includes ADMIN: FALSE |  |  |  | O |  |
| Business Rule | isAdmin=TRUE → allowed |  |  |  |  |  |
| Business Rule | isAdmin=FALSE → forbidden |  |  |  | O |  |
| Business Rule | Group not found → notFound |  |  | O |  |  |
| Business Rule | Returns sessionStats and memberGrowth charts | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { charts: { sessionStats, memberGrowth } } | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Group not found |  |  | O |  |  |
| Return Body | Forbidden (not admin) |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Group stats returned | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Group not found |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `getStats`

**Service:** Dashboard Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  |  |
| Precondition | JWT Service Fail |  |  |  | O |  |
| Precondition | bcrypt Service OK | O | O | O |  |  |
| Precondition | bcrypt Service Fail |  |  |  | O |  |
| Precondition | Cloudinary Service OK | O | O | O |  |  |
| Precondition | Cloudinary Service Fail |  |  |  | O |  |
| Precondition | LiveKit Service OK | O | O | O |  |  |
| Precondition | LiveKit Service Fail |  |  |  | O |  |
| Repository | prisma DB queries (admin stats): Success | O |  |  |  |  |
| Repository | prisma DB queries (leader stats): Success |  | O |  |  |  |
| Repository | prisma DB queries (student stats): Success |  |  | O |  |  |
| Repository | prisma DB queries: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O |  |  |
| Security | authenticate middleware: FAIL |  |  |  | O |  |
| Security | user.roles includes ADMIN: TRUE | O |  |  |  |  |
| Security | user.roles includes LEADER: TRUE |  | O |  |  |  |
| Security | user.roles includes neither (MEMBER): TRUE |  |  | O |  |  |
| Business Rule | ADMIN → getAdminStats() | O |  |  |  |  |
| Business Rule | LEADER → getLeaderStats(userId) |  | O |  |  |  |
| Business Rule | MEMBER → getStudentStats(userId) |  |  | O |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O | O | O |  |  |
| Return Status | 401 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Admin stats { role, totalUsers, activeGroups, charts } | O |  |  |  |  |
| Return Body | Leader stats { role, groupCount, totalMembers, charts } |  | O |  |  |  |
| Return Body | Student stats { role, totalGroups, upcomingSessions, charts } |  |  | O |  |  |
| Return Body | Unauthorized |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O | O | O |  |  |
| Exception | ApiError.unauthorized |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Admin stats returned | O |  |  |  |  |
| Log Message | Leader stats returned |  | O |  |  |  |
| Log Message | Student stats returned |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path - Admin | Happy Path - Leader | Happy Path - Student | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Upload

### Function Code: `getCloudinarySignature`

**Service:** Upload Controller

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| — Condition — |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O |  |  |  |
| Precondition | JWT Service Fail |  |  | O |  |
| Precondition | bcrypt Service OK | O |  |  |  |
| Precondition | bcrypt Service Fail |  |  | O |  |
| Precondition | Cloudinary Service OK (configured) | O |  |  |  |
| Precondition | Cloudinary Service Not Configured |  | O |  |  |
| Precondition | Cloudinary Service Fail (runtime error) |  |  |  | O |
| Precondition | LiveKit Service OK | O |  |  |  |
| Precondition | LiveKit Service Fail |  |  | O |  |
| Repository | getUploadSignature(): Success | O |  |  |  |
| Repository | getUploadSignature(): Error |  |  |  | O |
| Security | authenticate middleware: PASS | O | O |  |  |
| Security | authenticate middleware: FAIL |  |  | O |  |
| Business Rule | isCloudinaryConfigured(): TRUE → generate signature | O |  |  |  |
| Business Rule | isCloudinaryConfigured(): FALSE → serviceUnavailable |  | O |  |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |
| Return Status | 401 |  |  | O |  |
| Return Status | 503 |  | O |  |  |
| Return Status | 500 |  |  |  | O |
| Return Body | { message, data: { signature, timestamp, ... } } | O |  |  |  |
| Return Body | Unauthorized |  |  | O |  |
| Return Body | Cloudinary is not configured |  | O |  |  |
| Return Body | Internal server error |  |  |  | O |
| Exception | None | O |  |  |  |
| Exception | ApiError.unauthorized |  |  | O |  |
| Exception | ApiError.serviceUnavailable (not configured) |  | O |  |  |
| Exception | Cloudinary / Dependency Error |  |  |  | O |
| Log Message | Upload signature generated | O |  |  |  |
| Log Message | Authorization denied |  |  | O |  |
| Log Message | Cloudinary not configured |  | O |  |  |
| Log Message | Unhandled exception |  |  |  | O |
| — Result — |  |  |  |  |  |
| Type |  | Happy Path | Business Rule - Not Configured | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---


## Module: Reports

### Function Code: `createReport`

**Service:** Reports Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| — Condition — |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O | O |  |  |
| Precondition | JWT Service Fail |  |  | O |  |
| Precondition | bcrypt Service OK | O | O |  |  |
| Precondition | bcrypt Service Fail |  |  | O |  |
| Precondition | Cloudinary Service OK | O | O |  |  |
| Precondition | Cloudinary Service Fail |  |  | O |  |
| Precondition | LiveKit Service OK | O | O |  |  |
| Precondition | LiveKit Service Fail |  |  | O |  |
| Input (req.body) | Input: reportedType (body): USER / GROUP / POST / COMMENT / RESOURCE | O |  |  |  |
| Input (req.body) | Input: reportedType (body): invalid value |  | O |  |  |
| Input (req.body) | Input: reportedId (body): non-empty string | O |  |  |  |
| Input (req.body) | Input: reportedId (body): missing or empty |  | O |  |  |
| Input (req.body) | Input: reason (body): string 10-500 chars | O |  |  |  |
| Input (req.body) | Input: reason (body): too short (<10) or too long (>500) |  | O |  |  |
| Repository | reportsRepository.create: Success | O |  |  |  |
| Repository | reportsRepository.create: Query Error |  |  |  | O |
| Security | authenticate middleware: PASS | O | O |  |  |
| Security | authenticate middleware: FAIL |  |  | O |  |
| Business Rule | reporterId set to authenticated userId | O |  |  |  |
| Business Rule | Report status defaults to PENDING | O |  |  |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |
| Return Status | 400 |  | O |  |  |
| Return Status | 401 |  |  | O |  |
| Return Status | 500 |  |  |  | O |
| Return Body | Created report object | O |  |  |  |
| Return Body | Validation error details |  | O |  |  |
| Return Body | Unauthorized |  |  | O |  |
| Return Body | Internal server error |  |  |  | O |
| Exception | None | O |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |
| Exception | ApiError.unauthorized |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  | O |
| Log Message | Report created | O |  |  |  |
| Log Message | Validation failed |  | O |  |  |
| Log Message | Authorization denied |  |  | O |  |
| Log Message | Unhandled exception |  |  |  | O |
| — Result — |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---

### Function Code: `listReports`

**Service:** Reports Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-----------|---------------|---|---|---|---|
| — Condition — |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  | O |
| Input (req.query) | Input: page (query): valid int | O |  |  |  |
| Input (req.query) | Input: limit (query): valid int | O |  |  |  |
| Input (req.query) | Input: status (query): PENDING / REVIEWED / RESOLVED / DISMISSED | O |  |  |  |
| Input (req.query) | Input: status (query): invalid value |  | O |  |  |
| Repository | reportsRepository.findMany: Success | O |  |  |  |
| Repository | reportsRepository.findMany: Query Error |  |  |  | O |
| Repository | reportsRepository.count: Success | O |  |  |  |
| Security | authenticate middleware: PASS | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  | O |
| Security | authorize(ADMIN) middleware: PASS | O | O |  |  |
| Security | authorize(ADMIN) middleware: FAIL |  |  | O |  |
| Business Rule | Filter: query.status → where.status | O |  |  |  |
| Business Rule | Pagination applied | O |  |  |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |
| Return Status | 400 |  | O |  |  |
| Return Status | 403 |  |  | O |  |
| Return Status | 500 |  |  |  | O |
| Return Body | Paginated reports list | O |  |  |  |
| Return Body | Validation error details |  | O |  |  |
| Return Body | Forbidden (not admin) |  |  | O |  |
| Return Body | Internal server error |  |  |  | O |
| Exception | None | O |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |
| Exception | ApiError.forbidden |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  | O |
| Log Message | Reports listed | O |  |  |  |
| Log Message | Validation failed |  | O |  |  |
| Log Message | Authorization denied |  |  | O |  |
| Log Message | Unhandled exception |  |  |  | O |
| — Result — |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---

### Function Code: `updateReportStatus`

**Service:** Reports Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.params) | Input: id (param): Valid UUID | O |  | O | O |  |
| Input (req.params) | Input: id (param): Invalid UUID |  | O |  |  |  |
| Input (req.body) | Input: status (body): PENDING | O |  |  |  |  |
| Input (req.body) | Input: status (body): REVIEWED | O |  |  |  |  |
| Input (req.body) | Input: status (body): RESOLVED | O |  |  |  |  |
| Input (req.body) | Input: status (body): DISMISSED | O |  |  |  |  |
| Input (req.body) | Input: status (body): invalid value |  | O |  |  |  |
| Repository | reportsRepository.update: Report Found and Updated | O |  |  |  |  |
| Repository | reportsRepository.update: Report Not Found (returns null) |  |  | O |  |  |
| Repository | reportsRepository.update: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O | O | O |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Security | authorize(ADMIN) middleware: PASS | O | O | O |  |  |
| Security | authorize(ADMIN) middleware: FAIL |  |  |  | O |  |
| Business Rule | update returns null → notFound (404) |  |  | O |  |  |
| Business Rule | update returns report → success |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Updated report object | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Report not found |  |  | O |  |  |
| Return Body | Forbidden (not admin) |  |  |  | O |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | Repository / Dependency Error |  |  |  |  | O |
| Log Message | Report status updated | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Report not found |  |  | O |  |  |
| Log Message | Authorization denied |  |  |  | O |  |
| Log Message | Unhandled exception |  |  |  |  | O |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule - Not Found | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

