# PinePods Database API Documentation

## 🎯 Overview

The PinePods Database API is a comprehensive Rust-based Axum application that manages all podcast data, user authentication, settings, and media operations. This API serves as the backbone for the PinePods application ecosystem.

### ✨ Key Features

- **User Management**: Authentication, profiles, preferences, and MFA
- **Podcast Management**: Subscriptions, episodes, playback tracking, and metadata
- **Media Operations**: Downloading, streaming, queueing, and playlist management
- **Sync Integration**: GPodder, Nextcloud, and OIDC providers
- **Administrative Functions**: Server management, backups, and system configuration
- **Real-time Features**: WebSocket support and task progress tracking

---

## 🔑 Authentication Overview

All API endpoints require authentication via API key in the `Api-Key` header, except where noted. API keys are obtained through user credentials and carry the permissions of the associated user account.

### Authentication Types

- **🔓 Open Endpoints**: No authentication required
- **🔐 User API Key**: Standard user authentication required  
- **👑 Admin API Key**: Administrative privileges required

---

## 🔓 OPEN ENDPOINTS (No Authentication Required)

### Health & System Checks

#### GET /api/pinepods_check

**Description:** Simple health check to validate service connectivity and confirm PinePods instance

**Authentication:** 🔓 Open

**Parameters:** None

**Request Example:**
```bash
curl -X GET http://localhost:8000/api/pinepods_check
```

**Response Example:**
```json
{
  "status_code": 200,
  "pinepods_instance": true
}
```

**Error Responses:**
- `500`: Internal Server Error - Service unavailable

**Notes:**
- Used for basic service health monitoring
- Returns quickly with minimal processing
- Confirms this is a PinePods API instance

---

#### GET /api/health

**Description:** Comprehensive health check including database connectivity, Redis status, and system metrics

**Authentication:** 🔓 Open

**Parameters:** None

**Request Example:**
```bash
curl -X GET http://localhost:8000/api/health
```

**Response Example:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T14:30:00Z",
  "version": "1.0.0",
  "database": "connected",
  "redis": "connected",
  "uptime": "2d 14h 32m"
}
```

**Error Responses:**
- `503`: Service Unavailable - One or more components are unhealthy

**Notes:**
- More comprehensive than `/api/pinepods_check`
- Includes dependency status checks
- Useful for monitoring and alerting systems

---

### Authentication & Initial Setup

#### GET /api/data/get_key

**Description:** Retrieve API key using HTTP Basic Authentication (username:password). Creates new API key if none exists for the user.

**Authentication:** 🔓 Open (requires Basic Auth)

**Request Headers:**
```
Authorization: Basic <base64_encoded_username:password>
```

**Parameters:** None

**Request Example:**
```bash
curl -X GET \
  -H "Authorization: Basic $(echo -n 'username:password' | base64)" \
  http://localhost:8000/api/data/get_key
```

**Response Example (No MFA):**
```json
{
  "status": "success",
  "retrieved_key": "pk_1234567890abcdef1234567890abcdef",
  "mfa_required": false,
  "user_id": 123,
  "mfa_session_token": null
}
```

**Response Example (MFA Required):**
```json
{
  "status": "mfa_required", 
  "retrieved_key": null,
  "mfa_required": true,
  "user_id": 123,
  "mfa_session_token": "secure_session_token_12345"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid username/password or missing Authorization header
- `500`: Internal Server Error - Database error

**Notes:**
- Uses HTTP Basic Authentication (RFC 7617)
- If MFA is enabled, returns session token for MFA verification step
- If MFA is disabled, returns API key directly
- Session tokens expire after 5 minutes
- API key permissions match user account level (admin/standard)

---

#### POST /api/data/verify_mfa_and_get_key

**Description:** Complete MFA authentication and receive API key using session token from get_key endpoint

**Authentication:** 🔓 Open (requires MFA session token)

**Request Headers:**
```bash
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "mfa_session_token": "secure_session_token_12345",
  "mfa_code": "123456"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| mfa_session_token | string | Yes | Session token from get_key endpoint when MFA required |
| mfa_code | string | Yes | 6-digit TOTP code from authenticator app |

**Request Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mfa_session_token":"secure_session_token_12345","mfa_code":"123456"}' \
  http://localhost:8000/api/data/verify_mfa_and_get_key
```

**Response Example (Success):**
```json
{
  "status": "success",
  "retrieved_key": "pk_1234567890abcdef1234567890abcdef",
  "verified": true
}
```

**Response Example (Invalid Code):**
```json
{
  "status": "invalid_code",
  "retrieved_key": null,
  "verified": false
}
```

**Response Example (Session Expired):**
```json
{
  "status": "session_expired",
  "retrieved_key": null,
  "verified": false
}
```

**Error Responses:**
- `400`: Bad Request - Missing required fields
- `500`: Internal Server Error - Database error

**Notes:**
- Second step of two-factor authentication flow
- Must use mfa_session_token received from get_key endpoint
- Session tokens expire after 5 minutes
- MFA codes are 6-digit TOTP tokens (30-second window)
- Session token is consumed on successful verification (prevents replay)

---

#### GET /api/data/public_oidc_providers

**Description:** List all publicly available OIDC authentication providers configured on the server

**Authentication:** 🔓 Open

**Parameters:** None

**Request Example:**
```bash
curl -X GET http://localhost:8000/api/data/public_oidc_providers
```

**Response Example:**
```json
{
  "providers": [
    {
      "id": "google",
      "name": "Google",
      "icon_url": "https://accounts.google.com/favicon.ico",
      "login_url": "/api/auth/google/login"
    },
    {
      "id": "github", 
      "name": "GitHub",
      "icon_url": "https://github.com/favicon.ico",
      "login_url": "/api/auth/github/login"
    }
  ]
}
```

**Error Responses:**
- `500`: Internal Server Error - Configuration error

**Notes:**
- Used by login pages to show available SSO options
- Only returns enabled and publicly visible providers
- Icon URLs may be external or proxied through the API

---

#### POST /api/data/create_first

**Description:** Create the first admin user during initial setup. Only works if no admin users exist.

**Authentication:** 🔓 Open (first-time setup only)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullname": "string",
  "username": "string", 
  "email": "string",
  "password": "string"
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "fullname":"Admin User",
    "username":"admin",
    "email":"admin@example.com",
    "password":"securepassword123"
  }' \
  http://localhost:8000/api/data/create_first
```

**Response Example:**
```json
{
  "status": "success",
  "message": "First admin user created successfully",
  "user_id": 1
}
```

**Error Responses:**
- `409`: Conflict - Admin user already exists
- `400`: Bad Request - Invalid input data
- `500`: Internal Server Error - Database error

**Notes:**
- Only available during initial server setup
- Automatically grants admin privileges
- Endpoint becomes unavailable after first admin is created
- Password is automatically hashed and salted

---

#### GET /api/data/self_service_status

**Description:** Check if self-service user registration is enabled on the server

**Authentication:** 🔓 Open

**Parameters:** None

**Request Example:**
```bash
curl -X GET http://localhost:8000/api/data/self_service_status
```

**Response Example:**
```json
{
  "self_service_enabled": true
}
```

**Error Responses:**
- `500`: Internal Server Error - Configuration retrieval error

**Notes:**
- Used by registration pages to show/hide signup forms
- Configuration controlled by admin settings
- When disabled, only admins can create new accounts

---

#### POST /api/auth/store_state

**Description:** Store OIDC authentication state for secure OAuth flow validation

**Authentication:** 🔓 Open

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "state": "string",
  "provider": "string",
  "redirect_url": "string"
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "state":"random_state_string_123",
    "provider":"google",
    "redirect_url":"http://localhost:3000/auth/callback"
  }' \
  http://localhost:8000/api/auth/store_state
```

**Response Example:**
```json
{
  "status": "success",
  "expires_in": 300
}
```

**Error Responses:**
- `400`: Bad Request - Invalid state or provider
- `500`: Internal Server Error - Storage error

**Notes:**
- Part of secure OIDC authentication flow
- State expires after 5 minutes for security
- Used to prevent CSRF attacks in OAuth flow

---

#### GET /api/auth/callback

**Description:** Handle OIDC authentication callback and complete user authentication

**Authentication:** 🔓 Open

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| code | string | Yes | Authorization code from OIDC provider |
| state | string | Yes | State parameter for CSRF protection |

**Request Example:**
```bash
curl -X GET 'http://localhost:8000/api/auth/callback?code=auth_code_123&state=random_state_string_123'
```

**Response Example:**
```json
{
  "status": "success",
  "api_key": "pk_1234567890abcdef1234567890abcdef",
  "user_id": 123,
  "redirect_url": "http://localhost:3000/dashboard"
}
```

**Error Responses:**
- `400`: Bad Request - Invalid or expired state
- `401`: Unauthorized - OIDC authentication failed
- `500`: Internal Server Error - Token exchange error

**Notes:**
- Completes OIDC authentication flow
- Creates user account if first-time login
- Returns API key for subsequent requests
- Handles automatic account linking

---

### Public Configuration

#### GET /api/data/config

**Description:** Retrieve public API configuration information required by clients

**Authentication:** 🔓 Open

**Parameters:** None

**Request Example:**
```bash
curl -X GET http://localhost:8000/api/data/config
```

**Response Example:**
```json
{
  "api_url": "http://localhost:8000/api",
  "search_api_url": "http://localhost:5000/api/search",
  "proxy_url": "http://localhost:8000/api/proxy",
  "websocket_url": "ws://localhost:8000/ws",
  "version": "1.0.0",
  "features": {
    "downloads_enabled": true,
    "guest_access": false,
    "self_service": true,
    "rss_feeds": true
  }
}
```

**Error Responses:**
- `500`: Internal Server Error - Configuration error

**Notes:**
- Used by clients to discover API endpoints
- Feature flags help clients adapt to server configuration
- URLs may include reverse proxy configuration
- Version information helps with client compatibility

---

## 🔐 USER API KEY ENDPOINTS (Standard User Authentication)

### User Profile & Settings

#### GET /api/data/verify_key

**Description:** Verify the validity of an API key

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Parameters:** None

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/verify_key
```

**Response Example:**
```json
{
  "status": "success"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `500`: Internal Server Error - Database error

**Notes:**
- Simple API key validation endpoint
- Returns success if key is valid, error if invalid
- Used for testing API key validity

---

#### GET /api/data/get_user

**Description:** Get user ID associated with the provided API key

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Parameters:** None

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/get_user
```

**Response Example:**
```json
{
  "status": "success",
  "retrieved_id": 123
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `500`: Internal Server Error - Database error

**Notes:**
- Simple endpoint to get user ID from API key
- Commonly used by clients to identify current user
- More lightweight than `/verify_key`

---

#### GET /api/data/user_details_id/*user_id*

**Description:** Get detailed user information by user ID. Users can only access their own details unless they are admin.

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to retrieve details for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/user_details_id/123
```

**Response Example:**
```json
{
  "UserID": 123,
  "Fullname": "John Doe",
  "Username": "johndoe",
  "Email": "john@example.com",
  "Hashed_PW": null,
  "Salt": null
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Access denied to user details (non-admin accessing other users)
- `500`: Internal Server Error - Database error

**Notes:**
- Standard users can only access their own details
- Admin users can access any user's details
- Contains full user profile information

---

#### GET /api/data/get_theme/*user_id*

**Description:** Get the current theme settings for a user. Users can only get their own theme settings.

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get theme for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/get_theme/123
```

**Response Example:**
```json
{
  "theme": "dark"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's theme settings
- `404`: Not Found - User does not exist
- `500`: Internal Server Error - Database error

**Notes:**
- Available themes: "light", "dark", "auto"
- Users can only access their own theme settings
- Theme setting affects UI appearance across all clients

---

#### PUT /api/data/user/set_theme

**Description:** Update the theme preference for a user. Users can only update their own theme.

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "new_theme": "dark"
}
```

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"new_theme":"dark"}' \
  http://localhost:8000/api/data/user/set_theme
```

**Response Example:**
```json
{
  "message": "Theme updated successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot update other user's theme
- `400`: Bad Request - Invalid theme value
- `500`: Internal Server Error - Database error

**Notes:**
- Valid themes: "light", "dark", "auto"
- Changes are applied immediately
- Theme preference is synchronized across all user sessions

---

#### GET /api/data/first_login_done/*user_id*

**Description:** Check if a user has completed their first login setup process

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to check first login status |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/first_login_done/123
```

**Response Example:**
```json
{
  "FirstLogin": false
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot check other user's login status
- `404`: Not Found - User does not exist
- `500`: Internal Server Error - Database error

**Notes:**
- `true` indicates user needs to complete first-time setup
- `false` indicates user has completed setup
- Used to trigger onboarding flows in clients

---

#### GET /api/data/my_user_info/*user_id*

**Description:** Get comprehensive user information for the authenticated user. More detailed than user_details_id.

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID (must match authenticated user) |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/my_user_info/123
```

**Response Example:**
```json
{
  "userid": 123,
  "fullname": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "isadmin": 0
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - User ID does not match authenticated user
- `404`: Not Found - User does not exist
- `500`: Internal Server Error - Database error

**Notes:**
- Only accessible by the user themselves
- Contains all user preferences and settings
- Includes playback preferences and notification settings

---

#### POST /api/data/add_login_user

**Description:** Create a new user account via self-service registration (when self-service is enabled). No authentication required.

**Authentication:** 🔓 Open (No API Key Required)

**Request Headers:**
```bash
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "fullname": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "hash_pw": "$2b$12$abcdef1234567890abcdef1234567890abcdef1234567890"
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "fullname":"John Doe",
    "username":"johndoe",
    "email":"john@example.com",
    "hash_pw":"$2b$12$abcdef1234567890abcdef1234567890abcdef1234567890"
  }' \
  http://localhost:8000/api/data/add_login_user
```

**Response Example:**
```json
{
  "detail": "User added successfully",
  "user_id": 124
}
```

**Error Responses:**
- `403`: Forbidden - Self-service registration is disabled
- `409`: Conflict - Username or email already exists
- `400`: Bad Request - Invalid input data
- `500`: Internal Server Error - Database error

**Notes:**
- Only available when self-service registration is enabled
- `hash_pw` field must contain pre-hashed password (bcrypt recommended)
- New users start with standard privileges (isadmin = false)
- Username and email must be unique
- Username is automatically converted to lowercase

---

#### PUT /api/data/set_fullname/*user_id*

**Description:** Update the full name for a user. Users can update their own name, admins can update any user's name.

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to update |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| new_name | string | Yes | New full name for the user |

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/set_fullname/123?new_name=John%20Smith"
```

**Response Example:**
```json
{
  "detail": "Fullname updated."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot update other user's information (non-admin)
- `404`: Not Found - User does not exist
- `400`: Bad Request - Invalid name format
- `500`: Internal Server Error - Database error

**Notes:**
- Standard users can only update their own full name
- Admin users can update any user's full name
- Name is used in user interface and notifications

---

#### PUT /api/data/set_password/*user_id*

**Description:** Update password for a user. Users can update their own password, admins can update any user's password.

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to update password for |

**Request Body:**
```json
{
  "hash_pw": "$2b$12$abcdef1234567890abcdef1234567890abcdef1234567890"
}
```

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"hash_pw":"$2b$12$abcdef1234567890abcdef1234567890abcdef1234567890"}' \
  http://localhost:8000/api/data/set_password/123
```

**Response Example:**
```json
{
  "detail": "Password updated successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key or current password
- `403`: Forbidden - Cannot update other user's password (non-admin)
- `404`: Not Found - User does not exist
- `400`: Bad Request - Password doesn't meet requirements
- `500`: Internal Server Error - Database error

**Notes:**
- Standard users must provide current password
- Admin users can reset passwords without current password
- New password is automatically hashed and salted
- All existing sessions remain valid

---

#### PUT /api/data/user/set_email

**Description:** Update email address for a user. Users can update their own email, admins can update any user's email.

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "new_email": "newemail@example.com"
}
```

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"new_email":"newemail@example.com"}' \
  http://localhost:8000/api/data/user/set_email
```

**Response Example:**
```json
{
  "detail": "Email updated."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot update other user's email (non-admin)
- `409`: Conflict - Email already exists
- `400`: Bad Request - Invalid email format
- `500`: Internal Server Error - Database error

**Notes:**
- Email must be unique across all users
- Used for password resets and notifications
- Standard users can only update their own email

---

#### PUT /api/data/user/set_username

**Description:** Update username for a user. Users can update their own username, admins can update any user's username.

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "new_username": "newusername"
}
```

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"new_username":"newusername"}' \
  http://localhost:8000/api/data/user/set_username
```

**Response Example:**
```json
{
  "detail": "Username updated."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot update other user's username (non-admin)
- `409`: Conflict - Username already exists
- `400`: Bad Request - Invalid username format

- `500`: Internal Server Error - Database error

**Notes:**
- Username is automatically converted to lowercase
- Username must be unique across all users
- Used for login authentication
- Standard users can only update their own username
- Username changes affect login credentials

---

### Time & Localization Settings

#### POST /api/data/setup_time_info

**Description:** Setup timezone and date/time format preferences for a user. Used during initial user setup.

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "timezone": "America/New_York",
  "hour_pref": 12,
  "date_format": "MM/dd/yyyy"
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"timezone":"America/New_York","hour_pref":12,"date_format":"MM/dd/yyyy"}' \
  http://localhost:8000/api/data/setup_time_info
```

**Response Example:**
```json
{
  "success": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot setup time info for other users (non-admin)
- `400`: Bad Request - Invalid timezone or hour preference
- `500`: Internal Server Error - Database error

**Notes:**
- `hour_pref`: 12 for 12-hour format, 24 for 24-hour format
- Timezone should be a valid IANA timezone identifier
- Used during onboarding and settings updates

---

#### PUT /api/data/update_timezone

**Description:** Update only the timezone setting for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "timezone": "Europe/London"
}
```

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"timezone":"Europe/London"}' \
  http://localhost:8000/api/data/update_timezone
```

**Response Example:**
```json
{
  "success": true,
  "message": "Timezone updated successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot update timezone for other users (non-admin)
- `400`: Bad Request - Invalid timezone format
- `500`: Internal Server Error - Database error

**Notes:**
- Must be a valid IANA timezone identifier
- Affects all timestamp displays in the application
- Changes take effect immediately

---

#### PUT /api/data/update_date_format

**Description:** Update the date format preference for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "date_format": "DD/MM/YYYY"
}
```

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"date_format":"DD/MM/YYYY"}' \
  http://localhost:8000/api/data/update_date_format
```

**Response Example:**
```json
{
  "success": true,
  "message": "Date format updated successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot update date format for other users (non-admin)
- `400`: Bad Request - Invalid date format
- `500`: Internal Server Error - Database error

**Notes:**
- Supported formats: "MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"
- Affects date display throughout the application
- Regional preference setting

---

#### PUT /api/data/update_time_format

**Description:** Update the time format preference (12-hour vs 24-hour) for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "hour_pref": 24
}
```

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"hour_pref":24}' \
  http://localhost:8000/api/data/update_time_format
```

**Response Example:**
```json
{
  "success": true,
  "message": "Time format updated successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot update time format for other users (non-admin)
- `400`: Bad Request - Invalid time format (must be 12 or 24)
- `500`: Internal Server Error - Database error

**Notes:**
- Valid values: 12 (12-hour with AM/PM) or 24 (24-hour format)
- Affects time display throughout the application
- Changes apply immediately to all sessions

---

#### GET /api/data/get_time_info

**Description:** Get current timezone and date/time format settings for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get time info for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_time_info?user_id=123"
```

**Response Example:**
```json
{
  "timezone": "America/New_York",
  "date_format": "MM/DD/YYYY",
  "hour_pref": 12
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `404`: Not Found - Time info not configured
- `500`: Internal Server Error - Database error

**Notes:**
- Returns settings for the authenticated user only
- Used by clients to format dates/times appropriately
- If not configured, returns system defaults

---

#### GET /api/data/get_auto_complete_seconds/*user_id*

**Description:** Get the auto-complete threshold in seconds for episode completion

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get setting for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/get_auto_complete_seconds/123
```

**Response Example:**
```json
{
  "auto_complete_seconds": 30
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's settings (non-admin)
- `404`: Not Found - User does not exist
- `500`: Internal Server Error - Database error

**Notes:**
- Episodes are marked complete if remaining time ≤ this value
- Default is typically 30 seconds
- Used to handle podcast outros and credits

---

#### PUT /api/data/update_auto_complete_seconds

**Description:** Update the auto-complete threshold for episode completion

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "seconds": 45
}
```

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"seconds":45}' \
  http://localhost:8000/api/data/update_auto_complete_seconds
```

**Response Example:**
```json
{
  "success": true,
  "message": "Auto complete seconds updated successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot update other user's settings (non-admin)
- `400`: Bad Request - Invalid seconds value (must be 0-300)
- `500`: Internal Server Error - Database error

**Notes:**
- Valid range: 0-300 seconds (0 disables auto-complete)
- Affects when episodes are automatically marked as completed
- Setting to 0 requires manual completion

---

### Podcast Management

#### POST /api/data/add_podcast

**Description:** Subscribe to a podcast by adding it to the user's subscription list

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "podcast_values": {
    "pod_title": "Tech Talk Podcast",
    "pod_artwork": "https://example.com/artwork.jpg",
    "pod_author": "Tech Host",
    "categories": {},
    "pod_description": "A great tech podcast",
    "pod_episode_count": 100,
    "pod_feed_url": "https://techtalk.example/rss",
    "pod_website": "https://techtalk.example.com",
    "pod_explicit": false,
    "user_id": 123
  },
  "podcast_index_id": 12345
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "podcast_values": {
      "pod_title": "Tech Talk",
      "pod_artwork": "",
      "pod_author": "",
      "categories": {},
      "pod_description": "Tech podcast",
      "pod_episode_count": 0,
      "pod_feed_url": "https://techtalk.example/rss",
      "pod_website": "",
      "pod_explicit": false,
      "user_id": 123
    },
    "podcast_index_id": 12345
  }' \
  http://localhost:8000/api/data/add_podcast
```

**Response Example:**
```json
{
  "success": true,
  "podcast_id": 456,
  "first_episode_id": 789
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot add podcasts for other users (non-admin)
- `409`: Conflict - Podcast already subscribed
- `400`: Bad Request - Invalid feed URL or malformed JSON
- `500`: Internal Server Error - Database or feed parsing error

**Notes:**
- `podcast_values` is an object containing all podcast metadata fields
- `podcast_index_id` is optional - used for PodcastIndex integration
- Feed URL is validated and parsed for episodes on the backend
- Backend overrides client-provided metadata with parsed feed data
- Only adds to user's personal subscription list
- Triggers background fetch of recent episodes

---

#### POST /api/data/remove_podcast

**Description:** Unsubscribe from a podcast by podcast name

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "podcast_name": "Tech Talk Podcast",
  "podcast_url": "https://techtalk.example/rss"
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"podcast_name":"Tech Talk Podcast","podcast_url":"https://techtalk.example/rss"}' \
  http://localhost:8000/api/data/remove_podcast
```

**Response Example:**
```json
{
  "success": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot remove podcasts for other users (non-admin)
- `404`: Not Found - Podcast not found in user's subscriptions
- `500`: Internal Server Error - Database error

**Notes:**
- Removes podcast from user's subscription list only
- Does not delete podcast data or episodes
- Case-sensitive podcast name matching
- Also removes associated queue items and history

---

#### POST /api/data/remove_podcast_id

**Description:** Unsubscribe from a podcast using its unique podcast ID

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "podcast_id": 456,
  "is_youtube": false
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"podcast_id":456,"is_youtube":false}' \
  http://localhost:8000/api/data/remove_podcast_id
```

**Response Example:**
```json
{
  "success": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot remove podcasts for other users (non-admin)
- `404`: Not Found - Podcast not found in user's subscriptions
- `500`: Internal Server Error - Database error

**Notes:**
- More reliable than name-based removal
- Preferred method for programmatic unsubscribing
- Removes all user-specific podcast data (queue, history, saves)

---

#### POST /api/data/remove_podcast_name

**Description:** Alternative endpoint to unsubscribe from a podcast by name (alias for remove_podcast)

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "podcast_name": "Tech Talk Podcast",
  "podcast_url": "https://techtalk.example/rss"
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"podcast_name":"Tech Talk Podcast","podcast_url":"https://techtalk.example/rss"}' \
  http://localhost:8000/api/data/remove_podcast_name
```

**Response Example:**
```json
{
  "success": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot remove podcasts for other users (non-admin)
- `404`: Not Found - Podcast not found in user's subscriptions
- `500`: Internal Server Error - Database error

**Notes:**
- Identical functionality to `/remove_podcast`
- Provided for API consistency and client preference
- Case-sensitive name matching

---

#### GET /api/data/return_pods/*user_id*

**Description:** Get list of podcasts subscribed by a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get podcasts for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/return_pods/123
```

**Response Example:**
```json
{
  "pods": [
    {
      "podcast_id": 456,
      "title": "Tech Talk",
      "description": "Weekly technology discussions",
      "artwork_url": "https://example.com/artwork.jpg",
      "feed_url": "https://techtalk.example/rss",
      "website_url": "https://techtalk.example",
      "author": "John Tech",
      "categories": ["Technology", "News"],
      "last_episode_date": "2024-01-15T10:00:00Z",
      "episode_count": 45,
      "subscribed_date": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's podcasts (non-admin)
- `404`: Not Found - User does not exist
- `500`: Internal Server Error - Database error

**Notes:**
- Returns basic podcast information
- Includes subscription metadata
- Ordered by subscription date (newest first)
- For detailed podcast info, use `/get_podcast_details`

---

#### GET /api/data/return_pods_extra/*user_id*

**Description:** Get detailed list of podcasts with extended metadata including episode counts, last update times, and subscription statistics

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get podcasts for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/return_pods_extra/123
```

**Response Example:**
```json
{
  "pods": [
    {
      "podcast_id": 456,
      "title": "Tech Talk",
      "description": "Weekly technology discussions",
      "artwork_url": "https://example.com/artwork.jpg",
      "feed_url": "https://techtalk.example/rss",
      "website_url": "https://techtalk.example",
      "author": "John Tech",
      "categories": ["Technology", "News"],
      "last_episode_date": "2024-01-15T10:00:00Z",
      "total_episodes": 45,
      "unplayed_episodes": 12,
      "subscribed_date": "2024-01-01T00:00:00Z",
      "last_played": "2024-01-14T15:30:00Z",
      "total_listen_time": 14400,
      "auto_download": true,
      "notifications_enabled": true,
      "feed_cutoff_days": 30
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's podcasts (non-admin)
- `404`: Not Found - User does not exist
- `500`: Internal Server Error - Database error

**Notes:**
- Includes comprehensive podcast statistics
- More resource-intensive than standard `/return_pods`
- Used for detailed podcast management interfaces
- Listen time in seconds

---

#### GET /api/data/check_podcast

**Description:** Check if a specific podcast exists in a user's subscription list

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to check for |
| podcast_name | string | Yes | Name of podcast to check |
| podcast_url | string | Yes | URL of podcast feed to check |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/check_podcast?user_id=123&podcast_name=Tech%20Talk&podcast_url=https://techtalk.example/rss"
```

**Response Example:**
```json
{
  "exists": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot check other user's podcasts (non-admin)
- `400`: Bad Request - Missing required parameters
- `500`: Internal Server Error - Database error

**Notes:**
- Case-sensitive podcast name matching
- Returns podcast ID if found
- Used before subscription attempts to prevent duplicates

---

#### GET /api/data/get_podcast_id

**Description:** Get podcast ID by podcast name for the authenticated user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID |
| podcast_feed | string | Yes | URL of podcast feed |
| podcast_title | string | Yes | Title of podcast |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_podcast_id?user_id=123&podcast_feed=https://techtalk.example/rss&podcast_title=Tech%20Talk"
```

**Response Example:**
```json
{
  "episodes": 456
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's podcasts (non-admin)
- `404`: Not Found - Podcast not found in user's subscriptions
- `500`: Internal Server Error - Database error

**Notes:**
- Must be subscribed to the podcast
- Case-sensitive name matching
- Used for ID-based operations when only name is known

---

#### GET /api/data/get_podcast_id_from_ep_name

**Description:** Get podcast ID from an episode name

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID |
| episode_name | string | Yes | Name of episode |
| episode_url | string | Yes | URL of episode |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_podcast_id_from_ep_name?user_id=123&episode_name=Episode%2042&episode_url=https://example.com/ep42.mp3"
```

**Response Example:**
```json
{
  "podcast_id": 456,
  "episode_id": 789
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's data (non-admin)
- `404`: Not Found - Episode not found
- `500`: Internal Server Error - Database error

**Notes:**
- Searches through user's subscribed podcasts only
- Returns both podcast and episode IDs
- Useful for episode-based operations

---

#### GET /api/data/get_podcast_id_from_ep_id

**Description:** Get podcast ID from an episode ID

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID |
| episode_id | integer | Yes | Episode ID |
| is_youtube | boolean | No | Whether episode is from YouTube |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_podcast_id_from_ep_id?user_id=123&episode_id=789&is_youtube=false"
```

**Response Example:**
```json
{
  "podcast_id": 456
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's data (non-admin)
- `404`: Not Found - Episode not found
- `500`: Internal Server Error - Database error

**Notes:**
- More efficient than name-based lookup
- Episode must be from user's subscribed podcasts
- Used for hierarchical data operations

---

#### GET /api/data/get_podcast_details

**Description:** Get comprehensive details about a specific podcast including recent episodes

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| podcast_id | integer | Yes | Podcast ID |
| user_id | integer | Yes | User ID |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_podcast_details?podcast_id=456&user_id=123"
```

**Response Example:**
```json
{
  "podcast": {
    "podcast_id": 456,
    "title": "Tech Talk",
    "description": "Weekly technology discussions covering the latest trends",
    "artwork_url": "https://example.com/artwork.jpg",
    "feed_url": "https://techtalk.example/rss",
    "website_url": "https://techtalk.example",
    "author": "John Tech",
    "email": "contact@techtalk.example",
    "categories": ["Technology", "News", "Business"],
    "language": "en",
    "explicit": false,
    "total_episodes": 45,
    "last_build_date": "2024-01-15T10:00:00Z",
    "subscribed_date": "2024-01-01T00:00:00Z",
    "auto_download": true,
    "notifications_enabled": true,
    "custom_playback_speed": 1.25
  },
  "recent_episodes": [
    {
      "episode_id": 789,
      "title": "AI Revolution in 2024",
      "description": "Discussion about AI developments",
      "pub_date": "2024-01-15T10:00:00Z",
      "duration": 3600,
      "file_size": 52428800,
      "audio_url": "https://techtalk.example/ep42.mp3",
      "is_played": false,
      "is_saved": true,
      "progress": 0
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access podcast (not subscribed or wrong user)
- `404`: Not Found - Podcast not found
- `500`: Internal Server Error - Database error

**Notes:**
- Must be subscribed to the podcast
- Includes user-specific data (play status, saves, etc.)
- Recent episodes limited to last 10-20 episodes

---

#### GET /api/data/get_podcast_details_dynamic

**Description:** Get dynamic podcast details that can change frequently (episode counts, last update, etc.)

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| podcast_id | integer | Yes | Podcast ID |
| user_id | integer | Yes | User ID |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_podcast_details_dynamic?podcast_id=456&user_id=123"
```

**Response Example:**
```json
{
  "total_episodes": 45,
  "unplayed_episodes": 12,
  "last_episode_date": "2024-01-15T10:00:00Z",
  "last_check": "2024-01-15T12:00:00Z",
  "feed_status": "active",
  "new_episodes_count": 3,
  "total_duration": 162000,
  "average_duration": 3600,
  "last_played_episode": {
    "episode_id": 788,
    "title": "Previous Episode",
    "progress": 0.75
  }
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access podcast (not subscribed or wrong user)
- `404`: Not Found - Podcast not found
- `500`: Internal Server Error - Database error

**Notes:**
- Optimized for frequently changing data
- Lighter weight than full podcast details
- Used for dashboard updates and statistics

---

#### GET /api/data/fetch_podcast_feed

**Description:** Manually trigger a fresh fetch of a podcast's RSS feed

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| podcast_id | integer | Yes | Podcast ID |
| user_id | integer | Yes | User ID |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/fetch_podcast_feed?podcast_id=456&user_id=123"
```

**Response Example:**
```json
{
  "success": true,
  "new_episodes": 2,
  "last_update": "2024-01-15T12:30:00Z",
  "feed_status": "updated"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot refresh podcast (not subscribed or wrong user)
- `404`: Not Found - Podcast not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Feed fetch error

**Notes:**
- Rate limited to prevent abuse
- Updates episode list with new content
- May take several seconds for large feeds
- Triggers background processing for new episodes

---

#### POST /api/data/update_feed_cutoff_days

**Description:** Update the number of days to retain episodes for a specific podcast feed

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "podcast_id": 456,
  "user_id": 123,
  "feed_cutoff_days": 30
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"podcast_id":456,"user_id":123,"feed_cutoff_days":30}' \
  http://localhost:8000/api/data/update_feed_cutoff_days
```

**Response Example:**
```json
{
  "detail": "Feed cutoff days updated successfully!"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot update settings for other users (non-admin)
- `404`: Not Found - Podcast not found in user's subscriptions
- `400`: Bad Request - Invalid cutoff days value (must be 1-365 or 0 for unlimited)
- `500`: Internal Server Error - Database error

**Notes:**
- Controls how many days of episodes to keep available
- 0 means unlimited (keep all episodes)
- Valid range: 0-365 days
- Older episodes may be hidden from episode lists

---

#### GET /api/data/get_feed_cutoff_days

**Description:** Get the current feed cutoff days setting for a podcast

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| podcast_id | integer | Yes | Podcast ID |
| user_id | integer | Yes | User ID |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_feed_cutoff_days?podcast_id=456&user_id=123"
```

**Response Example:**
```json
{
  "podcast_id": 456,
  "user_id": 123,
  "feed_cutoff_days": 30
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's settings (non-admin)
- `404`: Not Found - Podcast not found in user's subscriptions
- `500`: Internal Server Error - Database error

**Notes:**
- Returns current retention setting for the podcast
- Default is typically 30 days
- 0 indicates unlimited retention

---

### Episode Management

#### GET /api/data/return_episodes/*user_id*

**Description:** Get all episodes from user's subscribed podcasts with playback status and metadata

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get episodes for |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | integer | No | Maximum number of episodes to return (default: 50) |
| offset | integer | No | Number of episodes to skip for pagination (default: 0) |
| podcast_id | integer | No | Filter by specific podcast |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/return_episodes/123?limit=20&offset=0"
```

**Response Example:**
```json
{
  "episodes": [
    {
      "episode_id": 789,
      "podcast_id": 456,
      "podcast_title": "Tech Talk",
      "episode_title": "AI Revolution in 2024",
      "description": "Discussion about AI developments this year",
      "pub_date": "2024-01-15T10:00:00Z",
      "duration": 3600,
      "file_size": 52428800,
      "audio_url": "https://techtalk.example/ep42.mp3",
      "artwork_url": "https://techtalk.example/art42.jpg",
      "is_played": false,
      "is_saved": true,
      "is_downloaded": false,
      "progress": 0,
      "last_played": null,
      "play_count": 0
    }
  ],
  "total_count": 245,
  "has_more": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's episodes (non-admin)
- `404`: Not Found - User does not exist
- `500`: Internal Server Error - Database error

**Notes:**
- Returns episodes from all subscribed podcasts by default
- Ordered by publication date (newest first)
- Includes user-specific playback data
- Supports pagination for large episode lists

---

#### GET /api/data/check_episode_in_db/*user_id*

**Description:** Check if a specific episode exists in the database for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| episode_title | string | Yes | Episode title |
| episode_url | string | Yes | Episode audio URL |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/check_episode_in_db/123?episode_url=https%3A//example.com/ep42.mp3"
```

**Response Example:**
```json
{
  "exists": true,
  "episode_id": 789,
  "podcast_id": 456,
  "is_played": false,
  "progress": 0
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's data (non-admin)
- `400`: Bad Request - Missing episode URL
- `500`: Internal Server Error - Database error

**Notes:**
- Primarily uses audio URL for matching
- Returns additional episode metadata if found
- Used to avoid duplicate episode entries

---

#### GET /api/data/podcast_episodes

**Description:** Get all episodes for a specific podcast with user playback data

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| podcast_id | integer | Yes | Podcast ID |
| user_id | integer | Yes | User ID |
| limit | integer | No | Maximum episodes to return (default: 100) |
| offset | integer | No | Pagination offset (default: 0) |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/podcast_episodes?podcast_id=456&user_id=123&limit=50"
```

**Response Example:**
```json
{
  "podcast": {
    "podcast_id": 456,
    "title": "Tech Talk",
    "artwork_url": "https://example.com/artwork.jpg"
  },
  "episodes": [
    {
      "episode_id": 789,
      "title": "AI Revolution in 2024",
      "description": "Comprehensive discussion about AI developments",
      "pub_date": "2024-01-15T10:00:00Z",
      "duration": 3600,
      "file_size": 52428800,
      "audio_url": "https://techtalk.example/ep42.mp3",
      "artwork_url": "https://techtalk.example/art42.jpg",
      "is_played": false,
      "is_saved": true,
      "is_downloaded": false,
      "progress": 0,
      "listen_duration": 0,
      "last_played": null,
      "episode_number": 42,
      "season": 3
    }
  ],
  "total_episodes": 45,
  "has_more": false
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access podcast (not subscribed or wrong user)
- `404`: Not Found - Podcast not found
- `500`: Internal Server Error - Database error

**Notes:**
- Must be subscribed to the podcast
- Episodes ordered by publication date (newest first)
- Includes comprehensive episode and playback metadata
- Supports pagination for podcasts with many episodes

---

#### POST /api/data/get_episode_metadata

**Description:** Get detailed metadata for a specific episode including transcripts and chapter information

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_url": "https://techtalk.example/ep42.mp3",
  "episode_title": "AI Revolution in 2024",
  "user_id": 123
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_url":"https://techtalk.example/ep42.mp3","episode_title":"AI Revolution in 2024","user_id":123}' \
  http://localhost:8000/api/data/get_episode_metadata
```

**Response Example:**
```json
{
  "episode": {
    "episode_id": 789,
    "title": "AI Revolution in 2024",
    "description": "Comprehensive discussion about AI developments",
    "pub_date": "2024-01-15T10:00:00Z",
    "duration": 3600,
    "file_size": 52428800,
    "audio_url": "https://techtalk.example/ep42.mp3",
    "artwork_url": "https://techtalk.example/art42.jpg",
    "transcript_url": "https://techtalk.example/ep42-transcript.json",
    "chapters": [
      {
        "title": "Introduction",
        "start_time": 0,
        "end_time": 300,
        "url": "https://techtalk.example/intro"
      }
    ],
    "people": [
      {
        "name": "John Tech",
        "role": "host",
        "url": "https://johntechbio.example"
      }
    ],
    "funding": [
      {
        "type": "donation",
        "url": "https://donate.techtalk.example",
        "message": "Support our show"
      }
    ]
  }
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access episode (not subscribed or wrong user)
- `404`: Not Found - Episode not found
- `500`: Internal Server Error - Database or parsing error

**Notes:**
- Includes Podcasting 2.0 enhanced metadata when available
- May fetch data from external sources if not cached
- Response time varies based on metadata complexity

---

#### POST /api/data/get_play_episode_details

**Description:** Get episode details optimized for playback, including user progress and related episodes

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_id": 789,
  "user_id": 123
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_id":789,"user_id":123}' \
  http://localhost:8000/api/data/get_play_episode_details
```

**Response Example:**
```json
{
  "episode": {
    "episode_id": 789,
    "title": "AI Revolution in 2024",
    "description": "Comprehensive discussion about AI developments",
    "pub_date": "2024-01-15T10:00:00Z",
    "duration": 3600,
    "audio_url": "https://techtalk.example/ep42.mp3",
    "artwork_url": "https://techtalk.example/art42.jpg",
    "progress": 1200,
    "last_played": "2024-01-14T15:30:00Z",
    "playback_speed": 1.25,
    "auto_skip_intro": 15,
    "auto_skip_outro": 30
  },
  "podcast": {
    "podcast_id": 456,
    "title": "Tech Talk",
    "artwork_url": "https://example.com/artwork.jpg"
  },
  "next_episode": {
    "episode_id": 790,
    "title": "Next Episode Title"
  },
  "previous_episode": {
    "episode_id": 788,
    "title": "Previous Episode Title"
  }
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access episode (not subscribed or wrong user)
- `404`: Not Found - Episode not found
- `500`: Internal Server Error - Database error

**Notes:**
- Optimized for player applications
- Includes user-specific playback preferences
- Provides navigation context (next/previous episodes)
- Updates last accessed timestamp

---

#### GET /api/data/stream/{episode_id}

**Description:** Stream episode audio with optional range support and playback tracking

**Authentication:** 🔐 User API Key (via query parameter)

**Request Headers:**
```
Range: bytes=0-1023 (optional)
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| episode_id | integer | Yes | Episode ID to stream |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| api_key | string | Yes | User API key |
| user_id | integer | Yes | User ID for access control |
| type | string | No | Source type |

**Request Example:**
```bash
curl -X GET \
  -H "Range: bytes=0-" \
  "http://localhost:8000/api/data/stream/789?api_key=pk_1234567890abcdef1234567890abcdef&user_id=123&type=audio"
```

**Response Example:**
```
HTTP/1.1 206 Partial Content
Content-Type: audio/mpeg
Content-Length: 52428800
Content-Range: bytes 0-52428799/52428800
Accept-Ranges: bytes

[Binary audio data]
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access episode (not subscribed or wrong user)
- `404`: Not Found - Episode not found or audio file unavailable
- `416`: Range Not Satisfiable - Invalid range request
- `500`: Internal Server Error - Streaming error

**Notes:**
- Supports HTTP range requests for seeking
- Tracks streaming activity for analytics
- May proxy external audio URLs
- Content-Type varies by audio format

---

#### POST /api/data/mark_episode_completed

**Description:** Mark an episode as completed (fully listened)

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_id": 789,
  "user_id": 123
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_id":789,"user_id":123}' \
  http://localhost:8000/api/data/mark_episode_completed
```

**Response Example:**
```json
{
  "success": true,
  "message": "Episode marked as completed"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot mark episodes for other users (non-admin)
- `404`: Not Found - Episode not found
- `500`: Internal Server Error - Database error

**Notes:**
- Updates play status and completion timestamp
- Increments user's total completed episodes count
- May trigger achievement notifications
- Can be undone with `/mark_episode_uncompleted`

---

#### POST /api/data/mark_episode_uncompleted

**Description:** Mark a previously completed episode as uncompleted (not fully listened)

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_id": 789,
  "user_id": 123,
  "is_youtube": false
}
```

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_id":789,"user_id":123,"is_youtube":false}' \
  http://localhost:8000/api/data/mark_episode_uncompleted
```

**Response Example:**
```json
{
  "detail": "Episode marked as uncompleted."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot mark episodes for other users (non-admin)
- `404`: Not Found - Episode not found
- `500`: Internal Server Error - Database error

**Notes:**
- Reverses completion status
- Updates user statistics
- Preserves playback progress if any
- Used for accidental completions

---

### Bulk Episode Operations

#### POST /api/data/bulk_mark_episodes_completed

**Description:** Mark multiple episodes as completed in a single request

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_ids": [789, 790, 791],
  "user_id": 123,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_ids` | array[integer] | Yes | List of episode IDs to mark as completed |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `is_youtube` | boolean | No | Whether episodes are YouTube videos (default: false) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_ids":[789,790,791],"user_id":123,"is_youtube":false}' \
  http://localhost:8000/api/data/bulk_mark_episodes_completed
```

**Response Example:**
```json
{
  "message": "Successfully marked 3 episodes as completed",
  "processed_count": 3,
  "failed_count": null
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot mark episodes for other users
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Database error

**Notes:**
- User can only mark their own episodes as completed
- Returns processing counts and failure information
- Supports both regular podcast episodes and YouTube videos

---

#### POST /api/data/bulk_save_episodes

**Description:** Save multiple episodes to the user's saved list in a single request

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_ids": [789, 790, 791],
  "user_id": 123,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_ids` | array[integer] | Yes | List of episode IDs to save |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `is_youtube` | boolean | No | Whether episodes are YouTube videos (default: false) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_ids":[789,790,791],"user_id":123,"is_youtube":false}' \
  http://localhost:8000/api/data/bulk_save_episodes
```

**Response Example:**
```json
{
  "message": "Successfully saved 3 episodes",
  "processed_count": 3,
  "failed_count": null
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot save episodes for other users
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Database error

**Notes:**
- User can only save their own episodes
- Returns processing counts and failure information
- Supports both regular podcast episodes and YouTube videos

---

#### POST /api/data/bulk_queue_episodes

**Description:** Add multiple episodes to the user's playback queue in a single request

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_ids": [789, 790, 791],
  "user_id": 123,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_ids` | array[integer] | Yes | List of episode IDs to add to queue |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `is_youtube` | boolean | No | Whether episodes are YouTube videos (default: false) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_ids":[789,790,791],"user_id":123,"is_youtube":false}' \
  http://localhost:8000/api/data/bulk_queue_episodes
```

**Response Example:**
```json
{
  "message": "Successfully queued 3 episodes",
  "processed_count": 3,
  "failed_count": null
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot modify queue for other users
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Database error

**Notes:**
- User can only queue their own episodes
- Returns processing counts and failure information
- Supports both regular podcast episodes and YouTube videos

---

#### POST /api/data/bulk_download_episodes

**Description:** Initiate downloads for multiple episodes in a single request

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_ids": [789, 790, 791],
  "user_id": 123,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_ids` | array[integer] | Yes | List of episode IDs to download |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `is_youtube` | boolean | No | Whether episodes are YouTube videos (default: false) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_ids":[789,790,791],"user_id":123,"is_youtube":false}' \
  http://localhost:8000/api/data/bulk_download_episodes
```

**Response Example:**
```json
{
  "message": "Successfully queued 3 episodes for download",
  "processed_count": 3,
  "failed_count": null
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot download episodes for other users
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Download system error

**Notes:**
- User can only download their own episodes
- Downloads are processed asynchronously via task system
- Skips episodes that are already downloaded
- Supports both regular podcast episodes and YouTube videos

---

#### POST /api/data/bulk_delete_downloaded_episodes

**Description:** Delete downloaded files for multiple episodes in a single request

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_ids": [789, 790, 791],
  "user_id": 123,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_ids` | array[integer] | Yes | List of episode IDs to delete downloads for |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `is_youtube` | boolean | No | Whether episodes are YouTube videos (default: false) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_ids":[789,790,791],"user_id":123,"is_youtube":false}' \
  http://localhost:8000/api/data/bulk_delete_downloaded_episodes
```

**Response Example:**
```json
{
  "message": "Successfully deleted 3 downloaded episodes",
  "processed_count": 3,
  "failed_count": null
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot delete other user's downloads
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - File system error

**Notes:**
- User can only delete their own downloaded episodes
- Only deletes local downloaded files
- Preserves episode metadata and playback progress
- Supports both regular podcast episodes and YouTube videos

---

### Playback & Tracking

#### GET /api/data/user_history/*user_id*

**Description:** Get user's playback history with episode details and timestamps

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get history for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/user_history/123"
```

**Response Example:**
```json
{
  "data": [
    {
      "podcastname": "Tech Talk",
      "episodename": "AI Revolution in 2024",
      "episodeartwork": "https://example.com/artwork.jpg",
      "episodeurl": "https://techtalk.example/ep42.mp3",
      "episodepubdate": "2024-01-15T14:30:00Z",
      "episodeduration": 3600,
      "listenduration": 1800,
      "episodeid": 789,
      "completed": false,
      "listendate": "2024-01-15T15:00:00Z",
      "is_youtube": false
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's history (non-admin)
- `404`: Not Found - User does not exist
- `500`: Internal Server Error - Database error

**Notes:**
- Ordered by most recent listen date first
- Includes partial and completed listening sessions
- Listen duration in seconds
- Used for "Continue Listening" features

---

#### PUT /api/data/increment_listen_time/*user_id*

**Description:** Increment the total listening time counter for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to increment time for |

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/increment_listen_time/123"
```

**Response Example:**
```json
{
  "detail": "Listen time incremented."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot update other user's stats
- `500`: Internal Server Error - Database error

**Notes:**
- User can only increment their own listen time
- Used for tracking user engagement
- Called periodically during playback

---

#### PUT /api/data/increment_played/*user_id*

**Description:** Increment the total episode play count for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to increment count for |

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/increment_played/123
```

**Response Example:**
```json
{
  "detail": "Played count incremented."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot update other user's stats
- `500`: Internal Server Error - Database error

**Notes:**
- User can only increment their own play count
- Called when user starts playing an episode
- Used for user statistics and recommendations

---

#### POST /api/data/record_podcast_history

**Description:** Record detailed playback session including position and context

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_id": 789,
  "user_id": 123,
  "episode_pos": 1200.5,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_id` | integer | Yes | ID of the episode to record history for |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `episode_pos` | float | Yes | Current playback position in seconds |
| `is_youtube` | boolean | Yes | Whether episode is a YouTube video |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_id":789,"user_id":123,"episode_pos":1200.5,"is_youtube":false}' \
  http://localhost:8000/api/data/record_podcast_history
```

**Response Example:**
```json
{
  "detail": "History recorded successfully."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot record history for other users
- `500`: Internal Server Error - Database error

**Notes:**
- Position stored as float for precise seeking
- User can only record their own history
- Used for resume playback functionality
- Supports both regular podcast episodes and YouTube videos

---

#### POST /api/data/record_listen_duration

**Description:** Record the actual listening duration for a specific episode session

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_id": 789,
  "user_id": 123,
  "listen_duration": 1800.0,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_id` | integer | Yes | ID of the episode |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `listen_duration` | float | Yes | Duration listened in seconds |
| `is_youtube` | boolean | No | Whether episode is YouTube video (default: false) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_id":789,"user_id":123,"listen_duration":1800.0,"is_youtube":false}' \
  http://localhost:8000/api/data/record_listen_duration
```

**Response Example:**
```json
{
  "detail": "Listen duration recorded successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot record duration for other users
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Database error

**Notes:**
- Duration in seconds (supports decimals)
- User can only record their own listen duration
- Episode ID 0 is ignored (no duration recorded)
- May auto-complete episodes based on user's auto-complete settings
- Supports both regular podcast episodes and YouTube videos

---

#### POST /api/data/get_playback_speed

**Description:** Get the user's default or podcast-specific playback speed setting

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "podcast_id": 456
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `podcast_id` | integer | No | Podcast ID for podcast-specific speed |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"podcast_id":456}' \
  http://localhost:8000/api/data/get_playback_speed
```

**Response Example:**
```json
{
  "playback_speed": 1.25
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's settings
- `500`: Internal Server Error - Database error

**Notes:**
- Returns podcast-specific speed if podcast_id provided and set
- Returns user's default speed if no podcast_id or no podcast-specific speed
- User can only get their own playback speed
- Used by player applications for playback control

---

#### POST /api/data/user/set_playback_speed

**Description:** Set the user's default playback speed for all podcasts

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "playback_speed": 1.25
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `playback_speed` | float | Yes | Playback speed (0.5 to 3.0) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"playback_speed":1.25}' \
  http://localhost:8000/api/data/user/set_playback_speed
```

**Response Example:**
```json
{
  "detail": "Default playback speed updated."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot modify other user's settings
- `400`: Bad Request - Invalid playback speed value
- `500`: Internal Server Error - Database error

**Notes:**
- User can only modify their own playback speed
- This becomes the default for all podcasts unless overridden
- Affects all new podcast subscriptions

---

#### POST /api/data/podcast/set_playback_speed

**Description:** Set a podcast-specific playback speed that overrides the user's default

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "podcast_id": 456,
  "playback_speed": 1.5
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `podcast_id` | integer | Yes | Podcast ID to set speed for |
| `playback_speed` | float | Yes | Playback speed (0.5 to 3.0) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"podcast_id":456,"playback_speed":1.5}' \
  http://localhost:8000/api/data/podcast/set_playback_speed
```

**Response Example:**
```json
{
  "detail": "Default podcast playback speed updated."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's settings
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Database error

**Notes:**
- User can only modify their own podcast settings
- Overrides user's default speed for this specific podcast
- Useful for podcasts with different pacing
- Only affects the specified podcast

---

## 💾 Saved Episodes

Saved Episodes endpoints allow users to save episodes for later listening, creating a personal collection of episodes they want to revisit.

---

#### POST /api/data/save_episode

**Description:** Save an episode to the user's saved episodes list for later listening

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_id": 789,
  "user_id": 123,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_id` | integer | Yes | ID of the episode to save |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `is_youtube` | boolean | Yes | Whether episode is a YouTube video |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_id":789,"user_id":123,"is_youtube":false}' \
  http://localhost:8000/api/data/save_episode
```

**Response Example:**
```json
{
  "detail": "Episode saved!"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot save episodes for other users
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Database error

**Notes:**
- User can only save episodes for themselves
- YouTube videos display "Video saved!" message
- Regular episodes display "Episode saved!" message

---

#### POST /api/data/remove_saved_episode

**Description:** Remove an episode from the user's saved episodes list

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_id": 789,
  "user_id": 123,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_id` | integer | Yes | ID of the episode to remove from saved list |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `is_youtube` | boolean | Yes | Whether episode is a YouTube video |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_id":789,"user_id":123,"is_youtube":false}' \
  http://localhost:8000/api/data/remove_saved_episode
```

**Response Example:**
```json
{
  "detail": "Saved episode removed."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot remove other users' saved episodes
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Database error

**Notes:**
- User can only remove their own saved episodes
- YouTube videos display "Saved video removed." message
- Regular episodes display "Saved episode removed." message

---

#### GET /api/data/saved_episode_list/*user_id*

**Description:** Get all saved episodes for a specific user with episode details and metadata

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to get saved episodes for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/saved_episode_list/123"
```

**Response Example:**
```json
{
  "saved_episodes": [
    {
      "episodetitle": "AI Revolution in 2024",
      "podcastname": "Tech Talk",
      "episodeartwork": "https://example.com/artwork.jpg",
      "episodeurl": "https://techtalk.example/ep42.mp3",
      "episodepubdate": "2024-01-15T14:30:00Z",
      "episodeduration": 3600,
      "listenduration": 1800,
      "episodeid": 789,
      "completed": false,
      "saved": true,
      "queued": false,
      "downloaded": false,
      "is_youtube": false
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' saved episodes
- `500`: Internal Server Error - Database error

**Notes:**
- User can only access their own saved episodes
- Returns comprehensive episode metadata including status flags
- Supports both regular podcast episodes and YouTube videos
- Used for displaying saved episodes library

---

## 📥 Downloads

Downloads endpoints allow users to download episodes for offline listening, manage downloaded content, and configure automatic download settings.

---

#### POST /api/data/download_podcast

**Description:** Download a single episode for offline listening

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_id": 789,
  "user_id": 123,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_id` | integer | Yes | ID of the episode to download |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `is_youtube` | boolean | No | Whether episode is YouTube video (default: false) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_id":789,"user_id":123,"is_youtube":false}' \
  http://localhost:8000/api/data/download_podcast
```

**Response Example:**
```json
{
  "detail": "Podcast episode download has been queued and will process in the background.",
  "task_id": "task_456"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot download content for other users
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Download system error

**Notes:**
- User can only download content for themselves
- Returns "Content already downloaded." if episode is already downloaded
- Downloads are processed asynchronously via task system
- Task ID provided for tracking download progress

---

#### POST /api/data/delete_episode

**Description:** Delete a downloaded episode to free up storage space

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "episode_id": 789,
  "user_id": 123,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_id` | integer | Yes | ID of the episode to delete |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `is_youtube` | boolean | No | Whether episode is YouTube video (default: false) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_id":789,"user_id":123,"is_youtube":false}' \
  http://localhost:8000/api/data/delete_episode
```

**Response Example:**
```json
{
  "detail": "Episode deleted successfully."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot delete other users' downloads
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - File system error

**Notes:**
- User can only delete their own downloads
- YouTube videos display "Video deleted successfully." message
- Removes downloaded file from storage
- Episode metadata and progress are preserved

---

#### POST /api/data/download_all_podcast

**Description:** Download all episodes of a specific podcast for offline listening

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "podcast_id": 456,
  "user_id": 123,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `podcast_id` | integer | Yes | ID of the podcast to download all episodes |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `is_youtube` | boolean | No | Whether podcast is YouTube channel (default: false) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"podcast_id":456,"user_id":123,"is_youtube":false}' \
  http://localhost:8000/api/data/download_all_podcast
```

**Response Example:**
```json
{
  "detail": "All Podcast downloads have been queued and will process in the background.",
  "task_id": "task_789"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot download content for other users
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Download system error

**Notes:**
- User can only download content for themselves
- YouTube channels display "All YouTube channel downloads have been queued..." message
- Downloads are processed asynchronously via task system
- Task ID provided for tracking bulk download progress

---

#### GET /api/data/download_episode_list

**Description:** Get list of all downloaded episodes for a user with detailed metadata

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to get downloaded episodes for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/download_episode_list?user_id=123"
```

**Response Example:**
```json
{
  "downloaded_episodes": [
    {
      "podcastid": 456,
      "podcastname": "Tech Talk",
      "artworkurl": "https://example.com/podcast-artwork.jpg",
      "episodeid": 789,
      "episodetitle": "AI Revolution in 2024",
      "episodepubdate": "2024-01-15T14:30:00Z",
      "episodedescription": "Deep dive into AI developments...",
      "episodeartwork": "https://example.com/episode-artwork.jpg",
      "episodeurl": "https://techtalk.example/ep42.mp3",
      "episodeduration": 3600,
      "podcastindexid": 12345,
      "websiteurl": "https://techtalk.example",
      "downloadedlocation": "/downloads/789.mp3",
      "listenduration": 1800,
      "completed": false,
      "is_youtube": false
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' downloads
- `400`: Bad Request - Invalid user_id parameter
- `500`: Internal Server Error - Database error

**Notes:**
- User can only access their own downloaded episodes
- Returns comprehensive metadata including download location
- Supports both regular podcast episodes and YouTube videos
- Used for displaying offline content library

---

#### GET /api/data/download_status/*user_id*

**Description:** Get download status and statistics for a specific user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to get download status for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/download_status/123"
```

**Response Example:**
```json
{
  "total_downloaded": 45,
  "total_size_mb": 2048,
  "downloads_enabled": true,
  "active_downloads": 2
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' download status
- `500`: Internal Server Error - Database error

**Notes:**
- User can only get their own download status
- Returns download statistics and current status
- Used for storage management and monitoring

---

#### POST /api/data/get_auto_download_status

**Description:** Check if auto-download is enabled for a specific podcast

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "podcast_id": 456,
  "user_id": 123
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `podcast_id` | integer | Yes | ID of the podcast to check |
| `user_id` | integer | Yes | User ID (must match API key owner) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"podcast_id":456,"user_id":123}' \
  http://localhost:8000/api/data/get_auto_download_status
```

**Response Example:**
```json
{
  "auto_download": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot check other users' podcast settings
- `404`: Not Found - Podcast not found
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Database error

**Notes:**
- User can only check their own podcast auto-download settings
- Returns boolean indicating if auto-download is enabled
- Used for managing automatic download preferences

---

#### POST /api/data/enable_auto_download

**Description:** Enable or disable automatic downloading for new episodes of a podcast

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "podcast_id": 456,
  "auto_download": true,
  "user_id": 123
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `podcast_id` | integer | Yes | ID of the podcast to configure |
| `auto_download` | boolean | Yes | Whether to enable auto-download |
| `user_id` | integer | Yes | User ID (must match API key owner) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"podcast_id":456,"auto_download":true,"user_id":123}' \
  http://localhost:8000/api/data/enable_auto_download
```

**Response Example:**
```json
{
  "detail": "Auto-download status updated."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot modify other users' podcast settings
- `400`: Bad Request - Invalid request body
- `500`: Internal Server Error - Database error

**Notes:**
- User can only modify their own podcast settings
- When enabled, new episodes will be automatically downloaded
- Useful for ensuring offline availability of favorite podcasts
- Setting can be toggled on/off as needed

---

## 🔍 Search & Discovery

Search & Discovery endpoints enable users to find new podcasts and YouTube channels, search through existing content, and manage YouTube channel subscriptions.

---

#### POST /api/data/search_data

**Description:** Search through podcasts and episodes using a text query

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "search_term": "artificial intelligence",
  "user_id": 123
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search_term` | string | Yes | Text to search for in podcasts and episodes |
| `user_id` | integer | Yes | User ID performing the search |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"search_term":"artificial intelligence","user_id":123}' \
  http://localhost:8000/api/data/search_data
```

**Response Example:**
```json
{
  "data": [
    {
      "type": "podcast",
      "podcast_id": 456,
      "podcast_name": "AI Today",
      "description": "Latest developments in artificial intelligence",
      "artwork_url": "https://example.com/ai-today.jpg"
    },
    {
      "type": "episode",
      "episode_id": 789,
      "episode_title": "The Future of AI in Healthcare",
      "podcast_name": "Tech Talk",
      "description": "Discussion about AI applications..."
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `400`: Bad Request - Invalid search parameters
- `500`: Internal Server Error - Search system error

**Notes:**
- Searches across podcast titles, descriptions, and episode content
- Returns both podcasts and individual episodes
- Results are relevant to the user's subscription context

---

#### GET /api/data/search_youtube_channels

**Description:** Search for YouTube channels by name or topic

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search term for YouTube channels |
| `user_id` | integer | Yes | User ID performing the search |
| `max_results` | integer | No | Maximum results to return (default: 5) |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/search_youtube_channels?query=tech%20reviews&user_id=123&max_results=10"
```

**Response Example:**
```json
{
  "channels": [
    {
      "channel_id": "UCXuqSBlHAE6Xw-yeJA0Tunw",
      "name": "Linus Tech Tips",
      "description": "We make entertaining videos about technology...",
      "subscriber_count": "15M",
      "thumbnail": "https://yt3.ggpht.com/ytc/channel_thumbnail.jpg",
      "url": "https://youtube.com/c/LinusTechTips"
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot search for other users
- `400`: Bad Request - Invalid search parameters
- `500`: Internal Server Error - YouTube API error

**Notes:**
- User can only search for their own account
- Uses yt-dlp for channel discovery
- Returns channel metadata including subscriber counts
- Requires yt-dlp binary to be installed

---

#### POST /api/data/youtube/subscribe

**Description:** Subscribe to a YouTube channel to receive new video notifications

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channel_id` | string | Yes | YouTube channel ID to subscribe to |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `feed_cutoff` | integer | No | Days to keep episodes (default: 30) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/youtube/subscribe?channel_id=UCXuqSBlHAE6Xw-yeJA0Tunw&user_id=123&feed_cutoff=60"
```

**Response Example:**
```json
{
  "success": true,
  "message": "Successfully subscribed to channel",
  "podcast_id": 789
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot subscribe for other users
- `400`: Bad Request - Invalid channel ID or parameters
- `409`: Conflict - Already subscribed to this channel
- `500`: Internal Server Error - Subscription failed

**Notes:**
- User can only subscribe for themselves
- Creates a podcast entry for the YouTube channel
- Automatically fetches initial episodes
- Channel must be valid and accessible

---

#### GET /api/data/check_youtube_channel

**Description:** Check if a YouTube channel exists and is accessible

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `channel_name` | string | Yes | Name of the channel to check |
| `channel_url` | string | Yes | URL of the channel to verify |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/check_youtube_channel?user_id=123&channel_name=Linus%20Tech%20Tips&channel_url=https://youtube.com/c/LinusTechTips"
```

**Response Example:**
```json
{
  "exists": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot check channels for other users
- `400`: Bad Request - Missing or invalid parameters
- `500`: Internal Server Error - Channel verification failed

**Notes:**
- User can only check channels for themselves
- Verifies channel accessibility and validity
- Used before subscription to ensure channel exists

---

#### GET /api/data/youtube_episodes

**Description:** Get episodes (videos) from a subscribed YouTube channel

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `podcast_id` | integer | Yes | ID of the YouTube channel (podcast) |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/youtube_episodes?user_id=123&podcast_id=456"
```

**Response Example:**
```json
{
  "episodes": [
    {
      "episode_id": 789,
      "episode_title": "Latest CPU Review - Intel vs AMD",
      "episode_description": "Comprehensive comparison of the newest processors...",
      "episode_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
      "episode_artwork": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "episode_duration": 1420,
      "episode_pubdate": "2024-01-15T14:30:00Z",
      "listened": false,
      "completed": false
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' episodes
- `404`: Not Found - Channel not found or not subscribed
- `500`: Internal Server Error - Database error

**Notes:**
- User can only access their own subscribed channels
- Returns YouTube videos as podcast episodes
- Includes playback status and metadata
- Episodes sorted by publication date

---

#### POST /api/data/remove_youtube_channel

**Description:** Unsubscribe from a YouTube channel and remove all associated episodes

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "channel_name": "Linus Tech Tips",
  "channel_url": "https://youtube.com/c/LinusTechTips"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `channel_name` | string | Yes | Name of the channel to remove |
| `channel_url` | string | Yes | URL of the channel to remove |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"channel_name":"Linus Tech Tips","channel_url":"https://youtube.com/c/LinusTechTips"}' \
  http://localhost:8000/api/data/remove_youtube_channel
```

**Response Example:**
```json
{
  "success": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot remove channels for other users
- `400`: Bad Request - Invalid request body
- `404`: Not Found - Channel not found in subscriptions
- `500`: Internal Server Error - Removal failed

**Notes:**
- User can only remove their own channel subscriptions
- Removes all associated episodes and metadata
- Cannot be undone - user must re-subscribe to restore access
- Both channel name and URL must match existing subscription

---

## 📊 Statistics & Analytics

Statistics & Analytics endpoints provide insights into user activity, listening patterns, and system information for dashboard displays and analytics purposes.

---

#### GET /api/data/get_stats

**Description:** Get comprehensive user statistics including listening time, episode counts, and activity metrics

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to get statistics for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_stats?user_id=123"
```

**Response Example:**
```json
{
  "total_listen_time": 86400,
  "episodes_played": 245,
  "episodes_completed": 198,
  "podcasts_subscribed": 32,
  "episodes_downloaded": 67,
  "episodes_saved": 18,
  "episodes_queued": 5,
  "avg_listen_time_per_episode": 1380,
  "most_listened_podcast": "Tech Talk",
  "listening_streak_days": 14,
  "last_activity": "2024-01-15T14:30:00Z"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' statistics
- `404`: Not Found - Stats not found for user ID
- `500`: Internal Server Error - Database error

**Notes:**
- User can only access their own statistics
- Returns comprehensive listening analytics
- Used for dashboard displays and user insights
- All time values are in seconds

---

#### GET /api/data/home_overview

**Description:** Get dashboard overview data including recent episodes, statistics, and recommendations

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to get overview for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/home_overview?user_id=123"
```

**Response Example:**
```json
{
  "recent_episodes": [
    {
      "episode_id": 789,
      "episode_title": "AI Revolution in 2024",
      "podcast_name": "Tech Talk",
      "episode_artwork": "https://example.com/artwork.jpg",
      "listen_progress": 0.75,
      "last_listened": "2024-01-15T14:30:00Z"
    }
  ],
  "quick_stats": {
    "total_listen_time": 86400,
    "episodes_this_week": 12,
    "completion_rate": 0.81
  },
  "recommended_episodes": [
    {
      "episode_id": 456,
      "episode_title": "Machine Learning Basics",
      "podcast_name": "AI Today",
      "reason": "Similar to your recent listening"
    }
  ],
  "active_downloads": 3,
  "queue_length": 5
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' overview
- `500`: Internal Server Error - Database error

**Notes:**
- User can only access their own home overview
- Provides dashboard-ready data for home screen
- Includes personalized recommendations
- Optimized for quick loading and display

---

#### GET /api/data/get_pinepods_version

**Description:** Get the current PinePods application version information

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_pinepods_version"
```

**Response Example:**
```json
{
  "data": {
    "version": "1.4.2",
    "build_date": "2024-01-15",
    "commit_hash": "a1b2c3d4",
    "rust_version": "1.75.0",
    "build_type": "release"
  }
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `500`: Internal Server Error - Version information unavailable

**Notes:**
- Available to any authenticated user
- Used for version checking and compatibility
- Includes build metadata for debugging
- Helpful for support and troubleshooting

---

## 📋 Playlists

Playlists endpoints allow users to create, manage, and access custom episode collections with advanced filtering and organization options.

---

#### GET /api/data/get_playlists

**Description:** Get all playlists created by a specific user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to get playlists for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_playlists?user_id=123"
```

**Response Example:**
```json
{
  "playlists": [
    {
      "playlist_id": 1,
      "name": "Tech News Digest",
      "description": "Latest technology news episodes",
      "episode_count": 25,
      "total_duration": 3600,
      "created_date": "2024-01-10T10:00:00Z",
      "icon_name": "tech",
      "last_updated": "2024-01-15T14:30:00Z"
    },
    {
      "playlist_id": 2,
      "name": "Morning Commute",
      "description": "Short episodes perfect for commuting",
      "episode_count": 42,
      "total_duration": 2520,
      "created_date": "2024-01-05T08:00:00Z",
      "icon_name": "commute",
      "last_updated": "2024-01-14T12:15:00Z"
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' playlists
- `500`: Internal Server Error - Database error

**Notes:**
- User can only access their own playlists
- Returns playlist metadata including episode counts and durations
- Playlists are automatically updated when criteria match new episodes
- Used for playlist management interfaces

---

#### GET /api/data/get_playlist_episodes

**Description:** Get all episodes in a specific playlist with detailed metadata

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `playlist_id` | integer | Yes | ID of the playlist to get episodes from |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_playlist_episodes?user_id=123&playlist_id=1"
```

**Response Example:**
```json
{
  "episodes": [
    {
      "episode_id": 789,
      "episode_title": "AI Revolution in 2024",
      "podcast_name": "Tech Talk",
      "episode_artwork": "https://example.com/artwork.jpg",
      "episode_url": "https://techtalk.example/ep42.mp3",
      "episode_duration": 3600,
      "episode_pubdate": "2024-01-15T14:30:00Z",
      "episode_description": "Deep dive into AI developments...",
      "listen_progress": 0.75,
      "completed": false,
      "saved": true,
      "downloaded": false,
      "playlist_position": 1
    }
  ],
  "playlist_info": {
    "playlist_id": 1,
    "name": "Tech News Digest",
    "description": "Latest technology news episodes",
    "total_episodes": 25,
    "total_duration": 3600
  }
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' playlist episodes
- `404`: Not Found - Playlist not found
- `500`: Internal Server Error - Database error

**Notes:**
- User can only access their own playlist episodes
- Returns episodes sorted according to playlist configuration
- Includes comprehensive episode metadata and playback status
- Episodes may be dynamically filtered based on playlist criteria

---

#### POST /api/data/create_playlist

**Description:** Create a new smart playlist with advanced filtering and organization options

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "name": "Tech News Digest",
  "description": "Latest technology news episodes",
  "podcast_ids": [456, 789],
  "include_unplayed": true,
  "include_partially_played": true,
  "include_played": false,
  "play_progress_min": 0.0,
  "play_progress_max": 0.8,
  "time_filter_hours": 168,
  "min_duration": 300,
  "max_duration": 3600,
  "sort_order": "newest_first",
  "group_by_podcast": false,
  "max_episodes": 50,
  "icon_name": "tech"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `name` | string | Yes | Name of the playlist |
| `description` | string | No | Optional description of the playlist |
| `podcast_ids` | array[integer] | No | Specific podcasts to include (null = all subscribed) |
| `include_unplayed` | boolean | Yes | Include episodes that haven't been started |
| `include_partially_played` | boolean | Yes | Include episodes that are partially listened |
| `include_played` | boolean | Yes | Include completed episodes |
| `play_progress_min` | float | No | Minimum play progress (0.0-1.0) |
| `play_progress_max` | float | No | Maximum play progress (0.0-1.0) |
| `time_filter_hours` | integer | No | Only include episodes from last X hours |
| `min_duration` | integer | No | Minimum episode duration in seconds |
| `max_duration` | integer | No | Maximum episode duration in seconds |
| `sort_order` | string | Yes | Sort order: "newest_first", "oldest_first", "shortest_first", "longest_first" |
| `group_by_podcast` | boolean | Yes | Whether to group episodes by podcast |
| `max_episodes` | integer | No | Maximum number of episodes in playlist |
| `icon_name` | string | Yes | Icon identifier for playlist display |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"name":"Tech News Digest","description":"Latest technology news episodes","include_unplayed":true,"include_partially_played":true,"include_played":false,"sort_order":"newest_first","group_by_podcast":false,"icon_name":"tech"}' \
  http://localhost:8000/api/data/create_playlist
```

**Response Example:**
```json
{
  "detail": "Playlist created successfully",
  "playlist_id": 5
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot create playlists for other users
- `400`: Bad Request - Invalid playlist parameters
- `500`: Internal Server Error - Playlist creation failed

**Notes:**
- User can only create playlists for themselves
- Smart playlists automatically update as new episodes match criteria
- Complex filtering options allow for highly customized episode collections
- Playlist ID returned for future management operations
- Icon names should match available icon set in the application

---

## 🎵 Queue Management

Queue Management endpoints allow users to create and manage their episode playback queue, controlling the order and content of episodes to be played.

---

#### POST /api/data/queue_pod

**Description:** Add an episode to the user's playback queue

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "episode_id": 789,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | ID of the user |
| episode_id | integer | Yes | ID of the episode to queue |
| is_youtube | boolean | Yes | Whether this is a YouTube video (true/false) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"episode_id":789,"is_youtube":false}' \
  http://localhost:8000/api/data/queue_pod
```

**Response Example:**
```json
{
  "data": "Episode queued successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot queue episodes for other users (non-admin)
- `500`: Internal Server Error - Database error

**Notes:**
- Episodes are added to the end of queue
- Duplicate episodes in queue are prevented at database level
- Returns message "Video queued successfully" for YouTube content
- User can only queue episodes for themselves unless admin

---

#### POST /api/data/remove_queued_pod

**Description:** Remove an episode from the user's playback queue

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123,
  "episode_id": 789,
  "is_youtube": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | ID of the user |
| episode_id | integer | Yes | ID of the episode to remove |
| is_youtube | boolean | Yes | Whether this is a YouTube video (true/false) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"episode_id":789,"is_youtube":false}' \
  http://localhost:8000/api/data/remove_queued_pod
```

**Response Example:**
```json
{
  "data": "Episode removed from queue successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot modify other user's queue (non-admin)
- `500`: Internal Server Error - Database error

**Notes:**
- Removes episode from queue regardless of position
- Queue positions are automatically adjusted after removal
- Returns message "Video removed from queue successfully" for YouTube content
- User can only modify their own queue unless admin

---

#### GET /api/data/get_queued_episodes

**Description:** Retrieve all episodes in the user's playback queue in order

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes (query) | ID of the user |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_queued_episodes?user_id=123"
```

**Response Example:**
```json
{
  "data": [
    {
      "episodetitle": "AI Revolution in 2024",
      "podcastname": "Tech Talk",
      "episodepubdate": "2024-01-15T10:00:00",
      "episodedescription": "Discussion about AI developments this year",
      "episodeartwork": "https://techtalk.example/art42.jpg",
      "episodeurl": "https://techtalk.example/ep42.mp3",
      "queueposition": 1,
      "episodeduration": 3600,
      "queuedate": "2024-01-20T14:30:00",
      "listenduration": null,
      "episodeid": 789,
      "completed": false,
      "saved": false,
      "queued": true,
      "downloaded": false,
      "is_youtube": false
    },
    {
      "episodetitle": "Climate Change Update", 
      "podcastname": "Science Weekly",
      "episodepubdate": "2024-01-16T09:00:00",
      "episodedescription": "Latest climate research findings",
      "episodeartwork": "https://scienceweekly.example/art43.jpg",
      "episodeurl": "https://scienceweekly.example/ep43.mp3",
      "queueposition": 2,
      "episodeduration": 2700,
      "queuedate": "2024-01-20T15:00:00",
      "listenduration": 300,
      "episodeid": 790,
      "completed": false,
      "saved": true,
      "queued": true,
      "downloaded": true,
      "is_youtube": false
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's queue (non-admin)
- `500`: Internal Server Error - Database error

**Notes:**
- Episodes returned in queue order (queueposition ascending)
- Includes full episode metadata, status flags, and listen progress
- queueposition can be null for some items
- listenduration shows partial playback progress in seconds
- Boolean flags show episode status (completed, saved, queued, downloaded)

---

#### POST /api/data/reorder_queue

**Description:** Reorder episodes in the user's playback queue by providing ordered list of episode IDs

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | ID of the user |

**Request Body:**
```json
{
  "episode_ids": [790, 789, 791]
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| episode_ids | array | Yes | Array of episode IDs in desired order |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"episode_ids":[790,789,791]}' \
  "http://localhost:8000/api/data/reorder_queue?user_id=123"
```

**Response Example:**
```json
{
  "message": "Queue reordered successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other user's queue (non-admin)
- `500`: Internal Server Error - Database error

**Notes:**
- Episode IDs in array define the new queue order (position 1, 2, 3...)
- All episodes must exist in user's current queue
- Episodes not included in the list remain in their relative order
- Operation updates queue positions atomically

---
