# Excel Matrix Format

> Single merged decision matrix per function code.
> **Decision Table Rules:** (1) Each UTCID = one execution path. (2) Within the same condition group, only one mutually-exclusive sub-condition is `O` per UTCID. (3) Every `O` maps to a real scenario. (4) Every condition row is mapped to at least one UTCID. (5) Sections: Precondition, Input, Repository, Security, Business Rule, Confirm, Result. (6) Preserve UTCIDs and scenarios.
> UTCID convention: **UTCID01** = Happy Path | **UTCID02** = Validation Error | **UTCID03** = Business Rule Error | **UTCID04** = Authorization Error | **UTCID05** = Exception / Dependency Failure | Additional UTCIDs for extra branches.

**Column structure:** `Condition` | `Sub Condition` | `UTCID01` … `UTCID0N`

**Row groups:**
- **Condition** → Precondition, Input (req.body), Repository, Security, Business Rule
- **Confirm** → Return Status, Return Body, Exception, Log Message
- **Result** → Type, Pass/Fail, Executed Date, Defect ID


## Module: Auth

### Function Code: `register`

**Service:** Authentication Service

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
| — Confirm — |  |  |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
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
| — Confirm — |  |  |  |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |  |
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
| — Confirm — |  |  |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
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
| — Condition — |  |  |  |  |  |  |  |  |
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
| — Confirm — |  |  |  |  |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |  |  |
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
| Business Rule | Branch: if (refreshToken) → deleteRefreshToken | O |  |  |  |
| Business Rule | Branch: else if (userId) → deleteUserRefreshTokens |  | O |  |  |
| Business Rule | Branch: Always returns true from service |  |  | O |  |
| — Confirm — |  |  |  |  |  |
| Return Status | 200 | O | O | O |  |
| Return Status | 401 |  |  |  | O |
| Return Body | Logged out successfully | O | O | O |  |
| Return Body | Unauthorized |  |  |  | O |
| Exception | None | O | O | O |  |
| Exception | ApiError.unauthorized |  |  |  | O |
| Log Message | Logged out successfully | O | O | O |  |
| Log Message | Auth failed |  |  |  | O |
| — Result — |  |  |  |  |  |
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
| Input (req.body) | Input: id (param): Existing User ID |  |  |  | O | O |
| Input (req.body) | Input: id (param): Invalid UUID |  |  | O |  |  |
| Repository | usersRepository.findById: User Found (deletedAt: null) |  |  | O |  |  |
| Repository | usersRepository.findById: User Not Found |  |  |  |  |  |
| Repository | usersRepository.findById: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS / FAIL |  |  |  | O |  |
| Business Rule | Lookup: formatUser maps roles array | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
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
| Input (req.body) | Input: page (query): valid int >= 1 / default | O |  | O | O | O |
| Input (req.body) | Input: limit (query): valid int 1-100 / default | O |  | O | O | O |
| Input (req.body) | Input: search (query): optional string | O |  |  |  |  |
| Input (req.body) | Input: status (query): ACTIVE / INACTIVE / SUSPENDED / invalid |  | O | O | O |  |
| Repository | usersRepository.findMany: Success | O |  |  |  |  |
| Repository | usersRepository.findMany: Query Error |  |  |  |  | O |
| Repository | usersRepository.count: Success | O |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  | O | O |  |
| Security | authorize(ADMIN): PASS / FAIL |  |  | O | O |  |
| Business Rule | Filter: query.status → where.status | O |  |  |  |  |
| Business Rule | Filter: query.search → OR fullName/email contains |  | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
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
| Input (req.body) | Input: id (param): valid UUID / invalid UUID |  | O |  |  |  |
| Repository | usersRepository.softDelete: Success (deletedAt + status INACTIVE) | O | O |  |  |  |
| Repository | usersRepository.softDelete: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS / FAIL |  |  | O | O |  |
| Security | authorize(ADMIN): PASS / FAIL |  |  | O | O |  |
| Business Rule | Soft Delete: No explicit not-found check in service | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `setUserStatus`

**Service:** User Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O | O | O | O |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O | O | O | O |
| Precondition | JWT Service Fail |  |  |  |  |  |  |
| Precondition | bcrypt Service OK | O | O | O | O | O | O |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |
| Precondition | Cloudinary Service OK | O | O | O | O | O | O |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |
| Precondition | LiveKit Service OK | O | O | O | O | O | O |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing User ID |  |  |  |  |  | O |
| Input (req.body) | Input: id (param): Non Existing User ID |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): ACTIVE |  |  |  |  |  | O |
| Input (req.body) | Input: status (body): INACTIVE |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): SUSPENDED |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): Invalid Status |  |  |  |  |  |  |
| Repository | usersRepository.findById (requester): Requester Found | O | O |  |  |  |  |
| Repository | usersRepository.findById (target): User Found | O | O |  |  |  |  |
| Repository | usersRepository.findById (target): User Not Found |  |  |  |  |  | O |
| Repository | usersRepository.update: Success | O | O |  |  |  |  |
| Repository | usersRepository.revokeRefreshTokens: Called on SUSPENDED |  |  |  |  |  | O |
| Security | authorize(ADMIN) middleware: PASS | O | O |  | O |  | O |
| Security | authorize(ADMIN) middleware: FAIL |  |  |  |  |  |  |
| Security | requesterIsAdmin (service): TRUE | O | O | O | O |  |  |
| Security | requesterIsAdmin (service): FALSE |  |  |  |  |  |  |
| Security | targetIsAdmin: TRUE | O | O |  | O |  |  |
| Security | targetIsAdmin: FALSE |  |  | O |  |  |  |
| Business Rule | Self Status Change: id === requesterId (denied) |  |  |  |  | O | O |
| Business Rule | Admin Target: Cannot change admin account status | O | O |  | O |  | O |
| Business Rule | Suspension: SUSPENDED → revokeRefreshTokens | O | O |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  | O |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | Updated user with new status | O |  |  |  |  | O |
| Return Body | Validation error |  | O |  |  |  |  |
| Return Body | Cannot change own/admin status |  |  | O | O |  |  |
| Return Body | User not found |  |  |  |  |  |  |
| Exception | None | O |  |  |  |  | O |
| Exception | ApiError.badRequest (validation/self) |  | O | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | ApiError.notFound |  |  |  |  |  |  |
| Log Message | User status updated | O |  |  |  |  | O |
| Log Message | Refresh tokens revoked (SUSPENDED) |  |  |  |  |  |  |
| Log Message | Status change rejected |  | O | O | O |  |  |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - ACTIVE/INACTIVE | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | Happy Path - SUSPENDED |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `updateUser`

**Service:** User Management Service

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
| Input (req.body) | Input: id (param): valid UUID | O | O |  |  | O |
| Input (req.body) | Input: fullName (body): optional 2-100 / invalid |  | O |  |  |  |
| Input (req.body) | Input: bio (body): optional max 500 / invalid |  | O |  |  |  |
| Input (req.body) | Input: avatar (body): optional valid URL / invalid |  | O |  |  |  |
| Input (req.body) | Input: requesterId: same as id (self) / different | O |  |  |  |  |
| Repository | usersRepository.findById (requester): Found when id !== requesterId | O | O | O |  |  |
| Repository | usersRepository.update: Success / Query Error |  |  | O |  | O |
| Security | Self Update: id === requesterId → allowed | O |  |  |  |  |
| Security | Admin Update: requester roles includes ADMIN | O | O | O | O |  |
| Security | Forbidden: Non-admin updating other user |  |  | O | O |  |
| Business Rule | Update Fields: fullName, bio, avatar only | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Updated user | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Groups

### Function Code: `approveJoinRequest`

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
| Input (req.body) | Input: requestId (param): Existing Request ID |  |  |  | O | O |
| Input (req.body) | Input: requestId (param): Invalid UUID |  |  | O |  |  |
| Repository | groupsRepository.findJoinRequestById: Request Found PENDING | O | O |  |  |  |
| Repository | groupsRepository.addMember: Success | O | O |  |  |  |
| Security | Role Validation: LEADER required | O | O |  |  |  |
| Business Rule | Delegation: calls handleJoinRequest(requestId, APPROVED, userId) | O | O |  |  |  |
| Business Rule | Approval: addMember with role MEMBER | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Approved join request | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

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
| Input (req.body) | Input: id/groupId (param): Existing Group ID |  |  |  |  | O |
| Input (req.body) | Input: id/groupId (param): Invalid UUID |  |  | O | O |  |
| Repository | groupsRepository.findJoinRequest: Pending Request Found | O | O |  |  |  |
| Repository | groupsRepository.findJoinRequest: Request Not Found |  |  | O | O |  |
| Repository | groupsRepository.deleteJoinRequest: Success | O | O |  |  |  |
| Repository | groupsRepository.deleteJoinRequest: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O |  |  |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Business Rule | Join Request: status must be PENDING | O | O |  |  |  |
| Business Rule | Join Request: status !== PENDING → badRequest |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Join request cancelled | O |  |  |  |  |
| Return Body | Join request not found |  |  | O |  |  |
| Return Body | Only pending join requests can be cancelled |  |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `createGroup`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: name (body): valid 3-100 chars | O | O |  | O | O |
| Input (req.body) | Input: name (body): invalid length / missing |  |  |  |  |  |
| Input (req.body) | Input: subject (body): non-empty trimmed string |  | O |  |  |  |
| Input (req.body) | Input: subject (body): empty / missing | O |  |  |  |  |
| Input (req.body) | Input: description (body): optional string | O | O |  |  |  |
| Input (req.body) | Input: maxMembers (body): optional int 2-100 | O |  |  |  |  |
| Input (req.body) | Input: maxMembers (body): invalid int |  |  |  | O |  |
| Repository | groupsRepository.create: Success (creator as LEADER member) | O | O |  |  |  |
| Repository | groupsRepository.create: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS | O | O |  |  |  |
| Security | authenticate middleware: FAIL |  |  |  | O |  |
| Business Rule | Group Creation: createdBy = userId | O | O |  |  |  |
| Business Rule | Group Creation: Auto-add creator as LEADER member |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 401 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Created group | O |  |  |  |  |
| Return Body | Validation error |  | O |  |  |  |
| Return Body | Internal server error |  |  |  |  | O |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `getGroupById`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-----------|---------------|---|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |  |
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
| Input (req.body) | Input: id (param): Existing Group ID |  |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Non Existing Group ID |  |  | O |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |  |  |
| Repository | groupsRepository.findById: Group Found | O | O |  |  |  | O | O |
| Repository | groupsRepository.findById: Group Not Found |  |  | O |  |  |  |  |
| Repository | groupsRepository.findJoinRequest: Pending Request Found | O | O |  |  |  | O | O |
| Repository | groupsRepository.findJoinRequest: No Pending Request |  |  | O |  |  |  |  |
| Security | Role Validation: ADMIN | O | O |  |  |  | O | O |
| Security | Role Validation: LEADER |  |  |  |  |  |  |  |
| Security | Role Validation: MEMBER |  |  |  |  |  |  |  |
| Security | Role Validation: Anonymous (no auth) |  |  | O |  |  |  |  |
| Business Rule | Group Status: ACTIVE | O | O |  |  | O | O | O |
| Business Rule | Group Status: ARCHIVED (admin visible) |  |  |  |  |  |  |  |
| Business Rule | Group Status: ARCHIVED (non-admin hidden) |  |  |  | O |  |  |  |
| Business Rule | Join Request Visibility: Leader sees joinRequests | O | O |  |  |  | O | O |
| Business Rule | Join Request Visibility: Non-leader joinRequests hidden |  |  |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  | O |  |
| Return Status | 400 |  | O |  |  |  |  |  |
| Return Status | 404 |  |  | O |  |  |  | O |
| Return Status | 500 |  |  |  |  | O |  |  |
| Return Body | Group details (+ myJoinRequest if pending) | O |  |  |  |  | O |  |
| Return Body | Validation error |  | O |  |  |  |  |  |
| Return Body | Group not found |  |  | O |  |  |  | O |
| Exception | None | O |  |  |  |  | O |  |
| Exception | ApiError.badRequest |  | O |  |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  | O |
| Log Message | Group retrieved | O |  |  |  |  | O |  |
| Log Message | Group not found (archived hidden) |  |  | O |  |  |  | O |
| — Result — |  |  |  |  |  |  |  |  |
| Type |  | Happy Path - Active Group | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | Archived + Admin | Archived + Non-Admin |
| Pass/Fail |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |

---

### Function Code: `handleJoinRequest`

**Service:** Study Group Service

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
| Input (req.body) | Input: requestId (param): Existing Request ID |  |  |  | O | O | O |
| Input (req.body) | Input: requestId (param): Non Existing Request ID |  |  |  |  |  |  |
| Input (req.body) | Input: requestId (param): Invalid UUID |  |  | O |  |  |  |
| Input (req.body) | Input: status (body): APPROVED | O |  |  |  |  |  |
| Input (req.body) | Input: status (body): REJECTED |  | O |  |  |  |  |
| Input (req.body) | Input: status (body): Invalid Status |  |  |  | O | O | O |
| Repository | groupsRepository.findJoinRequestById: Request Found | O | O |  | O |  |  |
| Repository | groupsRepository.findJoinRequestById: Request Not Found |  |  | O |  |  |  |
| Repository | groupsRepository.isMember: Leader Member | O |  |  |  |  |  |
| Repository | groupsRepository.isMember: Not Leader / Not Member |  |  |  | O |  |  |
| Repository | groupsRepository.updateJoinRequest: Success | O | O |  |  |  |  |
| Repository | groupsRepository.addMember: Success (on APPROVED) | O | O |  |  |  |  |
| Security | Role Validation: LEADER | O | O |  |  |  |  |
| Security | Role Validation: MEMBER (non-leader) |  |  |  |  |  |  |
| Security | Role Validation: Unauthorized |  |  |  |  | O | O |
| Business Rule | Join Request Status: PENDING | O | O |  | O |  |  |
| Business Rule | Join Request Status: Already Processed |  |  |  |  |  |  |
| Business Rule | Approval Action: APPROVED → addMember | O | O |  |  |  |  |
| Business Rule | Approval Action: REJECTED → update only |  |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  | O |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | Updated join request | O |  |  |  |  | O |
| Return Body | Validation error |  | O |  |  |  |  |
| Return Body | Join request not found / no longer pending |  |  | O |  |  |  |
| Return Body | Forbidden |  |  |  | O |  |  |
| Exception | None | O |  |  |  |  | O |
| Exception | ApiError.badRequest |  | O | O |  |  |  |
| Exception | ApiError.notFound |  |  |  |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Log Message | Join request approved/rejected | O |  |  |  |  | O |
| Log Message | Validation/business rejected |  | O | O | O |  |  |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - Approve | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | Reject Request |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `listGroups`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: page (query): valid int >= 1 | O |  | O |  | O |
| Input (req.body) | Input: page (query): invalid / missing (defaults) |  | O |  |  |  |
| Input (req.body) | Input: limit (query): valid int 1-100 | O |  | O |  | O |
| Input (req.body) | Input: limit (query): invalid (defaults/clamped) |  | O |  |  |  |
| Input (req.body) | Input: search (query): present string | O |  | O |  | O |
| Input (req.body) | Input: search (query): absent |  | O |  |  |  |
| Input (req.body) | Input: myGroups (query): true | O |  | O |  |  |
| Input (req.body) | Input: myGroups (query): false / absent |  | O |  |  |  |
| Input (req.body) | Input: status (query): ACTIVE / ARCHIVED / DELETED |  |  | O |  |  |
| Input (req.body) | Input: status (query): invalid value |  | O |  |  |  |
| Repository | groupsRepository.findMany: Success | O |  | O |  |  |
| Repository | groupsRepository.findMany: Query Error |  |  |  |  | O |
| Repository | groupsRepository.count: Success | O |  | O |  |  |
| Repository | groupsRepository.count: Query Error |  |  |  |  | O |
| Security | Authentication: Optional (public route) | O |  | O |  |  |
| Security | Role Validation: ADMIN sees all statuses |  |  | O |  |  |
| Security | Role Validation: Non-admin sees ACTIVE only | O |  |  |  |  |
| Business Rule | Filter: query.status set → filter by status |  |  | O |  |  |
| Business Rule | Filter: !isAdmin && !status → where.status = ACTIVE | O |  |  |  |  |
| Business Rule | Filter: myGroups=true + userId → member filter + ACTIVE |  |  |  |  |  |
| Business Rule | Filter: search → OR name/subject contains |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { items, pagination } | O |  |  |  |  |
| Return Body | Validation error |  | O |  |  |  |
| Return Body | Internal server error |  |  |  |  | O |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
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
| Input (req.body) | Input: requestId (param): Existing Request ID |  |  |  | O | O |  |
| Input (req.body) | Input: requestId (param): Invalid UUID |  |  | O |  |  |  |
| Repository | groupsRepository.findJoinRequestById: Request Found PENDING | O | O |  |  |  | O |
| Repository | groupsRepository.updateJoinRequest: Success REJECTED | O | O |  |  |  | O |
| Security | Role Validation: LEADER required | O | O |  |  |  | O |
| Business Rule | Delegation: calls handleJoinRequest(requestId, REJECTED, userId) | O | O |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | Rejected join request | O |  |  |  |  | O |
| Exception | None | O |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | Repository/Dependency Error |  |  |  |  | O |  |
| Log Message | Operation successful | O |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Business rule rejected |  |  | O |  |  |  |
| Log Message | Authorization denied |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  | O |  |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | Additional Branch |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `removeGroup`

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
| Input (req.body) | Input: id (param): Existing Group ID |  |  |  | O | O |
| Input (req.body) | Input: id (param): Non Existing Group ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  | O |  |  |
| Repository | groupsRepository.findById: Group Found | O | O |  |  |  |
| Repository | groupsRepository.findById: Group Not Found |  |  | O |  | O |
| Repository | groupsRepository.softDelete: Success | O | O |  |  |  |
| Repository | groupsRepository.softDelete: Query Error |  |  |  |  | O |
| Security | Authorization: group.createdBy === userId |  |  | O |  |  |
| Security | Authorization: isAdmin === true | O | O |  |  |  |
| Security | Authorization: Neither creator nor admin → forbidden |  |  |  | O |  |
| Business Rule | Soft Delete: sets deletedAt via softDelete | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Group deleted (null data) | O |  |  |  |  |
| Return Body | Group not found |  |  | O |  |  |
| Return Body | Forbidden |  |  |  | O |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `requestJoin`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-----------|---------------|---|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |  |
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
| Input (req.body) | Input: groupId (param): Existing Group ID |  |  |  | O | O | O | O |
| Input (req.body) | Input: groupId (param): Non Existing Group ID |  |  |  |  |  |  |  |
| Input (req.body) | Input: groupId (param): Invalid UUID |  |  | O |  |  |  |  |
| Repository | groupsRepository.findById: Group Found | O | O |  |  |  | O | O |
| Repository | groupsRepository.findById: Group Not Found |  |  | O | O |  |  |  |
| Repository | groupsRepository.findById: Query Error |  |  |  |  | O |  |  |
| Repository | groupsRepository.isMember: Not Member | O |  |  |  |  |  |  |
| Repository | groupsRepository.isMember: Already Member |  |  |  | O |  | O | O |
| Repository | groupsRepository.findJoinRequest: No Pending Request |  |  |  | O |  | O | O |
| Repository | groupsRepository.findJoinRequest: Pending Request Exists |  |  |  |  |  |  |  |
| Repository | groupsRepository.createJoinRequest: Success | O | O |  |  | O |  |  |
| Security | authenticate middleware: PASS | O | O |  |  |  |  |  |
| Security | authenticate middleware: FAIL |  |  |  | O |  |  |  |
| Security | Role Validation: MEMBER | O | O |  |  |  |  |  |
| Business Rule | Group Status: ACTIVE | O | O |  |  |  |  |  |
| Business Rule | Group Status: ARCHIVED |  |  |  | O |  | O | O |
| Business Rule | Group Status: DELETED |  |  |  |  |  |  |  |
| Business Rule | Join Request: Already Member | O | O |  | O |  | O | O |
| Business Rule | Join Request: Pending Request Exists |  |  |  |  | O |  |  |
| Business Rule | Join Request: Group Full |  |  |  |  |  |  |  |
| Business Rule | Join Request: Group Not Accepting Members |  |  |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |  |  |
| Return Status | 401 |  |  |  | O |  |  |  |
| Return Status | 404 |  |  |  |  |  |  |  |
| Return Status | 409 |  |  |  |  |  | O | O |
| Return Status | 500 |  |  |  |  | O |  |  |
| Return Body | Join request created | O |  |  |  |  |  |  |
| Return Body | Validation error |  | O |  |  |  |  |  |
| Return Body | Group not found / not accepting / full |  |  | O |  |  |  |  |
| Return Body | Already a member |  |  |  |  |  | O |  |
| Return Body | Join request already pending |  |  |  |  |  |  | O |
| Exception | None | O |  |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |  |
| Exception | ApiError.badRequest (Full/Not accepting) |  |  |  |  |  |  |  |
| Exception | ApiError.conflict |  |  |  |  |  | O | O |
| Exception | ApiError.unauthorized |  |  |  | O |  |  |  |
| Log Message | Join request submitted | O |  |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |  |
| Log Message | Business rule rejected |  |  | O |  |  | O | O |
| — Result — |  |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | Already Member | Pending Request Exists |
| Pass/Fail |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |

---

### Function Code: `setGroupStatus`

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
| Input (req.body) | Input: id (param): Existing Group ID |  |  |  | O | O |
| Input (req.body) | Input: id (param): Invalid UUID |  |  | O |  |  |
| Input (req.body) | Input: status (body): ACTIVE | O |  |  |  |  |
| Input (req.body) | Input: status (body): ARCHIVED |  | O |  |  |  |
| Input (req.body) | Input: status (body): Invalid Status |  |  |  | O |  |
| Repository | groupsRepository.findById: Group Found | O | O |  |  |  |
| Repository | groupsRepository.findById: Group Not Found |  |  | O |  | O |
| Repository | groupsRepository.update: Success | O | O |  |  |  |
| Repository | notificationsService.notifyUsers: Success | O | O |  |  |  |
| Repository | groupsRepository.update: Query Error |  |  |  |  | O |
| Security | authorize(ADMIN): PASS | O | O |  |  |  |
| Security | authorize(ADMIN): FAIL |  |  |  | O |  |
| Security | service isAdmin check: FALSE → forbidden |  |  |  | O |  |
| Business Rule | Status Change: ARCHIVED → notify "Group banned" |  | O |  |  |  |
| Business Rule | Status Change: ACTIVE → notify "Group restored" | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Updated group status | O |  |  |  |  |
| Return Body | Group not found |  |  | O |  |  |
| Return Body | Forbidden |  |  |  | O |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `updateGroup`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: id (param): Existing Group ID |  |  |  | O | O |
| Input (req.body) | Input: id (param): Invalid UUID |  | O |  |  |  |
| Input (req.body) | Input: name (body): optional valid 3-100 | O | O |  | O | O |
| Input (req.body) | Input: subject (body): optional non-empty |  | O |  |  |  |
| Input (req.body) | Input: maxMembers (body): optional int 2-100 | O |  |  |  |  |
| Input (req.body) | Input: status (body): ACTIVE / ARCHIVED (optional) | O |  |  |  |  |
| Repository | groupsRepository.isMember: LEADER | O |  |  |  |  |
| Repository | groupsRepository.isMember: Not Member / MEMBER role |  | O |  |  |  |
| Repository | groupsRepository.update: Success | O | O |  |  |  |
| Repository | groupsRepository.update: Query Error |  |  |  |  | O |
| Security | Role Validation: LEADER required | O | O |  |  |  |
| Security | Role Validation: MEMBER → forbidden |  |  |  | O |  |
| Business Rule | Update Rule: Only group leaders can update | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Updated group | O |  |  |  |  |
| Return Body | Only group leaders can update |  |  |  | O |  |
| Return Body | Validation error |  | O |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Sessions

### Function Code: `createSession`

**Service:** Study Session Service

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
| Input (req.body) | Input: groupId (body): valid UUID | O | O | O | O | O |
| Input (req.body) | Input: groupId (body): invalid / missing |  |  |  |  |  |
| Input (req.body) | Input: title (body): valid 3-150 chars | O | O | O | O | O |
| Input (req.body) | Input: title (body): invalid length |  |  |  |  |  |
| Input (req.body) | Input: startNow (body): true → IN_PROGRESS immediately | O | O | O |  |  |
| Input (req.body) | Input: startNow (body): false / absent → SCHEDULED |  |  |  | O |  |
| Input (req.body) | Input: startTime (body): required when !startNow (ISO8601) | O |  |  |  |  |
| Input (req.body) | Input: endTime (body): required when !startNow (ISO8601) | O |  |  |  |  |
| Input (req.body) | Input: endTime (body): missing when scheduled → badRequest |  |  | O |  |  |
| Input (req.body) | Input: notifyMembers (body): true → call notifyMembers | O | O | O |  |  |
| Input (req.body) | Input: meetingLink (body): optional valid URL | O | O | O | O | O |
| Repository | groupsRepository.isMember: Member | O |  |  |  |  |
| Repository | groupsRepository.isMember: Not Member |  | O |  |  |  |
| Repository | sessionsRepository.create: Success | O | O | O |  |  |
| Repository | sessionsRepository.create: Query Error |  |  |  |  | O |
| Security | Membership: Must be group member | O | O | O |  |  |
| Business Rule | Session Type: startNow → status IN_PROGRESS, endTime null | O | O | O |  |  |
| Business Rule | Session Type: scheduled → status SCHEDULED, endTime required |  |  |  |  |  |
| Business Rule | Notification: notifyMembers flag triggers notifyMembers | O | O | O |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Created session | O |  |  |  |  |
| Return Body | End time is required for scheduled sessions |  |  | O |  |  |
| Return Body | Must be a group member |  |  |  | O |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `endSession`

**Service:** Study Session Service

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
| Input (req.body) | Input: id (param): Existing Session ID |  |  |  | O | O |  |
| Input (req.body) | Input: id (param): Non Existing Session ID |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  | O |  |  |  |
| Repository | sessionsRepository.findById: Session Found | O | O |  |  | O | O |
| Repository | sessionsRepository.findById: Session Not Found |  |  | O |  |  |  |
| Repository | sessionsRepository.update: Success | O | O |  |  | O | O |
| Security | assertCanManageSession: Session Creator |  |  |  |  | O |  |
| Security | assertCanManageSession: Group LEADER | O | O |  |  |  | O |
| Security | assertCanManageSession: Forbidden (other member) |  |  |  | O |  |  |
| Business Rule | Session Status: IN_PROGRESS → COMPLETED + deleteLiveKitRoom | O | O |  |  | O | O |
| Business Rule | Session Status: SCHEDULED → CANCELLED |  |  |  |  |  |  |
| Business Rule | Session Status: COMPLETED (already ended) |  |  | O |  |  |  |
| Business Rule | Session Status: CANCELLED (already ended) |  |  |  | O |  |  |
| Business Rule | LiveKit Service: deleteLiveKitRoom Success | O | O |  |  |  | O |
| Business Rule | LiveKit Service: deleteLiveKitRoom Fail |  |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  | O |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | Updated session (COMPLETED/CANCELLED) | O |  |  |  |  | O |
| Return Body | Session is already ended |  |  | O |  |  |  |
| Return Body | Session not found |  |  |  |  |  |  |
| Return Body | Forbidden |  |  |  | O |  |  |
| Exception | None | O |  |  |  |  | O |
| Exception | ApiError.badRequest (already ended) |  |  | O |  |  |  |
| Exception | ApiError.notFound |  |  |  |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | LiveKit deleteLiveKitRoom Error |  |  |  |  | O |  |
| Log Message | Session ended | O |  |  |  |  | O |
| Log Message | Session already ended |  |  | O |  |  |  |
| Log Message | LiveKit room deleted |  |  |  |  |  |  |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path - End Live Session | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | Cancel Scheduled Session |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `getLiveKitToken`

**Service:** Study Session Service

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
| Input (req.body) | Input: id (param): Existing Session ID |  |  |  | O | O |
| Input (req.body) | Input: id (param): Non Existing Session ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  | O |  |  |
| Repository | sessionsRepository.findById: Session Found | O | O |  | O |  |
| Repository | sessionsRepository.findById: Session Not Found |  |  | O |  |  |
| Repository | groupsRepository.isMember: Member | O |  |  |  |  |
| Repository | groupsRepository.isMember: Not Member |  | O |  |  |  |
| Security | authenticate middleware: PASS | O | O |  |  |  |
| Security | authenticate middleware: FAIL |  |  |  |  | O |
| Business Rule | Session Status: IN_PROGRESS | O | O |  |  |  |
| Business Rule | Session Status: SCHEDULED / COMPLETED / CANCELLED |  |  |  |  |  |
| Business Rule | LiveKit Service: Configured | O |  |  |  |  |
| Business Rule | LiveKit Service: Not Configured |  | O |  |  |  |
| Business Rule | LiveKit Service: createLiveKitToken Success |  |  |  |  |  |
| Business Rule | LiveKit Service: createLiveKitToken Fail |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { token, serverUrl, roomName } | O |  |  |  |  |
| Return Body | Session is not in progress |  |  | O |  |  |
| Return Body | Must be a group member |  |  |  | O |  |
| Return Body | LiveKit is not configured |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest |  | O | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | ApiError.notFound |  |  |  |  |  |
| Exception | ApiError.internal (LiveKit) |  |  |  |  | O |
| Log Message | LiveKit token issued | O |  |  |  |  |
| Log Message | Session not in progress |  |  | O |  |  |
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `getSessionById`

**Service:** Study Session Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O | O |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O | O |  |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O | O |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O | O |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O | O |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: id (param): Existing Session ID |  |  |  |  | O |
| Input (req.body) | Input: id (param): Non Existing Session ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  | O |  |  |
| Repository | sessionsRepository.findById: Session Found | O | O |  |  |  |
| Repository | sessionsRepository.findById: Session Not Found |  |  | O |  |  |
| Repository | sessionsRepository.findById: Query Error |  |  |  |  | O |
| Security | Authentication: Optional | O | O |  |  |  |
| Business Rule | Lookup: if !session → notFound | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Session details | O |  |  |  |  |
| Return Body | Session not found |  |  | O |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `listSessions`

**Service:** Study Session Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: page/limit (query): valid pagination | O | O |  |  | O |
| Input (req.body) | Input: page/limit (query): invalid (defaults) |  |  | O |  |  |
| Input (req.body) | Input: groupId (query): valid UUID / absent | O |  |  |  |  |
| Input (req.body) | Input: groupId (query): invalid UUID |  | O |  |  |  |
| Input (req.body) | Input: status (query): SCHEDULED / IN_PROGRESS / COMPLETED / CANCELLED | O |  |  |  |  |
| Input (req.body) | Input: upcoming (query): true → startTime >= now + SCHEDULED | O | O |  |  |  |
| Input (req.body) | Input: mySessions (query): true + userId → member filter | O | O |  |  |  |
| Repository | sessionsRepository.findMany: Success (deletedAt: null) |  | O |  |  |  |
| Repository | sessionsRepository.findMany: Query Error |  |  |  |  | O |
| Repository | sessionsRepository.count: Success | O | O |  |  |  |
| Security | Authentication: Optional (public route) | O | O |  |  |  |
| Business Rule | Filter: groupId → where.groupId |  | O |  |  |  |
| Business Rule | Filter: status → where.status |  |  |  |  |  |
| Business Rule | Filter: upcoming=true → startTime gte now + status SCHEDULED | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Paginated sessions | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `notifyMembers`

**Service:** Study Session Service

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
| Input (req.body) | Input: id (param): Existing Session ID / Invalid UUID |  |  | O |  |  |
| Repository | sessionsRepository.findById: Found / Not Found |  |  | O |  | O |
| Repository | groupsRepository.getMemberUserIds: Member IDs list | O |  |  |  |  |
| Repository | notificationsService.notifyUsers: Success / Query Error |  |  |  |  | O |
| Security | assertCanManageSession: Creator or LEADER | O | O |  |  |  |
| Security | assertCanManageSession: Forbidden |  |  |  | O |  |
| Business Rule | Notification: Recipients = all members except sender | O | O |  |  |  |
| Business Rule | Notification: Title/message/link from session |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { notified: count } | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `removeSession`

**Service:** Study Session Service

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
| Input (req.body) | Input: id (param): Existing Session ID / Invalid UUID |  |  | O |  |  |
| Repository | sessionsRepository.findById: Found / Not Found |  |  | O |  | O |
| Repository | sessionsRepository.softDelete: Success / Query Error |  |  |  |  | O |
| Security | Authorization: session.createdBy === userId | O |  |  |  |  |
| Security | Authorization: Other user → forbidden |  |  |  | O |  |
| Business Rule | LiveKit Service: deleteLiveKitRoom before softDelete | O | O |  | O |  |
| Business Rule | LiveKit Service: deleteLiveKitRoom Fail |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Session removed | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `updateSession`

**Service:** Study Session Service

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
| Input (req.body) | Input: id (param): Existing Session ID / Invalid UUID |  |  | O |  |  |
| Input (req.body) | Input: title (body): optional 3-150 | O |  |  |  |  |
| Input (req.body) | Input: startTime/endTime (body): optional ISO8601 | O |  |  |  |  |
| Input (req.body) | Input: meetingLink (body): optional URL | O |  |  |  |  |
| Input (req.body) | Input: status (body): SCHEDULED / IN_PROGRESS / COMPLETED / CANCELLED | O |  |  |  |  |
| Repository | sessionsRepository.findById: Found / Not Found |  |  | O |  | O |
| Repository | sessionsRepository.update: Success / Query Error |  |  |  |  | O |
| Repository | groupsRepository.isMember: LEADER (via assertCanManageSession) | O |  |  |  |  |
| Security | assertCanManageSession: Session creator |  |  | O |  |  |
| Security | assertCanManageSession: Group LEADER | O | O |  |  |  |
| Security | assertCanManageSession: Other member → forbidden |  |  |  | O |  |
| Business Rule | Manage Rule: Creator or group LEADER may update | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Updated session | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Attendance

### Function Code: `listAttendance`

**Service:** Attendance Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: sessionId (param): valid UUID / invalid UUID |  | O |  |  |  |
| Repository | attendanceRepository.findBySession: Returns array (possibly empty) |  | O |  |  |  |
| Repository | attendanceRepository.findBySession: Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS / FAIL |  |  |  | O |  |
| Business Rule | Note: No session-existence check in service | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Attendance array | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `markAttendance`

**Service:** Attendance Service

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
| Input (req.body) | Input: sessionId (param): Existing Session ID / Invalid UUID |  |  | O |  |  |
| Input (req.body) | Input: userId (body): optional UUID (defaults to req.user.id) |  |  |  | O |  |
| Input (req.body) | Input: status (body): PRESENT / ABSENT / LATE / EXCUSED / invalid |  | O |  |  |  |
| Repository | sessionsRepository.findById: Session Found / Not Found |  |  | O |  | O |
| Repository | attendanceRepository.upsert: Success / Query Error |  |  |  |  | O |
| Security | Self Mark: markerId === targetUserId | O |  |  |  |  |
| Security | Creator Marks Other: session.createdBy === markerId |  |  |  | O |  |
| Security | Forbidden: Non-creator marking others |  |  |  | O |  |
| Business Rule | Upsert: Sets status + checkedAt = new Date() | O | O |  | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Attendance record | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `recordJoin`

**Service:** Attendance Service

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
| Input (req.body) | Input: sessionId (param): Existing Session ID / Invalid UUID |  |  | O | O |  |
| Repository | sessionsRepository.findById: Found / Not Found |  |  | O | O |  |
| Repository | groupsRepository.isMember: Member / Not Member |  |  |  |  | O |
| Repository | attendanceRepository.upsert: PRESENT status / Query Error |  |  |  |  | O |
| Security | Membership: Must be group member | O | O |  |  | O |
| Business Rule | Session Status: Must be IN_PROGRESS | O | O |  |  |  |
| Business Rule | Auto Mark: status PRESENT on join | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | PRESENT attendance record | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Resource Folders

### Function Code: `createResourceFolder`

**Service:** Resource Folder Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: groupId (body): valid UUID | O | O |  | O | O |
| Input (req.body) | Input: name (body): valid 1-100 / invalid |  |  |  | O |  |
| Input (req.body) | Input: description (body): optional max 500 | O |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member | O |  |  |  |  |
| Repository | resourceFoldersRepository.create: Success / Query Error |  |  |  |  | O |
| Security | Membership: Required | O | O |  |  |  |
| Business Rule | Create: createdBy = userId, description trimmed or null | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Created folder | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `getResourceFolderById`

**Service:** Resource Folder Service

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
| Input (req.body) | Input: id (param): Existing Folder ID / Invalid UUID |  |  | O |  |  |
| Repository | resourceFoldersRepository.findById: Found / Not Found / Query Error |  |  | O |  | O |
| Repository | groupsRepository.isMember: Member / Not Member | O |  |  |  |  |
| Security | Membership: Required | O | O |  |  |  |
| Business Rule | Lookup: deletedAt: null filter | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Folder details | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `listResourceFolders`

**Service:** Resource Folder Service

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
| Input (req.body) | Input: myGroups (query): true | O |  | O | O |  |
| Input (req.body) | Input: groupId (query): valid UUID | O | O | O | O | O |
| Input (req.body) | Input: page/limit (query): valid / invalid |  |  |  |  | O |
| Input (req.body) | Input: filter: neither groupId nor myGroups |  | O |  |  |  |
| Repository | resourceFoldersRepository.findMany: Success / Query Error |  |  |  |  | O |
| Repository | groupsRepository.isMember: Member / Not Member (when groupId) |  | O |  |  |  |
| Security | Membership: Required when groupId provided | O | O | O | O |  |
| Business Rule | Filter: myGroups=true → user group membership filter | O |  |  | O |  |
| Business Rule | Filter: else groupId required or badRequest |  | O | O |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Paginated folders | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `updateResourceFolder`

**Service:** Resource Folder Service

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
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  | O | O |  |
| Input (req.body) | Input: name (body): optional 1-100 | O | O |  |  |  |
| Input (req.body) | Input: description (body): optional max 500 | O |  |  |  |  |
| Repository | resourceFoldersRepository.findById: Found / Not Found |  |  | O |  | O |
| Repository | groupsRepository.isMember: Member / Not Member | O |  |  |  |  |
| Repository | groupsRepository.findById: Group for leader check | O |  |  |  |  |
| Repository | resourceFoldersRepository.update: Success / Query Error |  |  |  |  | O |
| Security | Membership: Required | O | O |  |  |  |
| Security | Leader Check: group.createdBy === userId OR role LEADER | O | O |  |  |  |
| Security | Forbidden: Member but not leader |  |  |  | O |  |
| Business Rule | Edit Rule: Only group leaders can edit folders | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Updated folder | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Resources

### Function Code: `createResource`

**Service:** Resource Management Service

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
| Input (req.body) | Input: groupId (body): valid UUID | O | O | O | O | O |
| Input (req.body) | Input: folderId (body): valid UUID | O | O | O | O | O |
| Input (req.body) | Input: title (body): valid 2-150 chars | O | O | O | O | O |
| Input (req.body) | Input: fileUrl (body): valid URL | O | O | O | O | O |
| Input (req.body) | Input: fileType (body): non-empty string |  | O |  |  |  |
| Input (req.body) | Input: description (body): optional string | O | O |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member | O |  |  |  |  |
| Repository | resourceFoldersRepository.findById: Found matching group / Mismatch / Not Found |  |  | O |  | O |
| Repository | resourcesRepository.create: Success / Query Error |  |  | O |  | O |
| Security | Membership: assertMember(data.groupId) | O | O |  |  |  |
| Business Rule | Folder Validation: folder.groupId === data.groupId | O | O |  |  |  |
| Business Rule | Folder Validation: Mismatch → badRequest Invalid folder for this group |  |  | O |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Created resource | O |  |  |  |  |
| Return Body | Invalid folder for this group |  |  | O |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `getResourceById`

**Service:** Resource Management Service

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
| Input (req.body) | Input: id (param): Existing Resource ID |  |  |  | O | O |
| Input (req.body) | Input: id (param): Invalid UUID |  |  | O |  |  |
| Repository | resourcesRepository.findById: Found / Not Found / Query Error |  |  | O |  | O |
| Repository | groupsRepository.isMember: Member / Not Member | O |  |  |  |  |
| Security | Membership: assertMember(resource.groupId) | O | O |  |  |  |
| Business Rule | Lookup: deletedAt: null filter in repository | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Resource with star count | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `listResources`

**Service:** Resource Management Service

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
| Input (req.body) | Input: page/limit (query): valid / invalid (defaults) |  | O |  |  |  |
| Input (req.body) | Input: groupId (query): valid UUID / absent |  |  | O | O |  |
| Input (req.body) | Input: folderId (query): valid UUID / absent |  |  | O |  |  |
| Input (req.body) | Input: myGroups (query): true → filter user groups | O | O |  | O |  |
| Repository | resourcesRepository.findMany: Success | O | O |  |  |  |
| Repository | resourcesRepository.count: Success | O | O |  |  |  |
| Repository | resourceFoldersRepository.findById: Found / Not Found (when folderId) |  |  | O |  | O |
| Repository | groupsRepository.isMember: Member / Not Member |  |  |  | O |  |
| Security | Membership: Required when groupId or folderId set | O | O |  | O |  |
| Business Rule | Filter: folderId → lookup folder + assertMember(folder.groupId) | O | O |  | O |  |
| Business Rule | Filter: groupId → assertMember(groupId) |  |  |  |  |  |
| Business Rule | Filter: No filter → no membership gate |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Paginated resources | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `removeResource`

**Service:** Resource Management Service

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
| Input (req.body) | Input: id (param): Existing Resource ID / Invalid UUID |  |  | O |  |  |
| Repository | resourcesRepository.findById: Found / Not Found |  |  | O |  | O |
| Repository | resourcesRepository.softDelete: Success / Query Error |  |  |  |  | O |
| Repository | notificationsService.notifyUsers: Called when leader deletes uploader resource | O |  |  |  |  |
| Security | Authorization: uploadedBy === userId | O |  |  |  |  |
| Security | Authorization: Group leader (not uploader) |  |  |  | O |  |
| Security | Authorization: Other member → forbidden |  | O |  |  |  |
| Business Rule | Notification: Leader delete → notify uploader | O | O |  | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Resource removed | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `toggleStarResource`

**Service:** Resource Management Service

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
| Input (req.body) | Input: id (param): Existing Resource ID / Invalid UUID |  |  | O |  |  |
| Repository | resourcesRepository.findById: Found / Not Found |  |  | O |  | O |
| Repository | resourcesRepository.findRating: Existing / None | O |  |  |  |  |
| Repository | resourcesRepository.createRating: Success | O | O |  |  |  |
| Repository | resourcesRepository.deleteRating: Success | O | O |  |  |  |
| Repository | resourcesRepository.createRating: Query Error |  |  |  |  | O |
| Security | Membership: assertMember required | O | O |  |  |  |
| Business Rule | Star Toggle: No existing rating → createRating → starred: true | O | O |  |  |  |
| Business Rule | Star Toggle: Existing rating → deleteRating → starred: false |  |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { starred: true } | O |  |  |  |  |
| Return Body | { starred: false } (toggle off) |  |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Posts

### Function Code: `createPost`

**Service:** Discussion Post Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: groupId (body): valid UUID | O | O |  | O | O |
| Input (req.body) | Input: title (body): valid 3-200 / invalid |  |  |  | O |  |
| Input (req.body) | Input: content (body): non-empty / missing |  | O |  |  |  |
| Input (req.body) | Input: attachments (body): optional array max 10 with fileUrl/fileName/fileType | O |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member | O |  |  |  |  |
| Repository | postsRepository.create: Success / Query Error |  |  |  |  | O |
| Security | Membership: Must be group member | O | O |  |  |  |
| Business Rule | Create: authorId = userId, attachments default [] | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Created post | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `getPostById`

**Service:** Discussion Post Service

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
| Input (req.body) | Input: id (param): Existing Post ID / Invalid UUID |  |  | O |  |  |
| Repository | postsRepository.findById: Found / Not Found / Query Error |  |  | O |  | O |
| Security | authenticate middleware: PASS / FAIL |  |  |  | O |  |
| Business Rule | Map: attachVoteMeta + commentCount + isEdited | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Post with votes | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `listPosts`

**Service:** Discussion Post Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: page/limit (query): valid / default | O | O |  | O | O |
| Input (req.body) | Input: groupId (query): optional UUID / invalid |  |  |  | O |  |
| Input (req.body) | Input: myGroups (query): true / false | O | O |  |  |  |
| Input (req.body) | Input: sortBy (query): createdAt / votes / invalid |  |  |  | O |  |
| Input (req.body) | Input: sortOrder (query): asc / desc | O |  |  |  |  |
| Repository | postsRepository.findMany: Success (createdAt sort) | O | O |  |  |  |
| Repository | postsRepository.findManyForVoteSort: Success (votes sort, up to 500) | O | O |  |  |  |
| Repository | postsRepository.count: Success / Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS / FAIL |  |  |  | O |  |
| Business Rule | Sort: sortBy votes → fetch 500, sortByVoteScore, slice | O | O |  |  |  |
| Business Rule | Filter: myGroups=true → member filter | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Paginated posts with vote meta | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `removePost`

**Service:** Discussion Post Service

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
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  | O |  |  |
| Repository | postsRepository.findById: Found / Not Found |  |  | O |  | O |
| Repository | postsRepository.softDelete: Success / Query Error |  |  |  |  | O |
| Security | Author Only: post.authorId === userId |  |  |  | O |  |
| Business Rule | Delete: Author only (no leader/admin branch in code) | O | O |  | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Post removed | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `updatePost`

**Service:** Discussion Post Service

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
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  |  | O | O |
| Input (req.body) | Input: title (body): optional 3-200 | O |  |  |  |  |
| Input (req.body) | Input: content (body): optional non-empty |  | O |  |  |  |
| Repository | postsRepository.findById: Found / Not Found |  |  |  | O |  |
| Repository | postsRepository.update: Success / Query Error |  |  | O |  |  |
| Repository | groupsRepository.isMember: Member / Not Member | O |  |  |  |  |
| Security | Author Check: post.authorId === userId | O |  |  |  |  |
| Security | Membership: Required after author check | O | O |  |  |  |
| Business Rule | Validation: !title && !content → badRequest Nothing to update | O | O | O |  |  |
| Business Rule | Update: sets editedAt = new Date() | O | O | O |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Updated post | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `votePost`

**Service:** Discussion Post Service

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
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  | O | O |  |  |
| Input (req.body) | Input: value (body): 1 (upvote) / -1 (downvote) / invalid |  |  |  | O |  |  |
| Repository | postsRepository.findById: Found / Not Found |  |  | O |  | O |  |
| Repository | postsRepository.removeVote: When same value clicked | O |  |  |  |  |  |
| Repository | postsRepository.upsertVote: New or changed vote | O |  |  |  |  |  |
| Security | Membership: Must be group member | O | O |  |  |  | O |
| Business Rule | Toggle: existing?.value === value → removeVote, userVote null | O | O |  |  |  | O |
| Business Rule | Toggle: else upsertVote, userVote = value |  |  |  |  |  |  |
| Business Rule | Guard: value not in [1,-1] → badRequest (service + validation) | O | O |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | { voteScore, userVote } | O |  |  |  |  | O |
| Exception | None | O |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | Repository/Dependency Error |  |  |  |  | O |  |
| Log Message | Operation successful | O |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Business rule rejected |  |  | O |  |  |  |
| Log Message | Authorization denied |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  | O |  |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | Additional Branch |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---


## Module: Comments

### Function Code: `createComment`

**Service:** Comment Service

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
| Input (req.body) | Input: postId (body): valid UUID | O | O | O |  | O |
| Input (req.body) | Input: content (body): valid 1-2000 / invalid |  |  |  | O | O |
| Input (req.body) | Input: parentCommentId (body): optional UUID | O |  |  |  |  |
| Input (req.body) | Input: mentionedUserIds (body): optional UUID array | O |  |  |  |  |
| Repository | postsRepository.findById: Found / Not Found |  |  | O |  |  |
| Repository | commentsRepository.findById (parent): Valid parent / Invalid / wrong postId |  | O |  |  |  |
| Repository | commentsRepository.create: Success / Query Error |  |  |  |  | O |
| Repository | groupsRepository.getMemberUserIds: For mention validation |  | O |  |  |  |
| Security | Membership: assertGroupMember required | O | O |  |  |  |
| Business Rule | Parent: parent must exist AND parent.postId === postId | O | O |  |  |  |
| Business Rule | Mentions: Filtered to group members excluding author | O | O |  |  |  |
| Business Rule | Notifications: Reply + mention notifications | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Created comment | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `listCommentsByPost`

**Service:** Comment Service

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
| Input (req.body) | Input: postId (param): valid UUID / invalid |  |  | O | O |  |
| Input (req.body) | Input: sort (query): newest / votes / invalid |  |  |  | O |  |
| Repository | postsRepository.findById: Found / Not Found |  |  | O |  | O |
| Repository | commentsRepository.findAllByPostId: Flat list / Query Error |  |  |  |  | O |
| Security | Membership: assertGroupMember required | O | O |  |  |  |
| Business Rule | buildCommentTree from flat comments | O | O |  |  |  |
| Business Rule | Sort: votes → sortByVoteScore desc, else createdAt desc | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Comment tree array | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `removeComment`

**Service:** Comment Service

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
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  | O |  |  |
| Repository | commentsRepository.findById: Found / Not Found |  |  | O |  | O |
| Repository | commentsRepository.softDelete: Success / Query Error |  |  |  |  | O |
| Security | Author Only: comment.authorId === userId |  |  |  | O |  |
| Business Rule | Delete: Author only | O | O |  | O |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Comment removed | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `updateComment`

**Service:** Comment Service

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
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  | O |  |  |
| Input (req.body) | Input: content (body): valid 1-2000 / invalid |  | O |  |  |  |
| Repository | commentsRepository.findById: Found / Not Found |  |  | O |  | O |
| Repository | commentsRepository.update: Success / Query Error |  |  |  |  | O |
| Security | Author: comment.authorId === userId |  |  |  | O |  |
| Security | Membership: assertGroupMember required | O | O |  |  |  |
| Business Rule | Update: sets editedAt = new Date() | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Updated comment | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `voteComment`

**Service:** Comment Service

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
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  | O | O |  |  |
| Input (req.body) | Input: value (body): 1 / -1 / invalid |  |  |  | O |  |  |
| Repository | commentsRepository.findById: Found / Not Found |  |  | O |  | O |  |
| Repository | commentsRepository.findByIdDetailed: For existing vote | O |  |  |  |  |  |
| Repository | commentsRepository.removeVote / upsertVote: Toggle logic | O |  |  |  |  |  |
| Security | Membership: assertGroupMember required | O | O |  |  |  | O |
| Business Rule | Toggle: existingVote === value → remove, else upsert | O | O |  |  |  | O |
| Business Rule | Guard: value not in [1,-1] → badRequest | O | O |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | { voteScore, userVote } | O |  |  |  |  | O |
| Exception | None | O |  |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | Repository/Dependency Error |  |  |  |  | O |  |
| Log Message | Operation successful | O |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Business rule rejected |  |  | O |  |  |  |
| Log Message | Authorization denied |  |  |  | O |  |  |
| Log Message | Unhandled exception |  |  |  |  | O |  |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | Additional Branch |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---


## Module: Notifications

### Function Code: `getUnreadCount`

**Service:** Notification Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O |  |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O |  |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O |  |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O |  |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O |  |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Repository | notificationsRepository.count: isRead: false / Query Error |  |  |  |  | O |
| Security | Scoped to req.user.id | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { count: number } | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `listNotifications`

**Service:** Notification Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: page/limit (query): valid / default | O |  |  | O | O |
| Input (req.body) | Input: unread (query): true → isRead false filter / absent | O |  |  |  |  |
| Repository | notificationsRepository.findMany: Scoped to userId / Query Error |  |  |  |  | O |
| Repository | notificationsRepository.count: Scoped to userId | O |  |  |  |  |
| Security | Scope: All queries scoped to req.user.id | O |  |  |  |  |
| Business Rule | Filter: query.unread === true → where.isRead = false | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Paginated notifications | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `markAllNotificationsRead`

**Service:** Notification Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O |  |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O |  |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O |  |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O |  |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O |  |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Repository | notificationsRepository.markAllRead: updateMany userId + isRead false | O |  |  |  |  |
| Repository | notificationsRepository.markAllRead: Query Error |  |  |  |  | O |
| Security | Scoped to req.user.id | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | All marked read | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `markNotificationRead`

**Service:** Notification Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  |  | O |  |
| Repository | notificationsRepository.markRead: updateMany where id + userId | O |  |  |  |  |
| Repository | notificationsRepository.markRead: Zero rows updated (no error) |  |  |  |  |  |
| Repository | notificationsRepository.markRead: Query Error |  |  |  |  | O |
| Security | Scope: updateMany scoped to matching userId | O |  |  |  |  |
| Business Rule | Note: No error if notification not found for user | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Marked read (success even if 0 rows) | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Dashboard

### Function Code: `getGroupStats`

**Service:** Dashboard & Analytics Service

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
| Input (req.body) | Input: groupId (param): valid UUID / invalid / non-existent |  |  | O | O |  |
| Repository | prisma.studyGroup.findFirst: Group Found / Not Found |  |  | O |  | O |
| Repository | prisma.studySession.groupBy: Session stats by status | O |  |  |  |  |
| Repository | prisma.groupMember.findMany: Member growth data | O |  |  |  |  |
| Repository | prisma: Query Error |  |  |  |  | O |
| Security | authorize(ADMIN) route: PASS / FAIL |  |  |  | O |  |
| Security | service check: user.roles includes ADMIN | O | O |  |  |  |
| Business Rule | Charts: sessionStats + memberGrowth cumulative | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { charts: sessionStats, memberGrowth } | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `getStats`

**Service:** Dashboard & Analytics Service

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
| Repository | prisma (MEMBER path): groupMember, sessions, resources, attendance aggregates | O |  |  |  |  |
| Repository | prisma (LEADER path): leader groups + session/member stats | O |  |  |  |  |
| Repository | prisma (ADMIN path): platform-wide user/group aggregates |  |  | O |  |  |
| Repository | prisma: Query Error |  |  |  |  | O |
| Security | Role Branch: ADMIN → getAdminStats | O |  | O |  |  |
| Security | Role Branch: LEADER → getLeaderStats |  |  |  |  |  |
| Security | Role Branch: MEMBER → getStudentStats |  |  |  |  |  |
| Business Rule | Response: role field: MEMBER / LEADER / ADMIN | O |  | O |  |  |
| Business Rule | Charts: Role-specific chart data included | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O | O | O |  |  |
| Return Status | 401 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | MEMBER stats payload | O |  |  |  |  |
| Return Body | LEADER stats payload |  | O |  |  |  |
| Return Body | ADMIN stats payload |  |  | O |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path - MEMBER | Happy Path - LEADER | Happy Path - ADMIN | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Upload

### Function Code: `getCloudinarySignature`

**Service:** File Upload Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O |  | O | O |  |
| Precondition | Can connect with server: DB Connection Fail |  | O |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  | O |
| Precondition | JWT Service OK | O |  | O | O | O |
| Precondition | JWT Service Fail |  | O |  |  |  |
| Precondition | bcrypt Service OK | O |  | O | O | O |
| Precondition | bcrypt Service Fail |  | O |  |  |  |
| Precondition | Cloudinary Service OK | O |  | O | O | O |
| Precondition | Cloudinary Service Fail |  | O |  |  |  |
| Precondition | LiveKit Service OK | O |  | O | O | O |
| Precondition | LiveKit Service Fail |  | O |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  |  | O |  |
| Business Rule | Cloudinary Service: isCloudinaryConfigured = cloudName && apiKey && apiSecret | O |  | O |  |  |
| Business Rule | Cloudinary Service: Not Configured → serviceUnavailable |  |  |  |  |  |
| Business Rule | Cloudinary Service: getUploadSignature returns credentials + folder studyhub/resources |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 401 |  |  |  | O |  |
| Return Status | 503 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { cloudName, apiKey, timestamp, signature, folder } | O |  |  |  |  |
| Return Body | Cloudinary is not configured |  |  | O |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---


## Module: Reports

### Function Code: `createReport`

**Service:** Reports Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: reportedType (body): USER / GROUP / POST / COMMENT / RESOURCE / invalid |  | O |  | O |  |
| Input (req.body) | Input: reportedId (body): non-empty string / empty |  | O |  |  |  |
| Input (req.body) | Input: reason (body): valid 10-500 chars / too short | O |  |  | O | O |
| Repository | reportsRepository.create: Success with reporterId / Query Error |  |  |  |  | O |
| Security | authenticate middleware: PASS / FAIL |  |  |  | O |  |
| Business Rule | Create: reporterId = req.user.id | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |
| Return Status | 401 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Created report | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `listReports`

**Service:** Reports Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK | O | O |  | O |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  | O |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK | O | O |  | O |  |
| Precondition | JWT Service Fail |  |  |  |  | O |
| Precondition | bcrypt Service OK | O | O |  | O |  |
| Precondition | bcrypt Service Fail |  |  |  |  | O |
| Precondition | Cloudinary Service OK | O | O |  | O |  |
| Precondition | Cloudinary Service Fail |  |  |  |  | O |
| Precondition | LiveKit Service OK | O | O |  | O |  |
| Precondition | LiveKit Service Fail |  |  |  |  | O |
| Input (req.body) | Input: page/limit (query): valid / default | O | O |  | O | O |
| Input (req.body) | Input: status (query): optional filter PENDING/REVIEWED/RESOLVED/DISMISSED | O |  |  |  |  |
| Repository | reportsRepository.findMany: Success / Query Error |  |  |  |  | O |
| Repository | reportsRepository.count: Success | O |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  | O |  | O |  |
| Security | authorize(ADMIN): PASS / FAIL |  | O |  | O |  |
| Business Rule | Filter: query.status → where.status when present | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Paginated reports | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

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
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  | O | O |  |
| Input (req.body) | Input: status (body): PENDING / REVIEWED / RESOLVED / DISMISSED / invalid |  |  |  | O |  |
| Repository | reportsRepository.update: Report Found / Not Found (null) |  |  | O |  |  |
| Repository | reportsRepository.update: Query Error |  |  |  |  | O |
| Security | authorize(ADMIN): PASS / FAIL |  |  |  | O |  |
| Business Rule | Update: if !report from update → notFound | O | O |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  |  |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Updated report | O |  |  |  |  |
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
| — Result — |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

