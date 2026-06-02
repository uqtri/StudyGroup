# Decision Tables

> Generated from source code (service, controller, validation, repository, middleware).
> UTCID convention: **UTCID01** = Happy Path | **UTCID02** = Validation Error | **UTCID03** = Business Rule Error | **UTCID04** = Authorization Error | **UTCID05** = Exception / Dependency Failure | Additional UTCIDs for extra branches.


## Module: Auth

### Function Code: `register`

**Service:** Authentication Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: email | valid@email.com |
| Input: email | duplicate@email.com (already registered) |
| Input: email | invalid-email |
| Input: email | null / missing |
| Input: email | empty string |
| Input: password | validPassword123 (8+ chars, uppercase, digit) |
| Input: password | invalid format (missing uppercase/digit/length) |
| Input: password | null / missing |
| Input: password | empty string |
| Input: fullName | valid name (2-100 chars) |
| Input: fullName | invalid length (<2 or >100) |
| Input: fullName | null / missing |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authRepository.findByEmail | User Not Found |
| authRepository.findByEmail | Duplicate User |
| authRepository.findByEmail | Query Error |
| authRepository.findRoleByName(MEMBER) | Role Found |
| authRepository.findRoleByName(MEMBER) | Role Not Found |
| authRepository.createUser | Success |
| authRepository.createUser | Query Error |
| authRepository.createRefreshToken | Success |
| authRepository.createRefreshToken | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| bcrypt.hash | Success |
| bcrypt.hash | Error |
| jwt.sign (access) | Success |
| jwt.sign (access) | Fail |
| jwt.sign (refresh) | Success |
| jwt.sign (refresh) | Fail |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Email Registration | Email Available |
| Email Registration | Email Already Registered |
| Default Role | MEMBER Role Configured |
| Default Role | MEMBER Role Missing |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | All fields valid | O |  |  |  |  |
| Input Validation | Invalid email/password/fullName |  | O |  |  |  |
| Repository | findByEmail: Duplicate User |  |  | O |  |  |
| Repository | findRoleByName: Role Not Found |  |  | O |  |  |
| Repository | createUser/createRefreshToken: Query Error |  |  |  |  | O |
| Repository | findByEmail: User Not Found + Role Found | O |  |  |  |  |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 201 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 409 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| { user, accessToken, refreshToken } | O |  |  |  |  |
| Validation error details |  | O |  |  |  |
| Email already registered |  |  | O |  |  |
| Default role not configured |  |  | O |  |  |
| Internal server error |  |  |  |  | O |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.conflict (Email exists) |  |  | O |  |  |
| ApiError.badRequest (No role) |  |  | O |  |  |
| Prisma/bcrypt/jwt Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Registration successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Conflict: email exists |  |  | O |  |  |
| Default role missing |  |  | O |  |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `login`

**Service:** Authentication Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: email | valid@email.com |
| Input: email | nonexistent@email.com |
| Input: email | invalid-email |
| Input: email | null / missing |
| Input: password | validPassword123 |
| Input: password | wrongPassword |
| Input: password | null / missing |
| Input: password | empty string |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authRepository.findByEmail | User Found |
| authRepository.findByEmail | User Not Found |
| authRepository.findByEmail | Query Error |
| authRepository.createRefreshToken | Success |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| bcrypt.compare | TRUE |
| bcrypt.compare | FALSE |
| bcrypt.compare | Error |
| jwt.sign | Success |
| jwt.sign | Fail |
| User Status | ACTIVE |
| User Status | INACTIVE |
| User Status | SUSPENDED |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Account Status | ACTIVE (login allowed) |
| Account Status | INACTIVE (login denied) |
| Account Status | SUSPENDED (login denied) |
| Credentials | Password Match |
| Credentials | Password Mismatch |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-------------------|---------------|---|---|---|---|---|---|
| Input Validation | Valid email + password | O |  |  |  |  |  |
| Input Validation | Invalid/missing fields |  | O |  |  |  |  |
| Repository | findByEmail: User Not Found |  |  | O |  |  |  |
| Security | user.status: SUSPENDED |  |  |  | O |  |  |
| Security | user.status: INACTIVE |  |  | O |  |  |  |
| Security | user.status: ACTIVE + bcrypt.compare TRUE | O |  |  |  |  |  |
| Security | user.status: ACTIVE + bcrypt.compare FALSE |  |  |  |  |  | O |
| Repository | Query Error |  |  |  |  | O |  |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| 200 | O |  |  |  |  |  |
| 400 |  | O |  |  |  |  |
| 401 |  |  | O |  |  | O |
| 403 |  |  | O | O |  |  |
| 500 |  |  |  |  | O |  |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| { user, accessToken, refreshToken } | O |  |  |  |  |  |
| Validation error |  | O |  |  |  |  |
| Invalid credentials |  |  | O |  |  | O |
| Account banned message |  |  |  | O |  |  |
| Account is not active |  |  | O |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| None | O |  |  |  |  |  |
| ApiError.badRequest |  | O |  |  |  |  |
| ApiError.unauthorized |  |  | O |  |  | O |
| ApiError.forbidden (SUSPENDED) |  |  |  | O |  |  |
| ApiError.forbidden (INACTIVE) |  |  | O |  |  |  |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| Login successful | O |  |  |  |  |  |
| Validation failed |  | O |  |  |  |  |
| Invalid credentials |  |  | O |  |  | O |
| Account banned |  |  |  | O |  |  |

---

### Function Code: `me`

**Service:** Authentication Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| prisma.user.findFirst (auth middleware) | ACTIVE user found |
| prisma.user.findFirst (auth middleware) | null (inactive/deleted) |
| authRepository.findById (service) | User Found |
| authRepository.findById (service) | User Not Found |
| authRepository.findById (service) | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Authorization Bearer token | Present |
| Authorization Bearer token | Absent |
| jwt.verify (access) | Success |
| jwt.verify (access) | Invalid Signature |
| jwt.verify (access) | Expired Token |
| jwt.verify (access) | Error |
| User Status (middleware) | ACTIVE |
| User Status (middleware) | INACTIVE / deletedAt set |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Profile | Controller calls authService.getProfile(req.user.id) |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Security | Token valid + ACTIVE user + findById found | O |  |  |  |  |
| Security | No Bearer token |  |  |  | O |  |
| Security | Invalid/expired JWT |  |  |  | O |  |
| Security | Middleware: user not found or inactive |  |  |  | O |  |
| Repository | findById: User Not Found |  |  | O |  |  |
| Repository | findById Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 401 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Sanitized user profile | O |  |  |  |  |
| Access token required / Invalid token |  |  |  | O |  |
| User not found |  |  | O |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `refresh`

**Service:** Authentication Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: refreshToken (body/cookie) | present valid string |
| Input: refreshToken (body/cookie) | absent / null / empty |
| Input: refreshToken (body/cookie) | invalid JWT string |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authRepository.findRefreshToken | Stored token found with user |
| authRepository.findRefreshToken | Not Found |
| authRepository.findRefreshToken | Query Error |
| stored.expiresAt | >= now |
| stored.expiresAt | < now (expired) |
| authRepository.deleteRefreshToken | Success (rotation) |
| authRepository.createRefreshToken | Success |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| verifyRefreshToken | Success |
| verifyRefreshToken | Invalid Signature |
| verifyRefreshToken | Expired Token |
| verifyRefreshToken | Error |
| stored.user.status | ACTIVE |
| stored.user.status | INACTIVE |
| stored.user.status | SUSPENDED |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Token Rotation | SHA-256 hash before DB lookup |
| Token Rotation | Delete old token, issue new pair on success |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-------------------|---------------|---|---|---|---|---|---|---|
| Input | refreshToken present + valid JWT + stored valid + ACTIVE | O |  |  |  |  |  |  |
| Input Validation | refreshToken not string when provided |  | O |  |  |  |  |  |
| Input | refreshToken absent |  |  | O |  |  |  |  |
| Security | verifyRefreshToken throws |  |  |  | O |  |  |  |
| Repository | stored null or expired |  |  |  |  | O |  |  |
| Security | stored.user.status INACTIVE |  |  |  |  |  | O |  |
| Security | stored.user.status SUSPENDED |  |  |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| 200 | O |  |  |  |  |  |  |
| 400 |  | O |  |  |  |  |  |
| 401 |  |  | O | O | O |  |  |
| 403 |  |  |  |  |  | O | O |
| 500 |  |  |  |  | O |  |  |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| { user, accessToken, refreshToken } | O |  |  |  |  |  |  |
| Refresh token required |  |  | O |  |  |  |  |
| Invalid / expired refresh token |  |  |  | O | O |  |  |
| Account banned / not active |  |  |  |  |  | O | O |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| None | O |  |  |  |  |  |  |
| ApiError.badRequest |  | O |  |  |  |  |  |
| ApiError.unauthorized |  |  | O | O | O |  |  |
| ApiError.forbidden |  |  |  |  |  | O | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |  |  |
| Validation failed |  | O |  |  |  |  |  |
| Business rule rejected |  |  | O |  |  |  |  |
| Authorization denied |  |  |  | O |  |  |  |
| Unhandled exception |  |  |  |  | O |  |  |

---

### Function Code: `logout`

**Service:** Authentication Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: refreshToken (body/cookie) | present |
| Input: refreshToken (body/cookie) | absent |
| Input: req.user.id | present (from authenticate) |
| Input: req.user.id | absent |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authRepository.deleteRefreshToken | Called when refreshToken present |
| authRepository.deleteRefreshToken | Error swallowed (.catch) |
| authRepository.deleteUserRefreshTokens | Called when no token + userId |
| authRepository.deleteUserRefreshTokens | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS |
| authenticate middleware | FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Branch | if (refreshToken) → deleteRefreshToken |
| Branch | else if (userId) → deleteUserRefreshTokens |
| Branch | Always returns true from service |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|-------------------|---------------|---|---|---|---|
| Security | authenticate PASS + refreshToken present | O |  |  |  |
| Security | authenticate PASS + no token + userId |  | O |  |  |
| Security | authenticate PASS + neither token nor userId |  |  | O |  |
| Security | authenticate FAIL |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|---|---|---|---|---|
| 200 | O | O | O |  |
| 401 |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|---|---|---|---|---|
| Logged out successfully | O | O | O |  |
| Unauthorized |  |  |  | O |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|---|---|---|---|---|
| None | O | O | O |  |
| ApiError.unauthorized |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 |
|---|---|---|---|---|
| Logged out successfully | O | O | O |  |
| Auth failed |  |  |  | O |

---


## Module: Users

### Function Code: `listUsers`

**Service:** User Management Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: page (query) | valid int >= 1 / default |
| Input: limit (query) | valid int 1-100 / default |
| Input: search (query) | optional string |
| Input: status (query) | ACTIVE / INACTIVE / SUSPENDED / invalid |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| usersRepository.findMany | Success |
| usersRepository.findMany | Query Error |
| usersRepository.count | Success |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS / FAIL |
| authorize(ADMIN) | PASS / FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Filter | query.status → where.status |
| Filter | query.search → OR fullName/email contains |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Security | ADMIN authenticated + valid query | O |  |  |  |  |
| Input Validation | Invalid status/page/limit |  | O |  |  |  |
| Security | Not authenticated |  |  |  | O |  |
| Security | Not ADMIN |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Paginated users | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `getUserById`

**Service:** User Management Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing User ID |
| Input: id (param) | Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| usersRepository.findById | User Found (deletedAt: null) |
| usersRepository.findById | User Not Found |
| usersRepository.findById | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS / FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Lookup | formatUser maps roles array |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid UUID + user found | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | findById: Not Found |  |  | O |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Formatted user | O |  |  |  |  |
| User not found |  |  | O |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `updateUser`

**Service:** User Management Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | valid UUID |
| Input: fullName (body) | optional 2-100 / invalid |
| Input: bio (body) | optional max 500 / invalid |
| Input: avatar (body) | optional valid URL / invalid |
| Input: requesterId | same as id (self) / different |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| usersRepository.findById (requester) | Found when id !== requesterId |
| usersRepository.update | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Self Update | id === requesterId → allowed |
| Admin Update | requester roles includes ADMIN |
| Forbidden | Non-admin updating other user |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Update Fields | fullName, bio, avatar only |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid fields + self update | O |  |  |  |  |
| Input Validation | Invalid UUID/fields |  | O |  |  |  |
| Security | Admin updates other user | O |  |  |  |  |
| Security | Non-admin updates other |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Updated user | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `setUserStatus`

**Service:** User Management Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing User ID |
| Input: id (param) | Non Existing User ID |
| Input: id (param) | Invalid UUID |
| Input: status (body) | ACTIVE |
| Input: status (body) | INACTIVE |
| Input: status (body) | SUSPENDED |
| Input: status (body) | Invalid Status |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| usersRepository.findById (requester) | Requester Found |
| usersRepository.findById (target) | User Found |
| usersRepository.findById (target) | User Not Found |
| usersRepository.update | Success |
| usersRepository.revokeRefreshTokens | Called on SUSPENDED |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authorize(ADMIN) middleware | PASS |
| authorize(ADMIN) middleware | FAIL |
| requesterIsAdmin (service) | TRUE |
| requesterIsAdmin (service) | FALSE |
| targetIsAdmin | TRUE |
| targetIsAdmin | FALSE |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Self Status Change | id === requesterId (denied) |
| Admin Target | Cannot change admin account status |
| Suspension | SUSPENDED → revokeRefreshTokens |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-------------------|---------------|---|---|---|---|---|---|
| Input Validation | Valid id + status ACTIVE/INACTIVE | O |  |  |  |  |  |
| Input Validation | Invalid UUID or status |  | O |  |  |  |  |
| Security | authorize ADMIN: FAIL |  |  |  | O |  |  |
| Security | requesterIsAdmin: FALSE |  |  |  | O |  |  |
| Business Rule | id === requesterId |  |  | O |  |  |  |
| Repository | findById target: Not Found |  |  | O |  |  |  |
| Business Rule | targetIsAdmin: TRUE |  |  | O |  |  |  |
| Business Rule | status SUSPENDED + all checks pass |  |  |  |  |  | O |
| Repository | Query Error |  |  |  |  | O |  |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| 200 | O |  |  |  |  | O |
| 400 |  | O | O |  |  |  |
| 403 |  |  | O | O |  |  |
| 404 |  |  | O |  |  |  |
| 500 |  |  |  |  | O |  |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| Updated user with new status | O |  |  |  |  | O |
| Validation error |  | O |  |  |  |  |
| Cannot change own/admin status |  |  | O | O |  |  |
| User not found |  |  | O |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| None | O |  |  |  |  | O |
| ApiError.badRequest (validation/self) |  | O | O |  |  |  |
| ApiError.forbidden |  |  | O | O |  |  |
| ApiError.notFound |  |  | O |  |  |  |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| User status updated | O |  |  |  |  | O |
| Refresh tokens revoked (SUSPENDED) |  |  |  |  |  | O |
| Status change rejected |  | O | O | O |  |  |

---

### Function Code: `removeUser`

**Service:** User Management Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | valid UUID / invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| usersRepository.softDelete | Success (deletedAt + status INACTIVE) |
| usersRepository.softDelete | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS / FAIL |
| authorize(ADMIN) | PASS / FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Soft Delete | No explicit not-found check in service |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid UUID + ADMIN | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Security | Not authenticated |  |  |  | O |  |
| Security | Not ADMIN |  |  |  | O |  |
| Repository | softDelete Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| User deactivated (null) | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---


## Module: Groups

### Function Code: `listGroups`

**Service:** Study Group Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: page (query) | valid int >= 1 |
| Input: page (query) | invalid / missing (defaults) |
| Input: limit (query) | valid int 1-100 |
| Input: limit (query) | invalid (defaults/clamped) |
| Input: search (query) | present string |
| Input: search (query) | absent |
| Input: myGroups (query) | true |
| Input: myGroups (query) | false / absent |
| Input: status (query) | ACTIVE / ARCHIVED / DELETED |
| Input: status (query) | invalid value |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.findMany | Success |
| groupsRepository.findMany | Query Error |
| groupsRepository.count | Success |
| groupsRepository.count | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Authentication | Optional (public route) |
| Role Validation | ADMIN sees all statuses |
| Role Validation | Non-admin sees ACTIVE only |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Filter | query.status set → filter by status |
| Filter | !isAdmin && !status → where.status = ACTIVE |
| Filter | myGroups=true + userId → member filter + ACTIVE |
| Filter | search → OR name/subject contains |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid query params | O |  |  |  |  |
| Input Validation | Invalid page/limit/status |  | O |  |  |  |
| Business Rule | Non-admin default ACTIVE filter | O |  |  |  |  |
| Repository | findMany/count Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| { items, pagination } | O |  |  |  |  |
| Validation error |  | O |  |  |  |
| Internal server error |  |  |  |  | O |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `getGroupById`

**Service:** Study Group Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Group ID |
| Input: id (param) | Non Existing Group ID |
| Input: id (param) | Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.findById | Group Found |
| groupsRepository.findById | Group Not Found |
| groupsRepository.findJoinRequest | Pending Request Found |
| groupsRepository.findJoinRequest | No Pending Request |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Role Validation | ADMIN |
| Role Validation | LEADER |
| Role Validation | MEMBER |
| Role Validation | Anonymous (no auth) |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Group Status | ACTIVE |
| Group Status | ARCHIVED (admin visible) |
| Group Status | ARCHIVED (non-admin hidden) |
| Join Request Visibility | Leader sees joinRequests |
| Join Request Visibility | Non-leader joinRequests hidden |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-------------------|---------------|---|---|---|---|---|---|---|
| Input Validation | Valid UUID | O |  |  |  |  | O | O |
| Input Validation | Invalid UUID |  | O |  |  |  |  |  |
| Repository | findById: Group Not Found |  |  | O |  |  |  |  |
| Business Rule | status ACTIVE | O |  |  |  |  |  |  |
| Business Rule | status ARCHIVED + isAdmin |  |  |  |  |  | O |  |
| Business Rule | status ARCHIVED + !isAdmin |  |  |  |  |  |  | O |
| Security | User is LEADER → joinRequests visible | O |  |  |  |  | O |  |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| 200 | O |  |  |  |  | O |  |
| 400 |  | O |  |  |  |  |  |
| 404 |  |  | O |  |  |  | O |
| 500 |  |  |  |  | O |  |  |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| Group details (+ myJoinRequest if pending) | O |  |  |  |  | O |  |
| Validation error |  | O |  |  |  |  |  |
| Group not found |  |  | O |  |  |  | O |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| None | O |  |  |  |  | O |  |
| ApiError.badRequest |  | O |  |  |  |  |  |
| ApiError.notFound |  |  | O |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| Group retrieved | O |  |  |  |  | O |  |
| Group not found (archived hidden) |  |  | O |  |  |  | O |

---

### Function Code: `createGroup`

**Service:** Study Group Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: name (body) | valid 3-100 chars |
| Input: name (body) | invalid length / missing |
| Input: subject (body) | non-empty trimmed string |
| Input: subject (body) | empty / missing |
| Input: description (body) | optional string |
| Input: maxMembers (body) | optional int 2-100 |
| Input: maxMembers (body) | invalid int |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.create | Success (creator as LEADER member) |
| groupsRepository.create | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS |
| authenticate middleware | FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Group Creation | createdBy = userId |
| Group Creation | Auto-add creator as LEADER member |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid name + subject | O |  |  |  |  |
| Input Validation | Invalid name/subject/maxMembers |  | O |  |  |  |
| Security | authenticate: FAIL |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 201 | O |  |  |  |  |
| 400 |  | O |  |  |  |
| 401 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Created group | O |  |  |  |  |
| Validation error |  | O |  |  |  |
| Internal server error |  |  |  |  | O |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `updateGroup`

**Service:** Study Group Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Group ID |
| Input: id (param) | Invalid UUID |
| Input: name (body) | optional valid 3-100 |
| Input: subject (body) | optional non-empty |
| Input: maxMembers (body) | optional int 2-100 |
| Input: status (body) | ACTIVE / ARCHIVED (optional) |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.isMember | LEADER |
| groupsRepository.isMember | Not Member / MEMBER role |
| groupsRepository.update | Success |
| groupsRepository.update | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Role Validation | LEADER required |
| Role Validation | MEMBER → forbidden |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Update Rule | Only group leaders can update |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid UUID + optional fields | O |  |  |  |  |
| Input Validation | Invalid UUID or field values |  | O |  |  |  |
| Security | isMember role !== LEADER |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Updated group | O |  |  |  |  |
| Only group leaders can update |  |  |  | O |  |
| Validation error |  | O |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `setGroupStatus`

**Service:** Study Group Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Group ID |
| Input: id (param) | Invalid UUID |
| Input: status (body) | ACTIVE |
| Input: status (body) | ARCHIVED |
| Input: status (body) | Invalid Status |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.findById | Group Found |
| groupsRepository.findById | Group Not Found |
| groupsRepository.update | Success |
| notificationsService.notifyUsers | Success |
| groupsRepository.update | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authorize(ADMIN) | PASS |
| authorize(ADMIN) | FAIL |
| service isAdmin check | FALSE → forbidden |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Status Change | ARCHIVED → notify "Group banned" |
| Status Change | ACTIVE → notify "Group restored" |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + ACTIVE/ARCHIVED | O |  |  |  |  |
| Input Validation | Invalid UUID or status |  | O |  |  |  |
| Repository | findById: Group Not Found |  |  | O |  |  |
| Security | !isAdmin |  |  |  | O |  |
| Repository | update/notify Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Updated group status | O |  |  |  |  |
| Group not found |  |  | O |  |  |
| Forbidden |  |  |  | O |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `removeGroup`

**Service:** Study Group Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Group ID |
| Input: id (param) | Non Existing Group ID |
| Input: id (param) | Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.findById | Group Found |
| groupsRepository.findById | Group Not Found |
| groupsRepository.softDelete | Success |
| groupsRepository.softDelete | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Authorization | group.createdBy === userId |
| Authorization | isAdmin === true |
| Authorization | Neither creator nor admin → forbidden |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Soft Delete | sets deletedAt via softDelete |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid UUID | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | findById: Not Found |  |  | O |  |  |
| Security | !isAdmin && createdBy !== userId |  |  |  | O |  |
| Repository | softDelete Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Group deleted (null data) | O |  |  |  |  |
| Group not found |  |  | O |  |  |
| Forbidden |  |  |  | O |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `requestJoin`

**Service:** Study Group Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: groupId (param) | Existing Group ID |
| Input: groupId (param) | Non Existing Group ID |
| Input: groupId (param) | Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.findById | Group Found |
| groupsRepository.findById | Group Not Found |
| groupsRepository.findById | Query Error |
| groupsRepository.isMember | Not Member |
| groupsRepository.isMember | Already Member |
| groupsRepository.findJoinRequest | No Pending Request |
| groupsRepository.findJoinRequest | Pending Request Exists |
| groupsRepository.createJoinRequest | Success |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS |
| authenticate middleware | FAIL |
| Role Validation | MEMBER |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Group Status | ACTIVE |
| Group Status | ARCHIVED |
| Group Status | DELETED |
| Join Request | Already Member |
| Join Request | Pending Request Exists |
| Join Request | Group Full |
| Join Request | Group Not Accepting Members |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|-------------------|---------------|---|---|---|---|---|---|---|
| Input Validation | Valid groupId UUID | O |  |  |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |  |  |
| Repository | findById: Group Not Found |  |  | O |  |  |  |  |
| Business Rule | group.status !== ACTIVE |  |  | O |  |  |  |  |
| Business Rule | isMember: Already Member |  |  |  |  |  | O |  |
| Business Rule | findJoinRequest: Pending Exists |  |  |  |  |  |  | O |
| Business Rule | members.length >= maxMembers |  |  | O |  |  |  |  |
| Repository | All checks pass + createJoinRequest | O |  |  |  |  |  |  |
| Security | authenticate: FAIL |  |  |  | O |  |  |  |
| Repository | Query Error |  |  |  |  | O |  |  |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| 201 | O |  |  |  |  |  |  |
| 400 |  | O | O |  |  |  |  |
| 401 |  |  |  | O |  |  |  |
| 404 |  |  | O |  |  |  |  |
| 409 |  |  |  |  |  | O | O |
| 500 |  |  |  |  | O |  |  |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| Join request created | O |  |  |  |  |  |  |
| Validation error |  | O |  |  |  |  |  |
| Group not found / not accepting / full |  |  | O |  |  |  |  |
| Already a member |  |  |  |  |  | O |  |
| Join request already pending |  |  |  |  |  |  | O |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| None | O |  |  |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |  |  |
| ApiError.notFound |  |  | O |  |  |  |  |
| ApiError.badRequest (Full/Not accepting) |  |  | O |  |  |  |  |
| ApiError.conflict |  |  |  |  |  | O | O |
| ApiError.unauthorized |  |  |  | O |  |  |  |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 | UTCID07 |
|---|---|---|---|---|---|---|---|
| Join request submitted | O |  |  |  |  |  |  |
| Validation failed |  | O |  |  |  |  |  |
| Business rule rejected |  |  | O |  |  | O | O |

---

### Function Code: `cancelJoinRequest`

**Service:** Study Group Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id/groupId (param) | Existing Group ID |
| Input: id/groupId (param) | Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.findJoinRequest | Pending Request Found |
| groupsRepository.findJoinRequest | Request Not Found |
| groupsRepository.deleteJoinRequest | Success |
| groupsRepository.deleteJoinRequest | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS |
| authenticate middleware | FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Join Request | status must be PENDING |
| Join Request | status !== PENDING → badRequest |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid groupId UUID | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | findJoinRequest: Not Found |  |  | O |  |  |
| Business Rule | request.status !== PENDING |  |  | O |  |  |
| Security | authenticate: FAIL |  |  |  | O |  |
| Repository | deleteJoinRequest Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Join request cancelled | O |  |  |  |  |
| Join request not found |  |  | O |  |  |
| Only pending join requests can be cancelled |  |  | O |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `approveJoinRequest`

**Service:** Study Group Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: requestId (param) | Existing Request ID |
| Input: requestId (param) | Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.findJoinRequestById | Request Found PENDING |
| groupsRepository.addMember | Success |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Role Validation | LEADER required |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Delegation | calls handleJoinRequest(requestId, APPROVED, userId) |
| Approval | addMember with role MEMBER |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid requestId UUID | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Business Rule | Request not found / not pending |  |  | O |  |  |
| Security | Not leader |  |  |  | O |  |
| Repository | addMember Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Approved join request | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `rejectJoinRequest`

**Service:** Study Group Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: requestId (param) | Existing Request ID |
| Input: requestId (param) | Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.findJoinRequestById | Request Found PENDING |
| groupsRepository.updateJoinRequest | Success REJECTED |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Role Validation | LEADER required |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Delegation | calls handleJoinRequest(requestId, REJECTED, userId) |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-------------------|---------------|---|---|---|---|---|---|
| Input Validation | Valid requestId UUID | O |  |  |  |  | O |
| Input Validation | Invalid UUID |  | O |  |  |  |  |
| Business Rule | Request not pending |  |  | O |  |  |  |
| Security | Not leader |  |  |  | O |  |  |
| Repository | updateJoinRequest Error |  |  |  |  | O |  |
| Business Rule | REJECTED without addMember |  |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| 200 | O |  |  |  |  |  |
| 400 |  | O | O |  |  |  |
| 403 |  |  |  | O |  |  |
| 500 |  |  |  |  | O |  |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| Rejected join request | O |  |  |  |  | O |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| None | O |  |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |  |
| ApiError.notFound |  |  | O |  |  |  |
| ApiError.forbidden |  |  |  | O |  |  |
| Repository/Dependency Error |  |  |  |  | O |  |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |  |
| Validation failed |  | O |  |  |  |  |
| Business rule rejected |  |  | O |  |  |  |
| Authorization denied |  |  |  | O |  |  |
| Unhandled exception |  |  |  |  | O |  |

---

### Function Code: `handleJoinRequest`

**Service:** Study Group Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: requestId (param) | Existing Request ID |
| Input: requestId (param) | Non Existing Request ID |
| Input: requestId (param) | Invalid UUID |
| Input: status (body) | APPROVED |
| Input: status (body) | REJECTED |
| Input: status (body) | Invalid Status |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.findJoinRequestById | Request Found |
| groupsRepository.findJoinRequestById | Request Not Found |
| groupsRepository.isMember | Leader Member |
| groupsRepository.isMember | Not Leader / Not Member |
| groupsRepository.updateJoinRequest | Success |
| groupsRepository.addMember | Success (on APPROVED) |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Role Validation | LEADER |
| Role Validation | MEMBER (non-leader) |
| Role Validation | Unauthorized |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Join Request Status | PENDING |
| Join Request Status | Already Processed |
| Approval Action | APPROVED → addMember |
| Approval Action | REJECTED → update only |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-------------------|---------------|---|---|---|---|---|---|
| Input Validation | Valid requestId + status APPROVED | O |  |  |  |  |  |
| Input Validation | Invalid UUID or status |  | O |  |  |  |  |
| Repository | findJoinRequestById: Not Found |  |  | O |  |  |  |
| Business Rule | request.status !== PENDING |  |  | O |  |  |  |
| Security | isMember role !== LEADER |  |  |  | O |  | O |
| Business Rule | status REJECTED + leader |  |  |  |  |  | O |
| Repository | Query Error |  |  |  |  | O |  |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| 200 | O |  |  |  |  | O |
| 400 |  | O | O |  |  |  |
| 403 |  |  |  | O |  |  |
| 404 |  |  | O |  |  |  |
| 500 |  |  |  |  | O |  |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| Updated join request | O |  |  |  |  | O |
| Validation error |  | O |  |  |  |  |
| Join request not found / no longer pending |  |  | O |  |  |  |
| Forbidden |  |  |  | O |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| None | O |  |  |  |  | O |
| ApiError.badRequest |  | O | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |  |
| ApiError.forbidden |  |  |  | O |  |  |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| Join request approved/rejected | O |  |  |  |  | O |
| Validation/business rejected |  | O | O | O |  |  |

---


## Module: Sessions

### Function Code: `listSessions`

**Service:** Study Session Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: page/limit (query) | valid pagination |
| Input: page/limit (query) | invalid (defaults) |
| Input: groupId (query) | valid UUID / absent |
| Input: groupId (query) | invalid UUID |
| Input: status (query) | SCHEDULED / IN_PROGRESS / COMPLETED / CANCELLED |
| Input: upcoming (query) | true → startTime >= now + SCHEDULED |
| Input: mySessions (query) | true + userId → member filter |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| sessionsRepository.findMany | Success (deletedAt: null) |
| sessionsRepository.findMany | Query Error |
| sessionsRepository.count | Success |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Authentication | Optional (public route) |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Filter | groupId → where.groupId |
| Filter | status → where.status |
| Filter | upcoming=true → startTime gte now + status SCHEDULED |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid query | O |  |  |  |  |
| Input Validation | Invalid groupId UUID |  | O |  |  |  |
| Repository | findMany Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Paginated sessions | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `getSessionById`

**Service:** Study Session Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Session ID |
| Input: id (param) | Non Existing Session ID |
| Input: id (param) | Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| sessionsRepository.findById | Session Found |
| sessionsRepository.findById | Session Not Found |
| sessionsRepository.findById | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Authentication | Optional |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Lookup | if !session → notFound |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid UUID + session exists | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | findById: Not Found |  |  | O |  |  |
| Repository | Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Session details | O |  |  |  |  |
| Session not found |  |  | O |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `createSession`

**Service:** Study Session Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: groupId (body) | valid UUID |
| Input: groupId (body) | invalid / missing |
| Input: title (body) | valid 3-150 chars |
| Input: title (body) | invalid length |
| Input: startNow (body) | true → IN_PROGRESS immediately |
| Input: startNow (body) | false / absent → SCHEDULED |
| Input: startTime (body) | required when !startNow (ISO8601) |
| Input: endTime (body) | required when !startNow (ISO8601) |
| Input: endTime (body) | missing when scheduled → badRequest |
| Input: notifyMembers (body) | true → call notifyMembers |
| Input: meetingLink (body) | optional valid URL |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.isMember | Member |
| groupsRepository.isMember | Not Member |
| sessionsRepository.create | Success |
| sessionsRepository.create | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | Must be group member |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Session Type | startNow → status IN_PROGRESS, endTime null |
| Session Type | scheduled → status SCHEDULED, endTime required |
| Notification | notifyMembers flag triggers notifyMembers |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid payload (scheduled or startNow) | O |  |  |  |  |
| Input Validation | Invalid UUID/title/times |  | O |  |  |  |
| Business Rule | !startNow && !endTime → badRequest |  |  | O |  |  |
| Security | !membership |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 201 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Created session | O |  |  |  |  |
| End time is required for scheduled sessions |  |  | O |  |  |
| Must be a group member |  |  |  | O |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `updateSession`

**Service:** Study Session Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Session ID / Invalid UUID |
| Input: title (body) | optional 3-150 |
| Input: startTime/endTime (body) | optional ISO8601 |
| Input: meetingLink (body) | optional URL |
| Input: status (body) | SCHEDULED / IN_PROGRESS / COMPLETED / CANCELLED |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| sessionsRepository.findById | Found / Not Found |
| sessionsRepository.update | Success / Query Error |
| groupsRepository.isMember | LEADER (via assertCanManageSession) |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| assertCanManageSession | Session creator |
| assertCanManageSession | Group LEADER |
| assertCanManageSession | Other member → forbidden |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Manage Rule | Creator or group LEADER may update |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + fields | O |  |  |  |  |
| Input Validation | Invalid UUID/fields |  | O |  |  |  |
| Repository | Session not found |  |  | O |  |  |
| Security | assertCanManageSession forbidden |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Updated session | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `endSession`

**Service:** Study Session Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Session ID |
| Input: id (param) | Non Existing Session ID |
| Input: id (param) | Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| sessionsRepository.findById | Session Found |
| sessionsRepository.findById | Session Not Found |
| sessionsRepository.update | Success |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| assertCanManageSession | Session Creator |
| assertCanManageSession | Group LEADER |
| assertCanManageSession | Forbidden (other member) |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Session Status | IN_PROGRESS → COMPLETED + deleteLiveKitRoom |
| Session Status | SCHEDULED → CANCELLED |
| Session Status | COMPLETED (already ended) |
| Session Status | CANCELLED (already ended) |
| LiveKit Service | deleteLiveKitRoom Success |
| LiveKit Service | deleteLiveKitRoom Fail |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-------------------|---------------|---|---|---|---|---|---|
| Input Validation | Valid sessionId UUID | O |  |  |  |  | O |
| Input Validation | Invalid UUID |  | O |  |  |  |  |
| Repository | findById: Session Not Found |  |  | O |  |  |  |
| Security | assertCanManageSession: Forbidden |  |  |  | O |  |  |
| Business Rule | status IN_PROGRESS | O |  |  |  |  |  |
| Business Rule | status SCHEDULED |  |  |  |  |  | O |
| Business Rule | status COMPLETED or CANCELLED |  |  | O |  |  |  |
| LiveKit Service | deleteLiveKitRoom Error |  |  |  |  | O |  |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| 200 | O |  |  |  |  | O |
| 400 |  | O | O |  |  |  |
| 403 |  |  |  | O |  |  |
| 404 |  |  | O |  |  |  |
| 500 |  |  |  |  | O |  |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| Updated session (COMPLETED/CANCELLED) | O |  |  |  |  | O |
| Session is already ended |  |  | O |  |  |  |
| Session not found |  |  | O |  |  |  |
| Forbidden |  |  |  | O |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| None | O |  |  |  |  | O |
| ApiError.badRequest (already ended) |  |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |  |
| ApiError.forbidden |  |  |  | O |  |  |
| LiveKit deleteLiveKitRoom Error |  |  |  |  | O |  |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| Session ended | O |  |  |  |  | O |
| Session already ended |  |  | O |  |  |  |
| LiveKit room deleted | O |  |  |  |  |  |

---

### Function Code: `notifyMembers`

**Service:** Study Session Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Session ID / Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| sessionsRepository.findById | Found / Not Found |
| groupsRepository.getMemberUserIds | Member IDs list |
| notificationsService.notifyUsers | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| assertCanManageSession | Creator or LEADER |
| assertCanManageSession | Forbidden |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Notification | Recipients = all members except sender |
| Notification | Title/message/link from session |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid session id | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | Session not found |  |  | O |  |  |
| Security | Not creator/leader |  |  |  | O |  |
| Repository | notifyUsers Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| { notified: count } | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `getLiveKitToken`

**Service:** Study Session Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Session ID |
| Input: id (param) | Non Existing Session ID |
| Input: id (param) | Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| sessionsRepository.findById | Session Found |
| sessionsRepository.findById | Session Not Found |
| groupsRepository.isMember | Member |
| groupsRepository.isMember | Not Member |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS |
| authenticate middleware | FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Session Status | IN_PROGRESS |
| Session Status | SCHEDULED / COMPLETED / CANCELLED |
| LiveKit Service | Configured |
| LiveKit Service | Not Configured |
| LiveKit Service | createLiveKitToken Success |
| LiveKit Service | createLiveKitToken Fail |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid sessionId UUID | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | findById: Session Not Found |  |  | O |  |  |
| Business Rule | session.status !== IN_PROGRESS |  |  | O |  |  |
| Security | isMember: Not Member |  |  |  | O |  |
| Business Rule | LiveKit Not Configured |  |  | O |  | O |
| Business Rule | IN_PROGRESS + member + LiveKit OK | O |  |  |  |  |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| { token, serverUrl, roomName } | O |  |  |  |  |
| Session is not in progress |  |  | O |  |  |
| Must be a group member |  |  |  | O |  |
| LiveKit is not configured |  |  | O |  | O |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest |  | O | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.internal (LiveKit) |  |  | O |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| LiveKit token issued | O |  |  |  |  |
| Session not in progress |  |  | O |  |  |

---

### Function Code: `removeSession`

**Service:** Study Session Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Session ID / Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| sessionsRepository.findById | Found / Not Found |
| sessionsRepository.softDelete | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Authorization | session.createdBy === userId |
| Authorization | Other user → forbidden |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| LiveKit Service | deleteLiveKitRoom before softDelete |
| LiveKit Service | deleteLiveKitRoom Fail |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + creator | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | Session not found |  |  | O |  |  |
| Security | createdBy !== userId |  |  |  | O |  |
| LiveKit/Repository | deleteLiveKitRoom or softDelete Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Session removed | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---


## Module: Attendance

### Function Code: `markAttendance`

**Service:** Attendance Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: sessionId (param) | Existing Session ID / Invalid UUID |
| Input: userId (body) | optional UUID (defaults to req.user.id) |
| Input: status (body) | PRESENT / ABSENT / LATE / EXCUSED / invalid |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| sessionsRepository.findById | Session Found / Not Found |
| attendanceRepository.upsert | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Self Mark | markerId === targetUserId |
| Creator Marks Other | session.createdBy === markerId |
| Forbidden | Non-creator marking others |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Upsert | Sets status + checkedAt = new Date() |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid sessionId + status + self mark | O |  |  |  |  |
| Input Validation | Invalid UUID or status |  | O |  |  |  |
| Repository | Session not found |  |  | O |  |  |
| Security | Non-creator marks other user |  |  |  | O |  |
| Repository | upsert Query Error |  |  |  |  | O |
| Security | Creator marks another user | O |  |  |  |  |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Attendance record | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `recordJoin`

**Service:** Attendance Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: sessionId (param) | Existing Session ID / Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| sessionsRepository.findById | Found / Not Found |
| groupsRepository.isMember | Member / Not Member |
| attendanceRepository.upsert | PRESENT status / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | Must be group member |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Session Status | Must be IN_PROGRESS |
| Auto Mark | status PRESENT on join |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid sessionId + IN_PROGRESS + member | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Business Rule | session.status !== IN_PROGRESS |  |  | O |  |  |
| Repository | Session not found |  |  | O |  |  |
| Security | Not group member |  |  |  | O |  |
| Repository | upsert Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| PRESENT attendance record | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `listAttendance`

**Service:** Attendance Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: sessionId (param) | valid UUID / invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| attendanceRepository.findBySession | Returns array (possibly empty) |
| attendanceRepository.findBySession | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS / FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Note | No session-existence check in service |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid sessionId UUID | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | findBySession Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Attendance array | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---


## Module: Resource Folders

### Function Code: `listResourceFolders`

**Service:** Resource Folder Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: myGroups (query) | true |
| Input: groupId (query) | valid UUID |
| Input: page/limit (query) | valid / invalid |
| Input: filter | neither groupId nor myGroups |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| resourceFoldersRepository.findMany | Success / Query Error |
| groupsRepository.isMember | Member / Not Member (when groupId) |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | Required when groupId provided |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Filter | myGroups=true → user group membership filter |
| Filter | else groupId required or badRequest |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | myGroups=true | O |  |  |  |  |
| Input Validation | groupId + member | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Business Rule | Missing groupId and myGroups |  |  | O |  |  |
| Security | groupId + not member |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Paginated folders | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `getResourceFolderById`

**Service:** Resource Folder Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Folder ID / Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| resourceFoldersRepository.findById | Found / Not Found / Query Error |
| groupsRepository.isMember | Member / Not Member |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | Required |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Lookup | deletedAt: null filter |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + member | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | Folder not found |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Folder details | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `createResourceFolder`

**Service:** Resource Folder Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: groupId (body) | valid UUID |
| Input: name (body) | valid 1-100 / invalid |
| Input: description (body) | optional max 500 |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.isMember | Member / Not Member |
| resourceFoldersRepository.create | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | Required |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Create | createdBy = userId, description trimmed or null |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid payload + member | O |  |  |  |  |
| Input Validation | Invalid UUID/name |  | O |  |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 201 | O |  |  |  |  |
| 400 |  | O |  |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Created folder | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `updateResourceFolder`

**Service:** Resource Folder Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | valid UUID / invalid |
| Input: name (body) | optional 1-100 |
| Input: description (body) | optional max 500 |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| resourceFoldersRepository.findById | Found / Not Found |
| groupsRepository.isMember | Member / Not Member |
| groupsRepository.findById | Group for leader check |
| resourceFoldersRepository.update | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | Required |
| Leader Check | group.createdBy === userId OR role LEADER |
| Forbidden | Member but not leader |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Edit Rule | Only group leaders can edit folders |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + leader | O |  |  |  |  |
| Input Validation | Invalid UUID/fields |  | O |  |  |  |
| Repository | Folder not found |  |  | O |  |  |
| Security | Not member or not leader |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Updated folder | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---


## Module: Resources

### Function Code: `listResources`

**Service:** Resource Management Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: page/limit (query) | valid / invalid (defaults) |
| Input: groupId (query) | valid UUID / absent |
| Input: folderId (query) | valid UUID / absent |
| Input: myGroups (query) | true → filter user groups |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| resourcesRepository.findMany | Success |
| resourcesRepository.count | Success |
| resourceFoldersRepository.findById | Found / Not Found (when folderId) |
| groupsRepository.isMember | Member / Not Member |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | Required when groupId or folderId set |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Filter | folderId → lookup folder + assertMember(folder.groupId) |
| Filter | groupId → assertMember(groupId) |
| Filter | No filter → no membership gate |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid query + member | O |  |  |  |  |
| Input Validation | Invalid UUID in query |  | O |  |  |  |
| Repository | Folder not found |  |  | O |  |  |
| Security | Not group member |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Paginated resources | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `getResourceById`

**Service:** Resource Management Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Resource ID |
| Input: id (param) | Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| resourcesRepository.findById | Found / Not Found / Query Error |
| groupsRepository.isMember | Member / Not Member |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | assertMember(resource.groupId) |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Lookup | deletedAt: null filter in repository |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid UUID + resource exists + member | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | Resource not found |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Resource with star count | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `createResource`

**Service:** Resource Management Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: groupId (body) | valid UUID |
| Input: folderId (body) | valid UUID |
| Input: title (body) | valid 2-150 chars |
| Input: fileUrl (body) | valid URL |
| Input: fileType (body) | non-empty string |
| Input: description (body) | optional string |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.isMember | Member / Not Member |
| resourceFoldersRepository.findById | Found matching group / Mismatch / Not Found |
| resourcesRepository.create | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | assertMember(data.groupId) |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Folder Validation | folder.groupId === data.groupId |
| Folder Validation | Mismatch → badRequest Invalid folder for this group |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | All fields valid + folder match | O |  |  |  |  |
| Input Validation | Invalid UUID/URL/title/fileType |  | O |  |  |  |
| Business Rule | Folder mismatch or missing |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 201 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Created resource | O |  |  |  |  |
| Invalid folder for this group |  |  | O |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `toggleStarResource`

**Service:** Resource Management Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Resource ID / Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| resourcesRepository.findById | Found / Not Found |
| resourcesRepository.findRating | Existing / None |
| resourcesRepository.createRating | Success |
| resourcesRepository.deleteRating | Success |
| resourcesRepository.createRating | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | assertMember required |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Star Toggle | No existing rating → createRating → starred: true |
| Star Toggle | Existing rating → deleteRating → starred: false |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + member + no rating | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | Resource not found |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | createRating/deleteRating Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| { starred: true } | O |  |  |  |  |
| { starred: false } (toggle off) | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `removeResource`

**Service:** Resource Management Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Resource ID / Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| resourcesRepository.findById | Found / Not Found |
| resourcesRepository.softDelete | Success / Query Error |
| notificationsService.notifyUsers | Called when leader deletes uploader resource |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Authorization | uploadedBy === userId |
| Authorization | Group leader (not uploader) |
| Authorization | Other member → forbidden |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Notification | Leader delete → notify uploader |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + uploader or leader | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | Resource not found |  |  | O |  |  |
| Security | Neither uploader nor leader |  |  |  | O |  |
| Repository | softDelete/notify Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Resource removed | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---


## Module: Posts

### Function Code: `listPosts`

**Service:** Discussion Post Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: page/limit (query) | valid / default |
| Input: groupId (query) | optional UUID / invalid |
| Input: myGroups (query) | true / false |
| Input: sortBy (query) | createdAt / votes / invalid |
| Input: sortOrder (query) | asc / desc |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| postsRepository.findMany | Success (createdAt sort) |
| postsRepository.findManyForVoteSort | Success (votes sort, up to 500) |
| postsRepository.count | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS / FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Sort | sortBy votes → fetch 500, sortByVoteScore, slice |
| Filter | myGroups=true → member filter |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid query | O |  |  |  |  |
| Input Validation | Invalid groupId/sortBy |  | O |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Paginated posts with vote meta | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `getPostById`

**Service:** Discussion Post Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | Existing Post ID / Invalid UUID |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| postsRepository.findById | Found / Not Found / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS / FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Map | attachVoteMeta + commentCount + isEdited |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid UUID + post exists | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | Post not found |  |  | O |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Post with votes | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `createPost`

**Service:** Discussion Post Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: groupId (body) | valid UUID |
| Input: title (body) | valid 3-200 / invalid |
| Input: content (body) | non-empty / missing |
| Input: attachments (body) | optional array max 10 with fileUrl/fileName/fileType |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| groupsRepository.isMember | Member / Not Member |
| postsRepository.create | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | Must be group member |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Create | authorId = userId, attachments default [] |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid payload + member | O |  |  |  |  |
| Input Validation | Invalid fields |  | O |  |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 201 | O |  |  |  |  |
| 400 |  | O |  |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Created post | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `updatePost`

**Service:** Discussion Post Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | valid UUID / invalid |
| Input: title (body) | optional 3-200 |
| Input: content (body) | optional non-empty |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| postsRepository.findById | Found / Not Found |
| postsRepository.update | Success / Query Error |
| groupsRepository.isMember | Member / Not Member |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Author Check | post.authorId === userId |
| Membership | Required after author check |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Validation | !title && !content → badRequest Nothing to update |
| Update | sets editedAt = new Date() |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + author + fields | O |  |  |  |  |
| Input Validation | Invalid UUID/fields |  | O |  |  |  |
| Business Rule | Nothing to update |  |  | O |  |  |
| Repository | Post not found |  |  | O |  |  |
| Security | Not author or not member |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Updated post | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `votePost`

**Service:** Discussion Post Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | valid UUID / invalid |
| Input: value (body) | 1 (upvote) / -1 (downvote) / invalid |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| postsRepository.findById | Found / Not Found |
| postsRepository.removeVote | When same value clicked |
| postsRepository.upsertVote | New or changed vote |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | Must be group member |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Toggle | existing?.value === value → removeVote, userVote null |
| Toggle | else upsertVote, userVote = value |
| Guard | value not in [1,-1] → badRequest (service + validation) |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-------------------|---------------|---|---|---|---|---|---|
| Input Validation | Valid id + value + member + new vote | O |  |  |  |  |  |
| Input Validation | Invalid UUID or value |  | O |  |  |  |  |
| Repository | Post not found |  |  | O |  |  |  |
| Security | Not member |  |  |  | O |  |  |
| Repository | vote Query Error |  |  |  |  | O |  |
| Business Rule | Same value → remove vote |  |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| 200 | O |  |  |  |  |  |
| 400 |  | O | O |  |  |  |
| 403 |  |  |  | O |  |  |
| 404 |  |  | O |  |  |  |
| 500 |  |  |  |  | O |  |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| { voteScore, userVote } | O |  |  |  |  | O |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| None | O |  |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |  |
| ApiError.notFound |  |  | O |  |  |  |
| ApiError.forbidden |  |  |  | O |  |  |
| Repository/Dependency Error |  |  |  |  | O |  |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |  |
| Validation failed |  | O |  |  |  |  |
| Business rule rejected |  |  | O |  |  |  |
| Authorization denied |  |  |  | O |  |  |
| Unhandled exception |  |  |  |  | O |  |

---

### Function Code: `removePost`

**Service:** Discussion Post Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | valid UUID / invalid |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| postsRepository.findById | Found / Not Found |
| postsRepository.softDelete | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Author Only | post.authorId === userId |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Delete | Author only (no leader/admin branch in code) |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + author | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | Post not found |  |  | O |  |  |
| Security | Not author |  |  |  | O |  |
| Repository | softDelete Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Post removed | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---


## Module: Comments

### Function Code: `listCommentsByPost`

**Service:** Comment Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: postId (param) | valid UUID / invalid |
| Input: sort (query) | newest / votes / invalid |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| postsRepository.findById | Found / Not Found |
| commentsRepository.findAllByPostId | Flat list / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | assertGroupMember required |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Tree | buildCommentTree from flat comments |
| Sort | votes → sortByVoteScore desc, else createdAt desc |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid postId + member | O |  |  |  |  |
| Input Validation | Invalid UUID/sort |  | O |  |  |  |
| Repository | Post not found |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | findAllByPostId Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Comment tree array | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `createComment`

**Service:** Comment Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: postId (body) | valid UUID |
| Input: content (body) | valid 1-2000 / invalid |
| Input: parentCommentId (body) | optional UUID |
| Input: mentionedUserIds (body) | optional UUID array |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| postsRepository.findById | Found / Not Found |
| commentsRepository.findById (parent) | Valid parent / Invalid / wrong postId |
| commentsRepository.create | Success / Query Error |
| groupsRepository.getMemberUserIds | For mention validation |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | assertGroupMember required |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Parent | parent must exist AND parent.postId === postId |
| Mentions | Filtered to group members excluding author |
| Notifications | Reply + mention notifications |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid content + member + no/valid parent | O |  |  |  |  |
| Input Validation | Invalid UUID/content |  | O |  |  |  |
| Repository | Post not found |  |  | O |  |  |
| Business Rule | Invalid parent comment |  |  | O |  |  |
| Security | Not member |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 201 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Created comment | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `updateComment`

**Service:** Comment Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | valid UUID / invalid |
| Input: content (body) | valid 1-2000 / invalid |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| commentsRepository.findById | Found / Not Found |
| commentsRepository.update | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Author | comment.authorId === userId |
| Membership | assertGroupMember required |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Update | sets editedAt = new Date() |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + author + content | O |  |  |  |  |
| Input Validation | Invalid UUID/content |  | O |  |  |  |
| Repository | Comment not found |  |  | O |  |  |
| Security | Not author |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Updated comment | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `voteComment`

**Service:** Comment Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | valid UUID / invalid |
| Input: value (body) | 1 / -1 / invalid |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| commentsRepository.findById | Found / Not Found |
| commentsRepository.findByIdDetailed | For existing vote |
| commentsRepository.removeVote / upsertVote | Toggle logic |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Membership | assertGroupMember required |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Toggle | existingVote === value → remove, else upsert |
| Guard | value not in [1,-1] → badRequest |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|-------------------|---------------|---|---|---|---|---|---|
| Input Validation | Valid vote + member | O |  |  |  |  |  |
| Input Validation | Invalid UUID/value |  | O |  |  |  |  |
| Repository | Comment not found |  |  | O |  |  |  |
| Security | Not member |  |  |  | O |  |  |
| Repository | vote Query Error |  |  |  |  | O |  |
| Business Rule | Remove vote (same value) |  |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| 200 | O |  |  |  |  |  |
| 400 |  | O | O |  |  |  |
| 403 |  |  |  | O |  |  |
| 404 |  |  | O |  |  |  |
| 500 |  |  |  |  | O |  |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| { voteScore, userVote } | O |  |  |  |  | O |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| None | O |  |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |  |
| ApiError.notFound |  |  | O |  |  |  |
| ApiError.forbidden |  |  |  | O |  |  |
| Repository/Dependency Error |  |  |  |  | O |  |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 | UTCID06 |
|---|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |  |
| Validation failed |  | O |  |  |  |  |
| Business rule rejected |  |  | O |  |  |  |
| Authorization denied |  |  |  | O |  |  |
| Unhandled exception |  |  |  |  | O |  |

---

### Function Code: `removeComment`

**Service:** Comment Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | valid UUID / invalid |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| commentsRepository.findById | Found / Not Found |
| commentsRepository.softDelete | Success / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Author Only | comment.authorId === userId |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Delete | Author only |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + author | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | Comment not found |  |  | O |  |  |
| Security | Not author |  |  |  | O |  |
| Repository | softDelete Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Comment removed | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---


## Module: Notifications

### Function Code: `listNotifications`

**Service:** Notification Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: page/limit (query) | valid / default |
| Input: unread (query) | true → isRead false filter / absent |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| notificationsRepository.findMany | Scoped to userId / Query Error |
| notificationsRepository.count | Scoped to userId |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Scope | All queries scoped to req.user.id |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Filter | query.unread === true → where.isRead = false |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Authenticated + valid query | O |  |  |  |  |
| Input Validation | Invalid pagination |  | O |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Paginated notifications | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `getUnreadCount`

**Service:** Notification Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| notificationsRepository.count | isRead: false / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Scope | Scoped to req.user.id |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Security | Authenticated | O |  |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | count Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| { count: number } | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `markNotificationRead`

**Service:** Notification Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | valid UUID / invalid |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| notificationsRepository.markRead | updateMany where id + userId |
| notificationsRepository.markRead | Zero rows updated (no error) |
| notificationsRepository.markRead | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Scope | updateMany scoped to matching userId |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Note | No error if notification not found for user |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid UUID + belongs to user | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | markRead Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Marked read (success even if 0 rows) | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `markAllNotificationsRead`

**Service:** Notification Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| notificationsRepository.markAllRead | updateMany userId + isRead false |
| notificationsRepository.markAllRead | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Scope | Scoped to req.user.id |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Security | Authenticated | O |  |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | markAllRead Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| All marked read | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---


## Module: Dashboard

### Function Code: `getStats`

**Service:** Dashboard & Analytics Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| prisma (MEMBER path) | groupMember, sessions, resources, attendance aggregates |
| prisma (LEADER path) | leader groups + session/member stats |
| prisma (ADMIN path) | platform-wide user/group aggregates |
| prisma | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Role Branch | ADMIN → getAdminStats |
| Role Branch | LEADER → getLeaderStats |
| Role Branch | MEMBER → getStudentStats |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Response | role field: MEMBER / LEADER / ADMIN |
| Charts | Role-specific chart data included |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Security | user.roles includes ADMIN |  |  | O |  |  |
| Security | user.roles includes LEADER (not ADMIN) |  | O |  |  |  |
| Security | Neither ADMIN nor LEADER | O |  |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | prisma Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O | O | O |  |  |
| 401 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| MEMBER stats payload | O |  |  |  |  |
| LEADER stats payload |  | O |  |  |  |
| ADMIN stats payload |  |  | O |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `getGroupStats`

**Service:** Dashboard & Analytics Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: groupId (param) | valid UUID / invalid / non-existent |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| prisma.studyGroup.findFirst | Group Found / Not Found |
| prisma.studySession.groupBy | Session stats by status |
| prisma.groupMember.findMany | Member growth data |
| prisma | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authorize(ADMIN) route | PASS / FAIL |
| service check | user.roles includes ADMIN |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Charts | sessionStats + memberGrowth cumulative |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid groupId + ADMIN + group exists | O |  |  |  |  |
| Input Validation | Invalid UUID |  | O |  |  |  |
| Repository | Group not found |  |  | O |  |  |
| Security | Not ADMIN |  |  |  | O |  |
| Repository | prisma Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| { charts: sessionStats, memberGrowth } | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---


## Module: Upload

### Function Code: `getCloudinarySignature`

**Service:** File Upload Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS / FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Cloudinary Service | isCloudinaryConfigured = cloudName && apiKey && apiSecret |
| Cloudinary Service | Not Configured → serviceUnavailable |
| Cloudinary Service | getUploadSignature returns credentials + folder studyhub/resources |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Security | Authenticated + Cloudinary configured | O |  |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Business Rule | Cloudinary not configured |  |  | O |  |  |
| Cloudinary Service | api_sign_request Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 401 |  |  |  | O |  |
| 503 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| { cloudName, apiKey, timestamp, signature, folder } | O |  |  |  |  |
| Cloudinary is not configured |  |  | O |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---


## Module: Reports

### Function Code: `listReports`

**Service:** Reports Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: page/limit (query) | valid / default |
| Input: status (query) | optional filter PENDING/REVIEWED/RESOLVED/DISMISSED |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| reportsRepository.findMany | Success / Query Error |
| reportsRepository.count | Success |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS / FAIL |
| authorize(ADMIN) | PASS / FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Filter | query.status → where.status when present |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Security | ADMIN authenticated | O |  |  |  |  |
| Security | Not ADMIN |  |  |  | O |  |
| Security | Not authenticated |  |  |  | O |  |
| Repository | findMany Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Paginated reports | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `createReport`

**Service:** Reports Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: reportedType (body) | USER / GROUP / POST / COMMENT / RESOURCE / invalid |
| Input: reportedId (body) | non-empty string / empty |
| Input: reason (body) | valid 10-500 chars / too short |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| reportsRepository.create | Success with reporterId / Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authenticate middleware | PASS / FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Create | reporterId = req.user.id |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid payload + authenticated | O |  |  |  |  |
| Input Validation | Invalid reportedType/reason/reportedId |  | O |  |  |  |
| Security | authenticate FAIL |  |  |  | O |  |
| Repository | create Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 201 | O |  |  |  |  |
| 400 |  | O |  |  |  |
| 401 |  |  |  | O |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Created report | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

### Function Code: `updateReportStatus`

**Service:** Reports Service

#### 1. Precondition

| Condition Category | Sub Condition |
|-------------------|---------------|
| Can connect with server | DB Connection OK |
| Can connect with server | DB Connection Fail |
| Can connect with server | Prisma Connection Fail |
| JWT Service | JWT Service OK |
| JWT Service | JWT Service Fail |
| bcrypt Service | bcrypt Service OK |
| bcrypt Service | bcrypt Service Fail |
| Cloudinary Service | Cloudinary Service OK |
| Cloudinary Service | Cloudinary Service Fail |
| LiveKit Service | LiveKit Service OK |
| LiveKit Service | LiveKit Service Fail |

#### 2. Input (req.body / req.params / req.query)

| Condition Category | Sub Condition |
|-------------------|---------------|
| Input: id (param) | valid UUID / invalid |
| Input: status (body) | PENDING / REVIEWED / RESOLVED / DISMISSED / invalid |

#### 3. Repository / Database Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| reportsRepository.update | Report Found / Not Found (null) |
| reportsRepository.update | Query Error |

#### 4. Security Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| authorize(ADMIN) | PASS / FAIL |

#### 5. Business Rule Conditions

| Condition Category | Sub Condition |
|-------------------|---------------|
| Update | if !report from update → notFound |

#### Decision Table

| Condition Category | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-------------------|---------------|---|---|---|---|---|
| Input Validation | Valid id + status + ADMIN | O |  |  |  |  |
| Input Validation | Invalid UUID or status |  | O |  |  |  |
| Repository | Report not found |  |  | O |  |  |
| Security | Not ADMIN |  |  |  | O |  |
| Repository | update Query Error |  |  |  |  | O |

#### Confirm: Return Status

| Return Status | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| 200 | O |  |  |  |  |
| 400 |  | O | O |  |  |
| 403 |  |  |  | O |  |
| 404 |  |  | O |  |  |
| 500 |  |  |  |  | O |

#### Confirm: Return Body

| Return Body | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Updated report | O |  |  |  |  |

#### Confirm: Exception

| Exception | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| None | O |  |  |  |  |
| ApiError.badRequest (Validation) |  | O |  |  |  |
| ApiError.notFound |  |  | O |  |  |
| ApiError.forbidden |  |  |  | O |  |
| Repository/Dependency Error |  |  |  |  | O |

#### Confirm: Log Message

| Log Message | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|---|---|---|---|---|---|
| Operation successful | O |  |  |  |  |
| Validation failed |  | O |  |  |  |
| Business rule rejected |  |  | O |  |  |
| Authorization denied |  |  |  | O |  |
| Unhandled exception |  |  |  |  | O |

---

