# Excel Matrix Format

> Single merged decision matrix per function code.
> Generated from `Decision_Tables.md`.
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
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: email: valid@email.com |  |  |  |  |  |
| Input (req.body) | Input: email: duplicate@email.com (already registered) |  |  |  |  |  |
| Input (req.body) | Input: email: invalid-email |  |  |  |  |  |
| Input (req.body) | Input: email: null / missing |  |  |  |  |  |
| Input (req.body) | Input: email: empty string |  |  |  |  |  |
| Input (req.body) | Input: password: validPassword123 (8+ chars, uppercase, digit) |  |  |  |  |  |
| Input (req.body) | Input: password: invalid format (missing uppercase/digit/length) |  |  |  |  |  |
| Input (req.body) | Input: password: null / missing |  |  |  |  |  |
| Input (req.body) | Input: password: empty string |  |  |  |  |  |
| Input (req.body) | Input: fullName: valid name (2-100 chars) |  |  |  |  |  |
| Input (req.body) | Input: fullName: invalid length (<2 or >100) |  |  |  |  |  |
| Input (req.body) | Input: fullName: null / missing |  |  |  |  |  |
| Repository | authRepository.findByEmail: User Not Found |  |  |  |  |  |
| Repository | authRepository.findByEmail: Duplicate User |  |  |  |  |  |
| Repository | authRepository.findByEmail: Query Error |  |  |  |  |  |
| Repository | authRepository.findRoleByName(MEMBER): Role Found |  |  |  |  |  |
| Repository | authRepository.findRoleByName(MEMBER): Role Not Found |  |  |  |  |  |
| Repository | authRepository.createUser: Success |  |  |  |  |  |
| Repository | authRepository.createUser: Query Error |  |  |  |  |  |
| Repository | authRepository.createRefreshToken: Success |  |  |  |  |  |
| Repository | authRepository.createRefreshToken: Query Error |  |  |  |  |  |
| Security | bcrypt.hash: Success |  |  |  |  |  |
| Security | bcrypt.hash: Error |  |  |  |  |  |
| Security | jwt.sign (access): Success |  |  |  |  |  |
| Security | jwt.sign (access): Fail |  |  |  |  |  |
| Security | jwt.sign (refresh): Success |  |  |  |  |  |
| Security | jwt.sign (refresh): Fail |  |  |  |  |  |
| Business Rule | Email Registration: Email Available |  |  |  |  |  |
| Business Rule | Email Registration: Email Already Registered |  |  |  |  |  |
| Business Rule | Default Role: MEMBER Role Configured |  |  |  |  |  |
| Business Rule | Default Role: MEMBER Role Missing |  |  |  |  |  |
| Input (req.body) | All fields valid | O |  |  |  |  |
| Input (req.body) | Invalid email/password/fullName |  | O |  |  |  |
| Repository | findByEmail: Duplicate User |  |  | O |  |  |
| Repository | findRoleByName: Role Not Found |  |  | O |  |  |
| Repository | createUser/createRefreshToken: Query Error |  |  |  |  | O |
| Repository | findByEmail: User Not Found + Role Found | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 409 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { user, accessToken, refreshToken } | O |  |  |  |  |
| Return Body | Validation error details |  | O |  |  |  |
| Return Body | Email already registered |  |  | O |  |  |
| Return Body | Default role not configured |  |  | O |  |  |
| Return Body | Internal server error |  |  |  |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest (Validation) |  | O |  |  |  |
| Exception | ApiError.conflict (Email exists) |  |  | O |  |  |
| Exception | ApiError.badRequest (No role) |  |  | O |  |  |
| Exception | Prisma/bcrypt/jwt Error |  |  |  |  | O |
| Log Message | Registration successful | O |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |
| Log Message | Conflict: email exists |  |  | O |  |  |
| Log Message | Default role missing |  |  | O |  |  |
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
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |
| Input (req.body) | Input: email: valid@email.com |  |  |  |  |  |  |
| Input (req.body) | Input: email: nonexistent@email.com |  |  |  |  |  |  |
| Input (req.body) | Input: email: invalid-email |  |  |  |  |  |  |
| Input (req.body) | Input: email: null / missing |  |  |  |  |  |  |
| Input (req.body) | Input: password: validPassword123 |  |  |  |  |  |  |
| Input (req.body) | Input: password: wrongPassword |  |  |  |  |  |  |
| Input (req.body) | Input: password: null / missing |  |  |  |  |  |  |
| Input (req.body) | Input: password: empty string |  |  |  |  |  |  |
| Repository | authRepository.findByEmail: User Found |  |  |  |  |  |  |
| Repository | authRepository.findByEmail: User Not Found |  |  |  |  |  |  |
| Repository | authRepository.findByEmail: Query Error |  |  |  |  |  |  |
| Repository | authRepository.createRefreshToken: Success |  |  |  |  |  |  |
| Security | bcrypt.compare: TRUE |  |  |  |  |  |  |
| Security | bcrypt.compare: FALSE |  |  |  |  |  |  |
| Security | bcrypt.compare: Error |  |  |  |  |  |  |
| Security | jwt.sign: Success |  |  |  |  |  |  |
| Security | jwt.sign: Fail |  |  |  |  |  |  |
| Security | User Status: ACTIVE |  |  |  |  |  |  |
| Security | User Status: INACTIVE |  |  |  |  |  |  |
| Security | User Status: SUSPENDED |  |  |  |  |  |  |
| Business Rule | Account Status: ACTIVE (login allowed) |  |  |  |  |  |  |
| Business Rule | Account Status: INACTIVE (login denied) |  |  |  |  |  |  |
| Business Rule | Account Status: SUSPENDED (login denied) |  |  |  |  |  |  |
| Business Rule | Credentials: Password Match |  |  |  |  |  |  |
| Business Rule | Credentials: Password Mismatch |  |  |  |  |  |  |
| Input (req.body) | Valid email + password | O |  |  |  |  |  |
| Input (req.body) | Invalid/missing fields |  | O |  |  |  |  |
| Repository | findByEmail: User Not Found |  |  | O |  |  |  |
| Security | user.status: SUSPENDED |  |  |  | O |  |  |
| Security | user.status: INACTIVE |  |  | O |  |  |  |
| Security | user.status: ACTIVE + bcrypt.compare TRUE | O |  |  |  |  |  |
| Security | user.status: ACTIVE + bcrypt.compare FALSE |  |  |  |  |  | O |
| Repository | Query Error |  |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |  |
| Return Status | 401 |  |  | O |  |  | O |
| Return Status | 403 |  |  | O | O |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | { user, accessToken, refreshToken } | O |  |  |  |  |  |
| Return Body | Validation error |  | O |  |  |  |  |
| Return Body | Invalid credentials |  |  | O |  |  | O |
| Return Body | Account banned message |  |  |  | O |  |  |
| Return Body | Account is not active |  |  | O |  |  |  |
| Exception | None | O |  |  |  |  |  |
| Exception | ApiError.badRequest |  | O |  |  |  |  |
| Exception | ApiError.unauthorized |  |  | O |  |  | O |
| Exception | ApiError.forbidden (SUSPENDED) |  |  |  | O |  |  |
| Exception | ApiError.forbidden (INACTIVE) |  |  | O |  |  |  |
| Log Message | Login successful | O |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |
| Log Message | Invalid credentials |  |  | O |  |  | O |
| Log Message | Account banned |  |  |  | O |  |  |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | UTCID06 |
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
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Repository | prisma.user.findFirst (auth middleware): ACTIVE user found |  |  |  |  |  |
| Repository | prisma.user.findFirst (auth middleware): null (inactive/deleted) |  |  |  |  |  |
| Repository | authRepository.findById (service): User Found |  |  |  |  |  |
| Repository | authRepository.findById (service): User Not Found |  |  |  |  |  |
| Repository | authRepository.findById (service): Query Error |  |  |  |  |  |
| Security | Authorization Bearer token: Present |  |  |  |  |  |
| Security | Authorization Bearer token: Absent |  |  |  |  |  |
| Security | jwt.verify (access): Success |  |  |  |  |  |
| Security | jwt.verify (access): Invalid Signature |  |  |  |  |  |
| Security | jwt.verify (access): Expired Token |  |  |  |  |  |
| Security | jwt.verify (access): Error |  |  |  |  |  |
| Security | User Status (middleware): ACTIVE |  |  |  |  |  |
| Security | User Status (middleware): INACTIVE / deletedAt set |  |  |  |  |  |
| Business Rule | Controller calls authService.getProfile(req.user.id) |  |  |  |  |  |
| Security | Token valid + ACTIVE user + findById found | O |  |  |  |  |
| Security | No Bearer token |  |  |  | O |  |
| Security | Invalid/expired JWT |  |  |  | O |  |
| Security | Middleware: user not found or inactive |  |  |  | O |  |
| Repository | findById: User Not Found |  |  | O |  |  |
| Repository | findById Query Error |  |  |  |  | O |
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
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |  |
| Input (req.body) | Input: refreshToken (body/cookie): present valid string |  |  |  |  |  |  |  |
| Input (req.body) | Input: refreshToken (body/cookie): absent / null / empty |  |  |  |  |  |  |  |
| Input (req.body) | Input: refreshToken (body/cookie): invalid JWT string |  |  |  |  |  |  |  |
| Repository | authRepository.findRefreshToken: Stored token found with user |  |  |  |  |  |  |  |
| Repository | authRepository.findRefreshToken: Not Found |  |  |  |  |  |  |  |
| Repository | authRepository.findRefreshToken: Query Error |  |  |  |  |  |  |  |
| Repository | stored.expiresAt: >= now |  |  |  |  |  |  |  |
| Repository | stored.expiresAt: < now (expired) |  |  |  |  |  |  |  |
| Repository | authRepository.deleteRefreshToken: Success (rotation) |  |  |  |  |  |  |  |
| Repository | authRepository.createRefreshToken: Success |  |  |  |  |  |  |  |
| Security | verifyRefreshToken: Success |  |  |  |  |  |  |  |
| Security | verifyRefreshToken: Invalid Signature |  |  |  |  |  |  |  |
| Security | verifyRefreshToken: Expired Token |  |  |  |  |  |  |  |
| Security | verifyRefreshToken: Error |  |  |  |  |  |  |  |
| Security | stored.user.status: ACTIVE |  |  |  |  |  |  |  |
| Security | stored.user.status: INACTIVE |  |  |  |  |  |  |  |
| Security | stored.user.status: SUSPENDED |  |  |  |  |  |  |  |
| Business Rule | Token Rotation: SHA-256 hash before DB lookup |  |  |  |  |  |  |  |
| Business Rule | Token Rotation: Delete old token, issue new pair on success |  |  |  |  |  |  |  |
| Input (req.body) | refreshToken present + valid JWT + stored valid + ACTIVE | O |  |  |  |  |  |  |
| Input (req.body) | refreshToken not string when provided |  | O |  |  |  |  |  |
| Input (req.body) | refreshToken absent |  |  | O |  |  |  |  |
| Security | verifyRefreshToken throws |  |  |  | O |  |  |  |
| Repository | stored null or expired |  |  |  |  | O |  |  |
| Security | stored.user.status INACTIVE |  |  |  |  |  | O |  |
| Security | stored.user.status SUSPENDED |  |  |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |  |
| Return Status | 400 |  | O |  |  |  |  |  |
| Return Status | 401 |  |  | O | O | O |  |  |
| Return Status | 403 |  |  |  |  |  | O | O |
| Return Status | 500 |  |  |  |  | O |  |  |
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
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | UTCID06 | UTCID07 |
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
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |
| Input (req.body) | Input: refreshToken (body/cookie): present |  |  |  |  |
| Input (req.body) | Input: refreshToken (body/cookie): absent |  |  |  |  |
| Input (req.body) | Input: req.user.id: present (from authenticate) |  |  |  |  |
| Input (req.body) | Input: req.user.id: absent |  |  |  |  |
| Repository | authRepository.deleteRefreshToken: Called when refreshToken present |  |  |  |  |
| Repository | authRepository.deleteRefreshToken: Error swallowed (.catch) |  |  |  |  |
| Repository | authRepository.deleteUserRefreshTokens: Called when no token + userId |  |  |  |  |
| Repository | authRepository.deleteUserRefreshTokens: Query Error |  |  |  |  |
| Security | authenticate middleware: PASS |  |  |  |  |
| Security | authenticate middleware: FAIL |  |  |  |  |
| Business Rule | Branch: if (refreshToken) → deleteRefreshToken |  |  |  |  |
| Business Rule | Branch: else if (userId) → deleteUserRefreshTokens |  |  |  |  |
| Business Rule | Branch: Always returns true from service |  |  |  |  |
| Security | authenticate PASS + refreshToken present | O |  |  |  |
| Security | authenticate PASS + no token + userId |  | O |  |  |
| Security | authenticate PASS + neither token nor userId |  |  | O |  |
| Security | authenticate FAIL |  |  |  | O |
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
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error |
| Pass/Fail |  |  |  |  |  |
| Executed Date |  |  |  |  |  |
| Defect ID |  |  |  |  |  |

---

### Function Code: `listUsers`

**Service:** User Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: page (query): valid int >= 1 / default |  |  |  |  |  |
| Input (req.body) | Input: limit (query): valid int 1-100 / default |  |  |  |  |  |
| Input (req.body) | Input: search (query): optional string |  |  |  |  |  |
| Input (req.body) | Input: status (query): ACTIVE / INACTIVE / SUSPENDED / invalid |  |  |  |  |  |
| Repository | usersRepository.findMany: Success |  |  |  |  |  |
| Repository | usersRepository.findMany: Query Error |  |  |  |  |  |
| Repository | usersRepository.count: Success |  |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  |  |  |  |
| Security | authorize(ADMIN): PASS / FAIL |  |  |  |  |  |
| Business Rule | Filter: query.status → where.status |  |  |  |  |  |
| Business Rule | Filter: query.search → OR fullName/email contains |  |  |  |  |  |
| Security | ADMIN authenticated + valid query | O |  |  |  |  |
| Input (req.body) | Invalid status/page/limit |  | O |  |  |  |
| Security | Not authenticated |  |  |  | O |  |
| Security | Not ADMIN |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |
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

### Function Code: `getUserById`

**Service:** User Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing User ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |
| Repository | usersRepository.findById: User Found (deletedAt: null) |  |  |  |  |  |
| Repository | usersRepository.findById: User Not Found |  |  |  |  |  |
| Repository | usersRepository.findById: Query Error |  |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  |  |  |  |
| Business Rule | Lookup: formatUser maps roles array |  |  |  |  |  |
| Input (req.body) | Valid UUID + user found | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | findById: Not Found |  |  | O |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `updateUser`

**Service:** User Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): valid UUID |  |  |  |  |  |
| Input (req.body) | Input: fullName (body): optional 2-100 / invalid |  |  |  |  |  |
| Input (req.body) | Input: bio (body): optional max 500 / invalid |  |  |  |  |  |
| Input (req.body) | Input: avatar (body): optional valid URL / invalid |  |  |  |  |  |
| Input (req.body) | Input: requesterId: same as id (self) / different |  |  |  |  |  |
| Repository | usersRepository.findById (requester): Found when id !== requesterId |  |  |  |  |  |
| Repository | usersRepository.update: Success / Query Error |  |  |  |  |  |
| Security | Self Update: id === requesterId → allowed |  |  |  |  |  |
| Security | Admin Update: requester roles includes ADMIN |  |  |  |  |  |
| Security | Forbidden: Non-admin updating other user |  |  |  |  |  |
| Business Rule | Update Fields: fullName, bio, avatar only |  |  |  |  |  |
| Input (req.body) | Valid fields + self update | O |  |  |  |  |
| Input (req.body) | Invalid UUID/fields |  | O |  |  |  |
| Security | Admin updates other user | O |  |  |  |  |
| Security | Non-admin updates other |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |
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

### Function Code: `setUserStatus`

**Service:** User Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing User ID |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Non Existing User ID |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): ACTIVE |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): INACTIVE |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): SUSPENDED |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): Invalid Status |  |  |  |  |  |  |
| Repository | usersRepository.findById (requester): Requester Found |  |  |  |  |  |  |
| Repository | usersRepository.findById (target): User Found |  |  |  |  |  |  |
| Repository | usersRepository.findById (target): User Not Found |  |  |  |  |  |  |
| Repository | usersRepository.update: Success |  |  |  |  |  |  |
| Repository | usersRepository.revokeRefreshTokens: Called on SUSPENDED |  |  |  |  |  |  |
| Security | authorize(ADMIN) middleware: PASS |  |  |  |  |  |  |
| Security | authorize(ADMIN) middleware: FAIL |  |  |  |  |  |  |
| Security | requesterIsAdmin (service): TRUE |  |  |  |  |  |  |
| Security | requesterIsAdmin (service): FALSE |  |  |  |  |  |  |
| Security | targetIsAdmin: TRUE |  |  |  |  |  |  |
| Security | targetIsAdmin: FALSE |  |  |  |  |  |  |
| Business Rule | Self Status Change: id === requesterId (denied) |  |  |  |  |  |  |
| Business Rule | Admin Target: Cannot change admin account status |  |  |  |  |  |  |
| Business Rule | Suspension: SUSPENDED → revokeRefreshTokens |  |  |  |  |  |  |
| Input (req.body) | Valid id + status ACTIVE/INACTIVE | O |  |  |  |  |  |
| Input (req.body) | Invalid UUID or status |  | O |  |  |  |  |
| Security | authorize ADMIN: FAIL |  |  |  | O |  |  |
| Security | requesterIsAdmin: FALSE |  |  |  | O |  |  |
| Business Rule | id === requesterId |  |  | O |  |  |  |
| Repository | findById target: Not Found |  |  | O |  |  |  |
| Business Rule | targetIsAdmin: TRUE |  |  | O |  |  |  |
| Business Rule | status SUSPENDED + all checks pass |  |  |  |  |  | O |
| Repository | Query Error |  |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  | O |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  | O | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | Updated user with new status | O |  |  |  |  | O |
| Return Body | Validation error |  | O |  |  |  |  |
| Return Body | Cannot change own/admin status |  |  | O | O |  |  |
| Return Body | User not found |  |  | O |  |  |  |
| Exception | None | O |  |  |  |  | O |
| Exception | ApiError.badRequest (validation/self) |  | O | O |  |  |  |
| Exception | ApiError.forbidden |  |  | O | O |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Log Message | User status updated | O |  |  |  |  | O |
| Log Message | Refresh tokens revoked (SUSPENDED) |  |  |  |  |  | O |
| Log Message | Status change rejected |  | O | O | O |  |  |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | UTCID06 |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `removeUser`

**Service:** User Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): valid UUID / invalid UUID |  |  |  |  |  |
| Repository | usersRepository.softDelete: Success (deletedAt + status INACTIVE) |  |  |  |  |  |
| Repository | usersRepository.softDelete: Query Error |  |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  |  |  |  |
| Security | authorize(ADMIN): PASS / FAIL |  |  |  |  |  |
| Business Rule | Soft Delete: No explicit not-found check in service |  |  |  |  |  |
| Input (req.body) | Valid UUID + ADMIN | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Security | Not authenticated |  |  |  | O |  |
| Security | Not ADMIN |  |  |  | O |  |
| Repository | softDelete Query Error |  |  |  |  | O |
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

### Function Code: `listGroups`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: page (query): valid int >= 1 |  |  |  |  |  |
| Input (req.body) | Input: page (query): invalid / missing (defaults) |  |  |  |  |  |
| Input (req.body) | Input: limit (query): valid int 1-100 |  |  |  |  |  |
| Input (req.body) | Input: limit (query): invalid (defaults/clamped) |  |  |  |  |  |
| Input (req.body) | Input: search (query): present string |  |  |  |  |  |
| Input (req.body) | Input: search (query): absent |  |  |  |  |  |
| Input (req.body) | Input: myGroups (query): true |  |  |  |  |  |
| Input (req.body) | Input: myGroups (query): false / absent |  |  |  |  |  |
| Input (req.body) | Input: status (query): ACTIVE / ARCHIVED / DELETED |  |  |  |  |  |
| Input (req.body) | Input: status (query): invalid value |  |  |  |  |  |
| Repository | groupsRepository.findMany: Success |  |  |  |  |  |
| Repository | groupsRepository.findMany: Query Error |  |  |  |  |  |
| Repository | groupsRepository.count: Success |  |  |  |  |  |
| Repository | groupsRepository.count: Query Error |  |  |  |  |  |
| Security | Authentication: Optional (public route) |  |  |  |  |  |
| Security | Role Validation: ADMIN sees all statuses |  |  |  |  |  |
| Security | Role Validation: Non-admin sees ACTIVE only |  |  |  |  |  |
| Business Rule | Filter: query.status set → filter by status |  |  |  |  |  |
| Business Rule | Filter: !isAdmin && !status → where.status = ACTIVE |  |  |  |  |  |
| Business Rule | Filter: myGroups=true + userId → member filter + ACTIVE |  |  |  |  |  |
| Business Rule | Filter: search → OR name/subject contains |  |  |  |  |  |
| Input (req.body) | Valid query params | O |  |  |  |  |
| Input (req.body) | Invalid page/limit/status |  | O |  |  |  |
| Business Rule | Non-admin default ACTIVE filter | O |  |  |  |  |
| Repository | findMany/count Query Error |  |  |  |  | O |
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

### Function Code: `getGroupById`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-----------|---------------|---|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Group ID |  |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Non Existing Group ID |  |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |  |  |
| Repository | groupsRepository.findById: Group Found |  |  |  |  |  |  |  |
| Repository | groupsRepository.findById: Group Not Found |  |  |  |  |  |  |  |
| Repository | groupsRepository.findJoinRequest: Pending Request Found |  |  |  |  |  |  |  |
| Repository | groupsRepository.findJoinRequest: No Pending Request |  |  |  |  |  |  |  |
| Security | Role Validation: ADMIN |  |  |  |  |  |  |  |
| Security | Role Validation: LEADER |  |  |  |  |  |  |  |
| Security | Role Validation: MEMBER |  |  |  |  |  |  |  |
| Security | Role Validation: Anonymous (no auth) |  |  |  |  |  |  |  |
| Business Rule | Group Status: ACTIVE |  |  |  |  |  |  |  |
| Business Rule | Group Status: ARCHIVED (admin visible) |  |  |  |  |  |  |  |
| Business Rule | Group Status: ARCHIVED (non-admin hidden) |  |  |  |  |  |  |  |
| Business Rule | Join Request Visibility: Leader sees joinRequests |  |  |  |  |  |  |  |
| Business Rule | Join Request Visibility: Non-leader joinRequests hidden |  |  |  |  |  |  |  |
| Input (req.body) | Valid UUID | O |  |  |  |  | O | O |
| Input (req.body) | Invalid UUID |  | O |  |  |  |  |  |
| Repository | findById: Group Not Found |  |  | O |  |  |  |  |
| Business Rule | status ACTIVE | O |  |  |  |  |  |  |
| Business Rule | status ARCHIVED + isAdmin |  |  |  |  |  | O |  |
| Business Rule | status ARCHIVED + !isAdmin |  |  |  |  |  |  | O |
| Security | User is LEADER → joinRequests visible | O |  |  |  |  | O |  |
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
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | UTCID06 | UTCID07 |
| Pass/Fail |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |

---

### Function Code: `createGroup`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: name (body): valid 3-100 chars |  |  |  |  |  |
| Input (req.body) | Input: name (body): invalid length / missing |  |  |  |  |  |
| Input (req.body) | Input: subject (body): non-empty trimmed string |  |  |  |  |  |
| Input (req.body) | Input: subject (body): empty / missing |  |  |  |  |  |
| Input (req.body) | Input: description (body): optional string |  |  |  |  |  |
| Input (req.body) | Input: maxMembers (body): optional int 2-100 |  |  |  |  |  |
| Input (req.body) | Input: maxMembers (body): invalid int |  |  |  |  |  |
| Repository | groupsRepository.create: Success (creator as LEADER member) |  |  |  |  |  |
| Repository | groupsRepository.create: Query Error |  |  |  |  |  |
| Security | authenticate middleware: PASS |  |  |  |  |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  |
| Business Rule | Group Creation: createdBy = userId |  |  |  |  |  |
| Business Rule | Group Creation: Auto-add creator as LEADER member |  |  |  |  |  |
| Input (req.body) | Valid name + subject | O |  |  |  |  |
| Input (req.body) | Invalid name/subject/maxMembers |  | O |  |  |  |
| Security | authenticate: FAIL |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |
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

### Function Code: `updateGroup`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Group ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |
| Input (req.body) | Input: name (body): optional valid 3-100 |  |  |  |  |  |
| Input (req.body) | Input: subject (body): optional non-empty |  |  |  |  |  |
| Input (req.body) | Input: maxMembers (body): optional int 2-100 |  |  |  |  |  |
| Input (req.body) | Input: status (body): ACTIVE / ARCHIVED (optional) |  |  |  |  |  |
| Repository | groupsRepository.isMember: LEADER |  |  |  |  |  |
| Repository | groupsRepository.isMember: Not Member / MEMBER role |  |  |  |  |  |
| Repository | groupsRepository.update: Success |  |  |  |  |  |
| Repository | groupsRepository.update: Query Error |  |  |  |  |  |
| Security | Role Validation: LEADER required |  |  |  |  |  |
| Security | Role Validation: MEMBER → forbidden |  |  |  |  |  |
| Business Rule | Update Rule: Only group leaders can update |  |  |  |  |  |
| Input (req.body) | Valid UUID + optional fields | O |  |  |  |  |
| Input (req.body) | Invalid UUID or field values |  | O |  |  |  |
| Security | isMember role !== LEADER |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |
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

### Function Code: `setGroupStatus`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Group ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |
| Input (req.body) | Input: status (body): ACTIVE |  |  |  |  |  |
| Input (req.body) | Input: status (body): ARCHIVED |  |  |  |  |  |
| Input (req.body) | Input: status (body): Invalid Status |  |  |  |  |  |
| Repository | groupsRepository.findById: Group Found |  |  |  |  |  |
| Repository | groupsRepository.findById: Group Not Found |  |  |  |  |  |
| Repository | groupsRepository.update: Success |  |  |  |  |  |
| Repository | notificationsService.notifyUsers: Success |  |  |  |  |  |
| Repository | groupsRepository.update: Query Error |  |  |  |  |  |
| Security | authorize(ADMIN): PASS |  |  |  |  |  |
| Security | authorize(ADMIN): FAIL |  |  |  |  |  |
| Security | service isAdmin check: FALSE → forbidden |  |  |  |  |  |
| Business Rule | Status Change: ARCHIVED → notify "Group banned" |  |  |  |  |  |
| Business Rule | Status Change: ACTIVE → notify "Group restored" |  |  |  |  |  |
| Input (req.body) | Valid id + ACTIVE/ARCHIVED | O |  |  |  |  |
| Input (req.body) | Invalid UUID or status |  | O |  |  |  |
| Repository | findById: Group Not Found |  |  | O |  |  |
| Security | !isAdmin |  |  |  | O |  |
| Repository | update/notify Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `removeGroup`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Group ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Non Existing Group ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |
| Repository | groupsRepository.findById: Group Found |  |  |  |  |  |
| Repository | groupsRepository.findById: Group Not Found |  |  |  |  |  |
| Repository | groupsRepository.softDelete: Success |  |  |  |  |  |
| Repository | groupsRepository.softDelete: Query Error |  |  |  |  |  |
| Security | Authorization: group.createdBy === userId |  |  |  |  |  |
| Security | Authorization: isAdmin === true |  |  |  |  |  |
| Security | Authorization: Neither creator nor admin → forbidden |  |  |  |  |  |
| Business Rule | Soft Delete: sets deletedAt via softDelete |  |  |  |  |  |
| Input (req.body) | Valid UUID | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | findById: Not Found |  |  | O |  |  |
| Security | !isAdmin && createdBy !== userId |  |  |  | O |  |
| Repository | softDelete Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |  |
| Input (req.body) | Input: groupId (param): Existing Group ID |  |  |  |  |  |  |  |
| Input (req.body) | Input: groupId (param): Non Existing Group ID |  |  |  |  |  |  |  |
| Input (req.body) | Input: groupId (param): Invalid UUID |  |  |  |  |  |  |  |
| Repository | groupsRepository.findById: Group Found |  |  |  |  |  |  |  |
| Repository | groupsRepository.findById: Group Not Found |  |  |  |  |  |  |  |
| Repository | groupsRepository.findById: Query Error |  |  |  |  |  |  |  |
| Repository | groupsRepository.isMember: Not Member |  |  |  |  |  |  |  |
| Repository | groupsRepository.isMember: Already Member |  |  |  |  |  |  |  |
| Repository | groupsRepository.findJoinRequest: No Pending Request |  |  |  |  |  |  |  |
| Repository | groupsRepository.findJoinRequest: Pending Request Exists |  |  |  |  |  |  |  |
| Repository | groupsRepository.createJoinRequest: Success |  |  |  |  |  |  |  |
| Security | authenticate middleware: PASS |  |  |  |  |  |  |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  |  |  |
| Security | Role Validation: MEMBER |  |  |  |  |  |  |  |
| Business Rule | Group Status: ACTIVE |  |  |  |  |  |  |  |
| Business Rule | Group Status: ARCHIVED |  |  |  |  |  |  |  |
| Business Rule | Group Status: DELETED |  |  |  |  |  |  |  |
| Business Rule | Join Request: Already Member |  |  |  |  |  |  |  |
| Business Rule | Join Request: Pending Request Exists |  |  |  |  |  |  |  |
| Business Rule | Join Request: Group Full |  |  |  |  |  |  |  |
| Business Rule | Join Request: Group Not Accepting Members |  |  |  |  |  |  |  |
| Input (req.body) | Valid groupId UUID | O |  |  |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |  |  |
| Repository | findById: Group Not Found |  |  | O |  |  |  |  |
| Business Rule | group.status !== ACTIVE |  |  | O |  |  |  |  |
| Business Rule | isMember: Already Member |  |  |  |  |  | O |  |
| Business Rule | findJoinRequest: Pending Exists |  |  |  |  |  |  | O |
| Business Rule | members.length >= maxMembers |  |  | O |  |  |  |  |
| Repository | All checks pass + createJoinRequest | O |  |  |  |  |  |  |
| Security | authenticate: FAIL |  |  |  | O |  |  |  |
| Repository | Query Error |  |  |  |  | O |  |  |
| — Confirm — |  |  |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |  |  |
| Return Status | 401 |  |  |  | O |  |  |  |
| Return Status | 404 |  |  | O |  |  |  |  |
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
| Exception | ApiError.badRequest (Full/Not accepting) |  |  | O |  |  |  |  |
| Exception | ApiError.conflict |  |  |  |  |  | O | O |
| Exception | ApiError.unauthorized |  |  |  | O |  |  |  |
| Log Message | Join request submitted | O |  |  |  |  |  |  |
| Log Message | Validation failed |  | O |  |  |  |  |  |
| Log Message | Business rule rejected |  |  | O |  |  | O | O |
| — Result — |  |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | UTCID06 | UTCID07 |
| Pass/Fail |  |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |  |

---

### Function Code: `cancelJoinRequest`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id/groupId (param): Existing Group ID |  |  |  |  |  |
| Input (req.body) | Input: id/groupId (param): Invalid UUID |  |  |  |  |  |
| Repository | groupsRepository.findJoinRequest: Pending Request Found |  |  |  |  |  |
| Repository | groupsRepository.findJoinRequest: Request Not Found |  |  |  |  |  |
| Repository | groupsRepository.deleteJoinRequest: Success |  |  |  |  |  |
| Repository | groupsRepository.deleteJoinRequest: Query Error |  |  |  |  |  |
| Security | authenticate middleware: PASS |  |  |  |  |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  |
| Business Rule | Join Request: status must be PENDING |  |  |  |  |  |
| Business Rule | Join Request: status !== PENDING → badRequest |  |  |  |  |  |
| Input (req.body) | Valid groupId UUID | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | findJoinRequest: Not Found |  |  | O |  |  |
| Business Rule | request.status !== PENDING |  |  | O |  |  |
| Security | authenticate: FAIL |  |  |  | O |  |
| Repository | deleteJoinRequest Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | Join request cancelled | O |  |  |  |  |
| Return Body | Join request not found |  |  | O |  |  |
| Return Body | Only pending join requests can be cancelled |  |  | O |  |  |
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

### Function Code: `approveJoinRequest`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: requestId (param): Existing Request ID |  |  |  |  |  |
| Input (req.body) | Input: requestId (param): Invalid UUID |  |  |  |  |  |
| Repository | groupsRepository.findJoinRequestById: Request Found PENDING |  |  |  |  |  |
| Repository | groupsRepository.addMember: Success |  |  |  |  |  |
| Security | Role Validation: LEADER required |  |  |  |  |  |
| Business Rule | Delegation: calls handleJoinRequest(requestId, APPROVED, userId) |  |  |  |  |  |
| Business Rule | Approval: addMember with role MEMBER |  |  |  |  |  |
| Input (req.body) | Valid requestId UUID | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Business Rule | Request not found / not pending |  |  | O |  |  |
| Security | Not leader |  |  |  | O |  |
| Repository | addMember Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `rejectJoinRequest`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |
| Input (req.body) | Input: requestId (param): Existing Request ID |  |  |  |  |  |  |
| Input (req.body) | Input: requestId (param): Invalid UUID |  |  |  |  |  |  |
| Repository | groupsRepository.findJoinRequestById: Request Found PENDING |  |  |  |  |  |  |
| Repository | groupsRepository.updateJoinRequest: Success REJECTED |  |  |  |  |  |  |
| Security | Role Validation: LEADER required |  |  |  |  |  |  |
| Business Rule | Delegation: calls handleJoinRequest(requestId, REJECTED, userId) |  |  |  |  |  |  |
| Input (req.body) | Valid requestId UUID | O |  |  |  |  | O |
| Input (req.body) | Invalid UUID |  | O |  |  |  |  |
| Business Rule | Request not pending |  |  | O |  |  |  |
| Security | Not leader |  |  |  | O |  |  |
| Repository | updateJoinRequest Error |  |  |  |  | O |  |
| Business Rule | REJECTED without addMember |  |  |  |  |  | O |
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
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | UTCID06 |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `handleJoinRequest`

**Service:** Study Group Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |
| Input (req.body) | Input: requestId (param): Existing Request ID |  |  |  |  |  |  |
| Input (req.body) | Input: requestId (param): Non Existing Request ID |  |  |  |  |  |  |
| Input (req.body) | Input: requestId (param): Invalid UUID |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): APPROVED |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): REJECTED |  |  |  |  |  |  |
| Input (req.body) | Input: status (body): Invalid Status |  |  |  |  |  |  |
| Repository | groupsRepository.findJoinRequestById: Request Found |  |  |  |  |  |  |
| Repository | groupsRepository.findJoinRequestById: Request Not Found |  |  |  |  |  |  |
| Repository | groupsRepository.isMember: Leader Member |  |  |  |  |  |  |
| Repository | groupsRepository.isMember: Not Leader / Not Member |  |  |  |  |  |  |
| Repository | groupsRepository.updateJoinRequest: Success |  |  |  |  |  |  |
| Repository | groupsRepository.addMember: Success (on APPROVED) |  |  |  |  |  |  |
| Security | Role Validation: LEADER |  |  |  |  |  |  |
| Security | Role Validation: MEMBER (non-leader) |  |  |  |  |  |  |
| Security | Role Validation: Unauthorized |  |  |  |  |  |  |
| Business Rule | Join Request Status: PENDING |  |  |  |  |  |  |
| Business Rule | Join Request Status: Already Processed |  |  |  |  |  |  |
| Business Rule | Approval Action: APPROVED → addMember |  |  |  |  |  |  |
| Business Rule | Approval Action: REJECTED → update only |  |  |  |  |  |  |
| Input (req.body) | Valid requestId + status APPROVED | O |  |  |  |  |  |
| Input (req.body) | Invalid UUID or status |  | O |  |  |  |  |
| Repository | findJoinRequestById: Not Found |  |  | O |  |  |  |
| Business Rule | request.status !== PENDING |  |  | O |  |  |  |
| Security | isMember role !== LEADER |  |  |  | O |  | O |
| Business Rule | status REJECTED + leader |  |  |  |  |  | O |
| Repository | Query Error |  |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  | O |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | Updated join request | O |  |  |  |  | O |
| Return Body | Validation error |  | O |  |  |  |  |
| Return Body | Join request not found / no longer pending |  |  | O |  |  |  |
| Return Body | Forbidden |  |  |  | O |  |  |
| Exception | None | O |  |  |  |  | O |
| Exception | ApiError.badRequest |  | O | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Log Message | Join request approved/rejected | O |  |  |  |  | O |
| Log Message | Validation/business rejected |  | O | O | O |  |  |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | UTCID06 |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `listSessions`

**Service:** Study Session Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: page/limit (query): valid pagination |  |  |  |  |  |
| Input (req.body) | Input: page/limit (query): invalid (defaults) |  |  |  |  |  |
| Input (req.body) | Input: groupId (query): valid UUID / absent |  |  |  |  |  |
| Input (req.body) | Input: groupId (query): invalid UUID |  |  |  |  |  |
| Input (req.body) | Input: status (query): SCHEDULED / IN_PROGRESS / COMPLETED / CANCELLED |  |  |  |  |  |
| Input (req.body) | Input: upcoming (query): true → startTime >= now + SCHEDULED |  |  |  |  |  |
| Input (req.body) | Input: mySessions (query): true + userId → member filter |  |  |  |  |  |
| Repository | sessionsRepository.findMany: Success (deletedAt: null) |  |  |  |  |  |
| Repository | sessionsRepository.findMany: Query Error |  |  |  |  |  |
| Repository | sessionsRepository.count: Success |  |  |  |  |  |
| Security | Authentication: Optional (public route) |  |  |  |  |  |
| Business Rule | Filter: groupId → where.groupId |  |  |  |  |  |
| Business Rule | Filter: status → where.status |  |  |  |  |  |
| Business Rule | Filter: upcoming=true → startTime gte now + status SCHEDULED |  |  |  |  |  |
| Input (req.body) | Valid query | O |  |  |  |  |
| Input (req.body) | Invalid groupId UUID |  | O |  |  |  |
| Repository | findMany Query Error |  |  |  |  | O |
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

### Function Code: `getSessionById`

**Service:** Study Session Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Session ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Non Existing Session ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |
| Repository | sessionsRepository.findById: Session Found |  |  |  |  |  |
| Repository | sessionsRepository.findById: Session Not Found |  |  |  |  |  |
| Repository | sessionsRepository.findById: Query Error |  |  |  |  |  |
| Security | Authentication: Optional |  |  |  |  |  |
| Business Rule | Lookup: if !session → notFound |  |  |  |  |  |
| Input (req.body) | Valid UUID + session exists | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | findById: Not Found |  |  | O |  |  |
| Repository | Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `createSession`

**Service:** Study Session Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: groupId (body): valid UUID |  |  |  |  |  |
| Input (req.body) | Input: groupId (body): invalid / missing |  |  |  |  |  |
| Input (req.body) | Input: title (body): valid 3-150 chars |  |  |  |  |  |
| Input (req.body) | Input: title (body): invalid length |  |  |  |  |  |
| Input (req.body) | Input: startNow (body): true → IN_PROGRESS immediately |  |  |  |  |  |
| Input (req.body) | Input: startNow (body): false / absent → SCHEDULED |  |  |  |  |  |
| Input (req.body) | Input: startTime (body): required when !startNow (ISO8601) |  |  |  |  |  |
| Input (req.body) | Input: endTime (body): required when !startNow (ISO8601) |  |  |  |  |  |
| Input (req.body) | Input: endTime (body): missing when scheduled → badRequest |  |  |  |  |  |
| Input (req.body) | Input: notifyMembers (body): true → call notifyMembers |  |  |  |  |  |
| Input (req.body) | Input: meetingLink (body): optional valid URL |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member |  |  |  |  |  |
| Repository | groupsRepository.isMember: Not Member |  |  |  |  |  |
| Repository | sessionsRepository.create: Success |  |  |  |  |  |
| Repository | sessionsRepository.create: Query Error |  |  |  |  |  |
| Security | Membership: Must be group member |  |  |  |  |  |
| Business Rule | Session Type: startNow → status IN_PROGRESS, endTime null |  |  |  |  |  |
| Business Rule | Session Type: scheduled → status SCHEDULED, endTime required |  |  |  |  |  |
| Business Rule | Notification: notifyMembers flag triggers notifyMembers |  |  |  |  |  |
| Input (req.body) | Valid payload (scheduled or startNow) | O |  |  |  |  |
| Input (req.body) | Invalid UUID/title/times |  | O |  |  |  |
| Business Rule | !startNow && !endTime → badRequest |  |  | O |  |  |
| Security | !membership |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |
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

### Function Code: `updateSession`

**Service:** Study Session Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Session ID / Invalid UUID |  |  |  |  |  |
| Input (req.body) | Input: title (body): optional 3-150 |  |  |  |  |  |
| Input (req.body) | Input: startTime/endTime (body): optional ISO8601 |  |  |  |  |  |
| Input (req.body) | Input: meetingLink (body): optional URL |  |  |  |  |  |
| Input (req.body) | Input: status (body): SCHEDULED / IN_PROGRESS / COMPLETED / CANCELLED |  |  |  |  |  |
| Repository | sessionsRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | sessionsRepository.update: Success / Query Error |  |  |  |  |  |
| Repository | groupsRepository.isMember: LEADER (via assertCanManageSession) |  |  |  |  |  |
| Security | assertCanManageSession: Session creator |  |  |  |  |  |
| Security | assertCanManageSession: Group LEADER |  |  |  |  |  |
| Security | assertCanManageSession: Other member → forbidden |  |  |  |  |  |
| Business Rule | Manage Rule: Creator or group LEADER may update |  |  |  |  |  |
| Input (req.body) | Valid id + fields | O |  |  |  |  |
| Input (req.body) | Invalid UUID/fields |  | O |  |  |  |
| Repository | Session not found |  |  | O |  |  |
| Security | assertCanManageSession forbidden |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `endSession`

**Service:** Study Session Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-----------|---------------|---|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Session ID |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Non Existing Session ID |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |  |
| Repository | sessionsRepository.findById: Session Found |  |  |  |  |  |  |
| Repository | sessionsRepository.findById: Session Not Found |  |  |  |  |  |  |
| Repository | sessionsRepository.update: Success |  |  |  |  |  |  |
| Security | assertCanManageSession: Session Creator |  |  |  |  |  |  |
| Security | assertCanManageSession: Group LEADER |  |  |  |  |  |  |
| Security | assertCanManageSession: Forbidden (other member) |  |  |  |  |  |  |
| Business Rule | Session Status: IN_PROGRESS → COMPLETED + deleteLiveKitRoom |  |  |  |  |  |  |
| Business Rule | Session Status: SCHEDULED → CANCELLED |  |  |  |  |  |  |
| Business Rule | Session Status: COMPLETED (already ended) |  |  |  |  |  |  |
| Business Rule | Session Status: CANCELLED (already ended) |  |  |  |  |  |  |
| Business Rule | LiveKit Service: deleteLiveKitRoom Success |  |  |  |  |  |  |
| Business Rule | LiveKit Service: deleteLiveKitRoom Fail |  |  |  |  |  |  |
| Input (req.body) | Valid sessionId UUID | O |  |  |  |  | O |
| Input (req.body) | Invalid UUID |  | O |  |  |  |  |
| Repository | findById: Session Not Found |  |  | O |  |  |  |
| Security | assertCanManageSession: Forbidden |  |  |  | O |  |  |
| Business Rule | status IN_PROGRESS | O |  |  |  |  |  |
| Business Rule | status SCHEDULED |  |  |  |  |  | O |
| Business Rule | status COMPLETED or CANCELLED |  |  | O |  |  |  |
| Business Rule | deleteLiveKitRoom Error |  |  |  |  | O |  |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  | O |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
| Return Status | 500 |  |  |  |  | O |  |
| Return Body | Updated session (COMPLETED/CANCELLED) | O |  |  |  |  | O |
| Return Body | Session is already ended |  |  | O |  |  |  |
| Return Body | Session not found |  |  | O |  |  |  |
| Return Body | Forbidden |  |  |  | O |  |  |
| Exception | None | O |  |  |  |  | O |
| Exception | ApiError.badRequest (already ended) |  |  | O |  |  |  |
| Exception | ApiError.notFound |  |  | O |  |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |  |
| Exception | LiveKit deleteLiveKitRoom Error |  |  |  |  | O |  |
| Log Message | Session ended | O |  |  |  |  | O |
| Log Message | Session already ended |  |  | O |  |  |  |
| Log Message | LiveKit room deleted | O |  |  |  |  |  |
| — Result — |  |  |  |  |  |  |  |
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | UTCID06 |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `notifyMembers`

**Service:** Study Session Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Session ID / Invalid UUID |  |  |  |  |  |
| Repository | sessionsRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | groupsRepository.getMemberUserIds: Member IDs list |  |  |  |  |  |
| Repository | notificationsService.notifyUsers: Success / Query Error |  |  |  |  |  |
| Security | assertCanManageSession: Creator or LEADER |  |  |  |  |  |
| Security | assertCanManageSession: Forbidden |  |  |  |  |  |
| Business Rule | Notification: Recipients = all members except sender |  |  |  |  |  |
| Business Rule | Notification: Title/message/link from session |  |  |  |  |  |
| Input (req.body) | Valid session id | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | Session not found |  |  | O |  |  |
| Security | Not creator/leader |  |  |  | O |  |
| Repository | notifyUsers Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `getLiveKitToken`

**Service:** Study Session Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Session ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Non Existing Session ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |
| Repository | sessionsRepository.findById: Session Found |  |  |  |  |  |
| Repository | sessionsRepository.findById: Session Not Found |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member |  |  |  |  |  |
| Repository | groupsRepository.isMember: Not Member |  |  |  |  |  |
| Security | authenticate middleware: PASS |  |  |  |  |  |
| Security | authenticate middleware: FAIL |  |  |  |  |  |
| Business Rule | Session Status: IN_PROGRESS |  |  |  |  |  |
| Business Rule | Session Status: SCHEDULED / COMPLETED / CANCELLED |  |  |  |  |  |
| Business Rule | LiveKit Service: Configured |  |  |  |  |  |
| Business Rule | LiveKit Service: Not Configured |  |  |  |  |  |
| Business Rule | LiveKit Service: createLiveKitToken Success |  |  |  |  |  |
| Business Rule | LiveKit Service: createLiveKitToken Fail |  |  |  |  |  |
| Input (req.body) | Valid sessionId UUID | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | findById: Session Not Found |  |  | O |  |  |
| Business Rule | session.status !== IN_PROGRESS |  |  | O |  |  |
| Security | isMember: Not Member |  |  |  | O |  |
| Business Rule | LiveKit Not Configured |  |  | O |  | O |
| Business Rule | IN_PROGRESS + member + LiveKit OK | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { token, serverUrl, roomName } | O |  |  |  |  |
| Return Body | Session is not in progress |  |  | O |  |  |
| Return Body | Must be a group member |  |  |  | O |  |
| Return Body | LiveKit is not configured |  |  | O |  | O |
| Exception | None | O |  |  |  |  |
| Exception | ApiError.badRequest |  | O | O |  |  |
| Exception | ApiError.forbidden |  |  |  | O |  |
| Exception | ApiError.notFound |  |  | O |  |  |
| Exception | ApiError.internal (LiveKit) |  |  | O |  | O |
| Log Message | LiveKit token issued | O |  |  |  |  |
| Log Message | Session not in progress |  |  | O |  |  |
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
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Session ID / Invalid UUID |  |  |  |  |  |
| Repository | sessionsRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | sessionsRepository.softDelete: Success / Query Error |  |  |  |  |  |
| Security | Authorization: session.createdBy === userId |  |  |  |  |  |
| Security | Authorization: Other user → forbidden |  |  |  |  |  |
| Business Rule | LiveKit Service: deleteLiveKitRoom before softDelete |  |  |  |  |  |
| Business Rule | LiveKit Service: deleteLiveKitRoom Fail |  |  |  |  |  |
| Input (req.body) | Valid id + creator | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | Session not found |  |  | O |  |  |
| Security | createdBy !== userId |  |  |  | O |  |
| Business Rule | deleteLiveKitRoom or softDelete Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `markAttendance`

**Service:** Attendance Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: sessionId (param): Existing Session ID / Invalid UUID |  |  |  |  |  |
| Input (req.body) | Input: userId (body): optional UUID (defaults to req.user.id) |  |  |  |  |  |
| Input (req.body) | Input: status (body): PRESENT / ABSENT / LATE / EXCUSED / invalid |  |  |  |  |  |
| Repository | sessionsRepository.findById: Session Found / Not Found |  |  |  |  |  |
| Repository | attendanceRepository.upsert: Success / Query Error |  |  |  |  |  |
| Security | Self Mark: markerId === targetUserId |  |  |  |  |  |
| Security | Creator Marks Other: session.createdBy === markerId |  |  |  |  |  |
| Security | Forbidden: Non-creator marking others |  |  |  |  |  |
| Business Rule | Upsert: Sets status + checkedAt = new Date() |  |  |  |  |  |
| Input (req.body) | Valid sessionId + status + self mark | O |  |  |  |  |
| Input (req.body) | Invalid UUID or status |  | O |  |  |  |
| Repository | Session not found |  |  | O |  |  |
| Security | Non-creator marks other user |  |  |  | O |  |
| Repository | upsert Query Error |  |  |  |  | O |
| Security | Creator marks another user | O |  |  |  |  |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: sessionId (param): Existing Session ID / Invalid UUID |  |  |  |  |  |
| Repository | sessionsRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member |  |  |  |  |  |
| Repository | attendanceRepository.upsert: PRESENT status / Query Error |  |  |  |  |  |
| Security | Membership: Must be group member |  |  |  |  |  |
| Business Rule | Session Status: Must be IN_PROGRESS |  |  |  |  |  |
| Business Rule | Auto Mark: status PRESENT on join |  |  |  |  |  |
| Input (req.body) | Valid sessionId + IN_PROGRESS + member | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Business Rule | session.status !== IN_PROGRESS |  |  | O |  |  |
| Repository | Session not found |  |  | O |  |  |
| Security | Not group member |  |  |  | O |  |
| Repository | upsert Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `listAttendance`

**Service:** Attendance Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: sessionId (param): valid UUID / invalid UUID |  |  |  |  |  |
| Repository | attendanceRepository.findBySession: Returns array (possibly empty) |  |  |  |  |  |
| Repository | attendanceRepository.findBySession: Query Error |  |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  |  |  |  |
| Business Rule | Note: No session-existence check in service |  |  |  |  |  |
| Input (req.body) | Valid sessionId UUID | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | findBySession Query Error |  |  |  |  | O |
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

### Function Code: `listResourceFolders`

**Service:** Resource Folder Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: myGroups (query): true |  |  |  |  |  |
| Input (req.body) | Input: groupId (query): valid UUID |  |  |  |  |  |
| Input (req.body) | Input: page/limit (query): valid / invalid |  |  |  |  |  |
| Input (req.body) | Input: filter: neither groupId nor myGroups |  |  |  |  |  |
| Repository | resourceFoldersRepository.findMany: Success / Query Error |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member (when groupId) |  |  |  |  |  |
| Security | Membership: Required when groupId provided |  |  |  |  |  |
| Business Rule | Filter: myGroups=true → user group membership filter |  |  |  |  |  |
| Business Rule | Filter: else groupId required or badRequest |  |  |  |  |  |
| Input (req.body) | myGroups=true | O |  |  |  |  |
| Input (req.body) | groupId + member | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Business Rule | Missing groupId and myGroups |  |  | O |  |  |
| Security | groupId + not member |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |
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

### Function Code: `getResourceFolderById`

**Service:** Resource Folder Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Folder ID / Invalid UUID |  |  |  |  |  |
| Repository | resourceFoldersRepository.findById: Found / Not Found / Query Error |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member |  |  |  |  |  |
| Security | Membership: Required |  |  |  |  |  |
| Business Rule | Lookup: deletedAt: null filter |  |  |  |  |  |
| Input (req.body) | Valid id + member | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | Folder not found |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `createResourceFolder`

**Service:** Resource Folder Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: groupId (body): valid UUID |  |  |  |  |  |
| Input (req.body) | Input: name (body): valid 1-100 / invalid |  |  |  |  |  |
| Input (req.body) | Input: description (body): optional max 500 |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member |  |  |  |  |  |
| Repository | resourceFoldersRepository.create: Success / Query Error |  |  |  |  |  |
| Security | Membership: Required |  |  |  |  |  |
| Business Rule | Create: createdBy = userId, description trimmed or null |  |  |  |  |  |
| Input (req.body) | Valid payload + member | O |  |  |  |  |
| Input (req.body) | Invalid UUID/name |  | O |  |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |
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

### Function Code: `updateResourceFolder`

**Service:** Resource Folder Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  |  |  |  |
| Input (req.body) | Input: name (body): optional 1-100 |  |  |  |  |  |
| Input (req.body) | Input: description (body): optional max 500 |  |  |  |  |  |
| Repository | resourceFoldersRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member |  |  |  |  |  |
| Repository | groupsRepository.findById: Group for leader check |  |  |  |  |  |
| Repository | resourceFoldersRepository.update: Success / Query Error |  |  |  |  |  |
| Security | Membership: Required |  |  |  |  |  |
| Security | Leader Check: group.createdBy === userId OR role LEADER |  |  |  |  |  |
| Security | Forbidden: Member but not leader |  |  |  |  |  |
| Business Rule | Edit Rule: Only group leaders can edit folders |  |  |  |  |  |
| Input (req.body) | Valid id + leader | O |  |  |  |  |
| Input (req.body) | Invalid UUID/fields |  | O |  |  |  |
| Repository | Folder not found |  |  | O |  |  |
| Security | Not member or not leader |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `listResources`

**Service:** Resource Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: page/limit (query): valid / invalid (defaults) |  |  |  |  |  |
| Input (req.body) | Input: groupId (query): valid UUID / absent |  |  |  |  |  |
| Input (req.body) | Input: folderId (query): valid UUID / absent |  |  |  |  |  |
| Input (req.body) | Input: myGroups (query): true → filter user groups |  |  |  |  |  |
| Repository | resourcesRepository.findMany: Success |  |  |  |  |  |
| Repository | resourcesRepository.count: Success |  |  |  |  |  |
| Repository | resourceFoldersRepository.findById: Found / Not Found (when folderId) |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member |  |  |  |  |  |
| Security | Membership: Required when groupId or folderId set |  |  |  |  |  |
| Business Rule | Filter: folderId → lookup folder + assertMember(folder.groupId) |  |  |  |  |  |
| Business Rule | Filter: groupId → assertMember(groupId) |  |  |  |  |  |
| Business Rule | Filter: No filter → no membership gate |  |  |  |  |  |
| Input (req.body) | Valid query + member | O |  |  |  |  |
| Input (req.body) | Invalid UUID in query |  | O |  |  |  |
| Repository | Folder not found |  |  | O |  |  |
| Security | Not group member |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `getResourceById`

**Service:** Resource Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Resource ID |  |  |  |  |  |
| Input (req.body) | Input: id (param): Invalid UUID |  |  |  |  |  |
| Repository | resourcesRepository.findById: Found / Not Found / Query Error |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member |  |  |  |  |  |
| Security | Membership: assertMember(resource.groupId) |  |  |  |  |  |
| Business Rule | Lookup: deletedAt: null filter in repository |  |  |  |  |  |
| Input (req.body) | Valid UUID + resource exists + member | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | Resource not found |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `createResource`

**Service:** Resource Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: groupId (body): valid UUID |  |  |  |  |  |
| Input (req.body) | Input: folderId (body): valid UUID |  |  |  |  |  |
| Input (req.body) | Input: title (body): valid 2-150 chars |  |  |  |  |  |
| Input (req.body) | Input: fileUrl (body): valid URL |  |  |  |  |  |
| Input (req.body) | Input: fileType (body): non-empty string |  |  |  |  |  |
| Input (req.body) | Input: description (body): optional string |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member |  |  |  |  |  |
| Repository | resourceFoldersRepository.findById: Found matching group / Mismatch / Not Found |  |  |  |  |  |
| Repository | resourcesRepository.create: Success / Query Error |  |  |  |  |  |
| Security | Membership: assertMember(data.groupId) |  |  |  |  |  |
| Business Rule | Folder Validation: folder.groupId === data.groupId |  |  |  |  |  |
| Business Rule | Folder Validation: Mismatch → badRequest Invalid folder for this group |  |  |  |  |  |
| Input (req.body) | All fields valid + folder match | O |  |  |  |  |
| Input (req.body) | Invalid UUID/URL/title/fileType |  | O |  |  |  |
| Business Rule | Folder mismatch or missing |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |
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

### Function Code: `toggleStarResource`

**Service:** Resource Management Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Resource ID / Invalid UUID |  |  |  |  |  |
| Repository | resourcesRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | resourcesRepository.findRating: Existing / None |  |  |  |  |  |
| Repository | resourcesRepository.createRating: Success |  |  |  |  |  |
| Repository | resourcesRepository.deleteRating: Success |  |  |  |  |  |
| Repository | resourcesRepository.createRating: Query Error |  |  |  |  |  |
| Security | Membership: assertMember required |  |  |  |  |  |
| Business Rule | Star Toggle: No existing rating → createRating → starred: true |  |  |  |  |  |
| Business Rule | Star Toggle: Existing rating → deleteRating → starred: false |  |  |  |  |  |
| Input (req.body) | Valid id + member + no rating | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | Resource not found |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | createRating/deleteRating Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
| Return Status | 500 |  |  |  |  | O |
| Return Body | { starred: true } | O |  |  |  |  |
| Return Body | { starred: false } (toggle off) | O |  |  |  |  |
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
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Resource ID / Invalid UUID |  |  |  |  |  |
| Repository | resourcesRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | resourcesRepository.softDelete: Success / Query Error |  |  |  |  |  |
| Repository | notificationsService.notifyUsers: Called when leader deletes uploader resource |  |  |  |  |  |
| Security | Authorization: uploadedBy === userId |  |  |  |  |  |
| Security | Authorization: Group leader (not uploader) |  |  |  |  |  |
| Security | Authorization: Other member → forbidden |  |  |  |  |  |
| Business Rule | Notification: Leader delete → notify uploader |  |  |  |  |  |
| Input (req.body) | Valid id + uploader or leader | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | Resource not found |  |  | O |  |  |
| Security | Neither uploader nor leader |  |  |  | O |  |
| Repository | softDelete/notify Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `listPosts`

**Service:** Discussion Post Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: page/limit (query): valid / default |  |  |  |  |  |
| Input (req.body) | Input: groupId (query): optional UUID / invalid |  |  |  |  |  |
| Input (req.body) | Input: myGroups (query): true / false |  |  |  |  |  |
| Input (req.body) | Input: sortBy (query): createdAt / votes / invalid |  |  |  |  |  |
| Input (req.body) | Input: sortOrder (query): asc / desc |  |  |  |  |  |
| Repository | postsRepository.findMany: Success (createdAt sort) |  |  |  |  |  |
| Repository | postsRepository.findManyForVoteSort: Success (votes sort, up to 500) |  |  |  |  |  |
| Repository | postsRepository.count: Success / Query Error |  |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  |  |  |  |
| Business Rule | Sort: sortBy votes → fetch 500, sortByVoteScore, slice |  |  |  |  |  |
| Business Rule | Filter: myGroups=true → member filter |  |  |  |  |  |
| Input (req.body) | Valid query | O |  |  |  |  |
| Input (req.body) | Invalid groupId/sortBy |  | O |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |
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

### Function Code: `getPostById`

**Service:** Discussion Post Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): Existing Post ID / Invalid UUID |  |  |  |  |  |
| Repository | postsRepository.findById: Found / Not Found / Query Error |  |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  |  |  |  |
| Business Rule | Map: attachVoteMeta + commentCount + isEdited |  |  |  |  |  |
| Input (req.body) | Valid UUID + post exists | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | Post not found |  |  | O |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `createPost`

**Service:** Discussion Post Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: groupId (body): valid UUID |  |  |  |  |  |
| Input (req.body) | Input: title (body): valid 3-200 / invalid |  |  |  |  |  |
| Input (req.body) | Input: content (body): non-empty / missing |  |  |  |  |  |
| Input (req.body) | Input: attachments (body): optional array max 10 with fileUrl/fileName/fileType |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member |  |  |  |  |  |
| Repository | postsRepository.create: Success / Query Error |  |  |  |  |  |
| Security | Membership: Must be group member |  |  |  |  |  |
| Business Rule | Create: authorId = userId, attachments default [] |  |  |  |  |  |
| Input (req.body) | Valid payload + member | O |  |  |  |  |
| Input (req.body) | Invalid fields |  | O |  |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |
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

### Function Code: `updatePost`

**Service:** Discussion Post Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  |  |  |  |
| Input (req.body) | Input: title (body): optional 3-200 |  |  |  |  |  |
| Input (req.body) | Input: content (body): optional non-empty |  |  |  |  |  |
| Repository | postsRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | postsRepository.update: Success / Query Error |  |  |  |  |  |
| Repository | groupsRepository.isMember: Member / Not Member |  |  |  |  |  |
| Security | Author Check: post.authorId === userId |  |  |  |  |  |
| Security | Membership: Required after author check |  |  |  |  |  |
| Business Rule | Validation: !title && !content → badRequest Nothing to update |  |  |  |  |  |
| Business Rule | Update: sets editedAt = new Date() |  |  |  |  |  |
| Input (req.body) | Valid id + author + fields | O |  |  |  |  |
| Input (req.body) | Invalid UUID/fields |  | O |  |  |  |
| Business Rule | Nothing to update |  |  | O |  |  |
| Repository | Post not found |  |  | O |  |  |
| Security | Not author or not member |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  |  |  |  |  |
| Input (req.body) | Input: value (body): 1 (upvote) / -1 (downvote) / invalid |  |  |  |  |  |  |
| Repository | postsRepository.findById: Found / Not Found |  |  |  |  |  |  |
| Repository | postsRepository.removeVote: When same value clicked |  |  |  |  |  |  |
| Repository | postsRepository.upsertVote: New or changed vote |  |  |  |  |  |  |
| Security | Membership: Must be group member |  |  |  |  |  |  |
| Business Rule | Toggle: existing?.value === value → removeVote, userVote null |  |  |  |  |  |  |
| Business Rule | Toggle: else upsertVote, userVote = value |  |  |  |  |  |  |
| Business Rule | Guard: value not in [1,-1] → badRequest (service + validation) |  |  |  |  |  |  |
| Input (req.body) | Valid id + value + member + new vote | O |  |  |  |  |  |
| Input (req.body) | Invalid UUID or value |  | O |  |  |  |  |
| Repository | Post not found |  |  | O |  |  |  |
| Security | Not member |  |  |  | O |  |  |
| Repository | vote Query Error |  |  |  |  | O |  |
| Business Rule | Same value → remove vote |  |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
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
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | UTCID06 |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `removePost`

**Service:** Discussion Post Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  |  |  |  |
| Repository | postsRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | postsRepository.softDelete: Success / Query Error |  |  |  |  |  |
| Security | Author Only: post.authorId === userId |  |  |  |  |  |
| Business Rule | Delete: Author only (no leader/admin branch in code) |  |  |  |  |  |
| Input (req.body) | Valid id + author | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | Post not found |  |  | O |  |  |
| Security | Not author |  |  |  | O |  |
| Repository | softDelete Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `listCommentsByPost`

**Service:** Comment Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: postId (param): valid UUID / invalid |  |  |  |  |  |
| Input (req.body) | Input: sort (query): newest / votes / invalid |  |  |  |  |  |
| Repository | postsRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | commentsRepository.findAllByPostId: Flat list / Query Error |  |  |  |  |  |
| Security | Membership: assertGroupMember required |  |  |  |  |  |
| Business Rule | buildCommentTree from flat comments |  |  |  |  |  |
| Business Rule | Sort: votes → sortByVoteScore desc, else createdAt desc |  |  |  |  |  |
| Input (req.body) | Valid postId + member | O |  |  |  |  |
| Input (req.body) | Invalid UUID/sort |  | O |  |  |  |
| Repository | Post not found |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | findAllByPostId Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `createComment`

**Service:** Comment Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: postId (body): valid UUID |  |  |  |  |  |
| Input (req.body) | Input: content (body): valid 1-2000 / invalid |  |  |  |  |  |
| Input (req.body) | Input: parentCommentId (body): optional UUID |  |  |  |  |  |
| Input (req.body) | Input: mentionedUserIds (body): optional UUID array |  |  |  |  |  |
| Repository | postsRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | commentsRepository.findById (parent): Valid parent / Invalid / wrong postId |  |  |  |  |  |
| Repository | commentsRepository.create: Success / Query Error |  |  |  |  |  |
| Repository | groupsRepository.getMemberUserIds: For mention validation |  |  |  |  |  |
| Security | Membership: assertGroupMember required |  |  |  |  |  |
| Business Rule | Parent: parent must exist AND parent.postId === postId |  |  |  |  |  |
| Business Rule | Mentions: Filtered to group members excluding author |  |  |  |  |  |
| Business Rule | Notifications: Reply + mention notifications |  |  |  |  |  |
| Input (req.body) | Valid content + member + no/valid parent | O |  |  |  |  |
| Input (req.body) | Invalid UUID/content |  | O |  |  |  |
| Repository | Post not found |  |  | O |  |  |
| Business Rule | Invalid parent comment |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 201 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `updateComment`

**Service:** Comment Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  |  |  |  |
| Input (req.body) | Input: content (body): valid 1-2000 / invalid |  |  |  |  |  |
| Repository | commentsRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | commentsRepository.update: Success / Query Error |  |  |  |  |  |
| Security | Author: comment.authorId === userId |  |  |  |  |  |
| Security | Membership: assertGroupMember required |  |  |  |  |  |
| Business Rule | Update: sets editedAt = new Date() |  |  |  |  |  |
| Input (req.body) | Valid id + author + content | O |  |  |  |  |
| Input (req.body) | Invalid UUID/content |  | O |  |  |  |
| Repository | Comment not found |  |  | O |  |  |
| Security | Not author |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |  |
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  |  |  |  |  |
| Input (req.body) | Input: value (body): 1 / -1 / invalid |  |  |  |  |  |  |
| Repository | commentsRepository.findById: Found / Not Found |  |  |  |  |  |  |
| Repository | commentsRepository.findByIdDetailed: For existing vote |  |  |  |  |  |  |
| Repository | commentsRepository.removeVote / upsertVote: Toggle logic |  |  |  |  |  |  |
| Security | Membership: assertGroupMember required |  |  |  |  |  |  |
| Business Rule | Toggle: existingVote === value → remove, else upsert |  |  |  |  |  |  |
| Business Rule | Guard: value not in [1,-1] → badRequest |  |  |  |  |  |  |
| Input (req.body) | Valid vote + member | O |  |  |  |  |  |
| Input (req.body) | Invalid UUID/value |  | O |  |  |  |  |
| Repository | Comment not found |  |  | O |  |  |  |
| Security | Not member |  |  |  | O |  |  |
| Repository | vote Query Error |  |  |  |  | O |  |
| Business Rule | Remove vote (same value) |  |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |  |
| Return Status | 403 |  |  |  | O |  |  |
| Return Status | 404 |  |  | O |  |  |  |
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
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure | UTCID06 |
| Pass/Fail |  |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |  |

---

### Function Code: `removeComment`

**Service:** Comment Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  |  |  |  |
| Repository | commentsRepository.findById: Found / Not Found |  |  |  |  |  |
| Repository | commentsRepository.softDelete: Success / Query Error |  |  |  |  |  |
| Security | Author Only: comment.authorId === userId |  |  |  |  |  |
| Business Rule | Delete: Author only |  |  |  |  |  |
| Input (req.body) | Valid id + author | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | Comment not found |  |  | O |  |  |
| Security | Not author |  |  |  | O |  |
| Repository | softDelete Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `listNotifications`

**Service:** Notification Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: page/limit (query): valid / default |  |  |  |  |  |
| Input (req.body) | Input: unread (query): true → isRead false filter / absent |  |  |  |  |  |
| Repository | notificationsRepository.findMany: Scoped to userId / Query Error |  |  |  |  |  |
| Repository | notificationsRepository.count: Scoped to userId |  |  |  |  |  |
| Security | Scope: All queries scoped to req.user.id |  |  |  |  |  |
| Business Rule | Filter: query.unread === true → where.isRead = false |  |  |  |  |  |
| Input (req.body) | Authenticated + valid query | O |  |  |  |  |
| Input (req.body) | Invalid pagination |  | O |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |
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

### Function Code: `getUnreadCount`

**Service:** Notification Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Repository | notificationsRepository.count: isRead: false / Query Error |  |  |  |  |  |
| Security | Scoped to req.user.id |  |  |  |  |  |
| Security | Authenticated | O |  |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | count Query Error |  |  |  |  | O |
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

### Function Code: `markNotificationRead`

**Service:** Notification Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  |  |  |  |
| Repository | notificationsRepository.markRead: updateMany where id + userId |  |  |  |  |  |
| Repository | notificationsRepository.markRead: Zero rows updated (no error) |  |  |  |  |  |
| Repository | notificationsRepository.markRead: Query Error |  |  |  |  |  |
| Security | Scope: updateMany scoped to matching userId |  |  |  |  |  |
| Business Rule | Note: No error if notification not found for user |  |  |  |  |  |
| Input (req.body) | Valid UUID + belongs to user | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | markRead Query Error |  |  |  |  | O |
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

### Function Code: `markAllNotificationsRead`

**Service:** Notification Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Repository | notificationsRepository.markAllRead: updateMany userId + isRead false |  |  |  |  |  |
| Repository | notificationsRepository.markAllRead: Query Error |  |  |  |  |  |
| Security | Scoped to req.user.id |  |  |  |  |  |
| Security | Authenticated | O |  |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | markAllRead Query Error |  |  |  |  | O |
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

### Function Code: `getStats`

**Service:** Dashboard & Analytics Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Repository | prisma (MEMBER path): groupMember, sessions, resources, attendance aggregates |  |  |  |  |  |
| Repository | prisma (LEADER path): leader groups + session/member stats |  |  |  |  |  |
| Repository | prisma (ADMIN path): platform-wide user/group aggregates |  |  |  |  |  |
| Repository | prisma: Query Error |  |  |  |  |  |
| Security | Role Branch: ADMIN → getAdminStats |  |  |  |  |  |
| Security | Role Branch: LEADER → getLeaderStats |  |  |  |  |  |
| Security | Role Branch: MEMBER → getStudentStats |  |  |  |  |  |
| Business Rule | Response: role field: MEMBER / LEADER / ADMIN |  |  |  |  |  |
| Business Rule | Charts: Role-specific chart data included |  |  |  |  |  |
| Security | user.roles includes ADMIN |  |  | O |  |  |
| Security | user.roles includes LEADER (not ADMIN) |  | O |  |  |  |
| Security | Neither ADMIN nor LEADER | O |  |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | prisma Query Error |  |  |  |  | O |
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
| Type |  | Happy Path | Validation Error | Business Rule Error | Authorization Error | Exception / Dependency Failure |
| Pass/Fail |  |  |  |  |  |  |
| Executed Date |  |  |  |  |  |  |
| Defect ID |  |  |  |  |  |  |

---

### Function Code: `getGroupStats`

**Service:** Dashboard & Analytics Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: groupId (param): valid UUID / invalid / non-existent |  |  |  |  |  |
| Repository | prisma.studyGroup.findFirst: Group Found / Not Found |  |  |  |  |  |
| Repository | prisma.studySession.groupBy: Session stats by status |  |  |  |  |  |
| Repository | prisma.groupMember.findMany: Member growth data |  |  |  |  |  |
| Repository | prisma: Query Error |  |  |  |  |  |
| Security | authorize(ADMIN) route: PASS / FAIL |  |  |  |  |  |
| Security | service check: user.roles includes ADMIN |  |  |  |  |  |
| Business Rule | Charts: sessionStats + memberGrowth cumulative |  |  |  |  |  |
| Input (req.body) | Valid groupId + ADMIN + group exists | O |  |  |  |  |
| Input (req.body) | Invalid UUID |  | O |  |  |  |
| Repository | Group not found |  |  | O |  |  |
| Security | Not ADMIN |  |  |  | O |  |
| Repository | prisma Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

### Function Code: `getCloudinarySignature`

**Service:** File Upload Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  |  |  |  |
| Business Rule | Cloudinary Service: isCloudinaryConfigured = cloudName && apiKey && apiSecret |  |  |  |  |  |
| Business Rule | Cloudinary Service: Not Configured → serviceUnavailable |  |  |  |  |  |
| Business Rule | Cloudinary Service: getUploadSignature returns credentials + folder studyhub/resources |  |  |  |  |  |
| Security | Authenticated + Cloudinary configured | O |  |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Business Rule | Cloudinary not configured |  |  | O |  |  |
| Business Rule | api_sign_request Error |  |  |  |  | O |
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

### Function Code: `listReports`

**Service:** Reports Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: page/limit (query): valid / default |  |  |  |  |  |
| Input (req.body) | Input: status (query): optional filter PENDING/REVIEWED/RESOLVED/DISMISSED |  |  |  |  |  |
| Repository | reportsRepository.findMany: Success / Query Error |  |  |  |  |  |
| Repository | reportsRepository.count: Success |  |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  |  |  |  |
| Security | authorize(ADMIN): PASS / FAIL |  |  |  |  |  |
| Business Rule | Filter: query.status → where.status when present |  |  |  |  |  |
| Security | ADMIN authenticated | O |  |  |  |  |
| Security | Not ADMIN |  |  |  | O |  |
| Security | Not authenticated |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |
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

### Function Code: `createReport`

**Service:** Reports Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: reportedType (body): USER / GROUP / POST / COMMENT / RESOURCE / invalid |  |  |  |  |  |
| Input (req.body) | Input: reportedId (body): non-empty string / empty |  |  |  |  |  |
| Input (req.body) | Input: reason (body): valid 10-500 chars / too short |  |  |  |  |  |
| Repository | reportsRepository.create: Success with reporterId / Query Error |  |  |  |  |  |
| Security | authenticate middleware: PASS / FAIL |  |  |  |  |  |
| Business Rule | Create: reporterId = req.user.id |  |  |  |  |  |
| Input (req.body) | Valid payload + authenticated | O |  |  |  |  |
| Input (req.body) | Invalid reportedType/reason/reportedId |  | O |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |
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

### Function Code: `updateReportStatus`

**Service:** Reports Service

#### Excel Matrix

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|---|---|---|---|---|
| — Condition — |  |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection OK |  |  |  |  |  |
| Precondition | Can connect with server: DB Connection Fail |  |  |  |  |  |
| Precondition | Can connect with server: Prisma Connection Fail |  |  |  |  |  |
| Precondition | JWT Service OK |  |  |  |  |  |
| Precondition | JWT Service Fail |  |  |  |  |  |
| Precondition | bcrypt Service OK |  |  |  |  |  |
| Precondition | bcrypt Service Fail |  |  |  |  |  |
| Precondition | Cloudinary Service OK |  |  |  |  |  |
| Precondition | Cloudinary Service Fail |  |  |  |  |  |
| Precondition | LiveKit Service OK |  |  |  |  |  |
| Precondition | LiveKit Service Fail |  |  |  |  |  |
| Input (req.body) | Input: id (param): valid UUID / invalid |  |  |  |  |  |
| Input (req.body) | Input: status (body): PENDING / REVIEWED / RESOLVED / DISMISSED / invalid |  |  |  |  |  |
| Repository | reportsRepository.update: Report Found / Not Found (null) |  |  |  |  |  |
| Repository | reportsRepository.update: Query Error |  |  |  |  |  |
| Security | authorize(ADMIN): PASS / FAIL |  |  |  |  |  |
| Business Rule | Update: if !report from update → notFound |  |  |  |  |  |
| Input (req.body) | Valid id + status + ADMIN | O |  |  |  |  |
| Input (req.body) | Invalid UUID or status |  | O |  |  |  |
| Repository | Report not found |  |  | O |  |  |
| Security | Not ADMIN |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |
| — Confirm — |  |  |  |  |  |  |
| Return Status | 200 | O |  |  |  |  |
| Return Status | 400 |  | O | O |  |  |
| Return Status | 403 |  |  |  | O |  |
| Return Status | 404 |  |  | O |  |  |
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

