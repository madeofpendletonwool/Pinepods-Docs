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

#### GET /api/data/stream/*episode_id*

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

## GPodder API Endpoints

Direct GPodder API compatible endpoints for podcast synchronization, device management, and statistics. These endpoints provide GPodder v2 API compatibility while working with PinePods' internal sync system.

### GET /api/gpodder/test-connection

**Description:** Test connection to external GPodder server with provided credentials

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to test connection for |
| gpodder_url | string | Yes | GPodder server URL to test |
| gpodder_username | string | Yes | Username for GPodder server |
| gpodder_password | string | Yes | Password for GPodder server |

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     "http://localhost:8000/api/gpodder/test-connection?user_id=123&gpodder_url=https://gpodder.net&gpodder_username=myuser&gpodder_password=mypass"
```

**Response Example (Success):**
```json
{
  "success": true,
  "message": "Successfully connected to GPodder server and verified access.",
  "data": {
    "auth_type": "session",
    "has_devices": true
  }
}
```

**Response Example (Failure):**
```json
{
  "success": false,
  "message": "Failed to connect to GPodder server",
  "data": null
}
```

**Error Responses:**
- `400`: Bad Request - Missing required parameters or invalid user_id format
- `401`: Unauthorized - Invalid or missing API key  
- `403`: Forbidden - User can only test connections for themselves (unless using web key)
- `500`: Internal Server Error - Database or network error

**Implementation Notes:**
- **Authentication Test**: Makes HTTP POST to `/api/2/auth/{username}/login.json` with Basic Auth
- **Authorization Check**: Users can only test connections for their own account unless using web key
- **URL Format**: GPodder API v2 standard authentication endpoint  
- **Connection Verification**: Tests actual HTTP connection and authentication, not just credential validation
- **Python Compatibility**: Replicates Python test connection functionality exactly

---

### POST /api/gpodder/set_default/*device_id*

**Description:** Set the default GPodder device for the authenticated user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| device_id | integer | Yes | Device ID to set as default |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/gpodder/set_default/456
```

**Response Example (Success):**
```json
{
  "status": "success"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Device does not belong to user or insufficient permissions
- `404`: Not Found - Device ID does not exist
- `500`: Internal Server Error - Failed to set default device

**Implementation Notes:**
- **User Authorization**: Automatically determines user from API key, no user_id parameter needed
- **Device Ownership**: Validates that device belongs to the authenticated user
- **Database Update**: Updates user's default device setting in database
- **Python Compatibility**: Matches Python `set_default_device` function exactly

---

### GET /api/gpodder/devices/*user_id*

**Description:** Get all GPodder devices for a specific user

**Authentication:** 🔐 User API Key (or Web Key for admin access)

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get devices for |

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/gpodder/devices/123
```

**Response Example:**
```json
[
  {
    "device_id": "pinepods-device-123",
    "name": "My Phone",
    "type": "mobile",
    "caption": "iPhone 15 Pro",
    "subscriptions": 42,
    "is_default": true
  },
  {
    "device_id": "pinepods-device-456", 
    "name": "Desktop",
    "type": "desktop",
    "caption": "MacBook Pro",
    "subscriptions": 42,
    "is_default": false
  }
]
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Can only view your own devices (unless web key)
- `404`: Not Found - User does not exist
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Authorization Check**: Users can only view their own devices unless using web key
- **Device Format**: Returns GPodder API compatible device format
- **Subscription Count**: Includes number of subscriptions synced to each device
- **Python Compatibility**: Matches Python `get_devices` function exactly

---

### GET /api/gpodder/devices

**Description:** Get all GPodder devices for the authenticated user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/gpodder/devices
```

**Response Example:**
```json
[
  {
    "device_id": "pinepods-device-123",
    "name": "My Phone", 
    "type": "mobile",
    "caption": "iPhone 15 Pro",
    "subscriptions": 42,
    "is_default": true
  }
]
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **User Determination**: Automatically gets user ID from API key
- **Same Logic**: Uses same backend function as `/devices/*user_id*` but with auth user
- **Python Compatibility**: Matches Python `get_all_devices` function exactly

---

### GET /api/gpodder/default_device

**Description:** Get the default GPodder device for the authenticated user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/gpodder/default_device
```

**Response Example:**
```json
{
  "device_id": "pinepods-device-123",
  "name": "My Phone",
  "type": "mobile", 
  "caption": "iPhone 15 Pro",
  "is_default": true,
  "subscriptions": 42
}
```

**Response Example (No Default):**
```json
null
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **User Determination**: Automatically gets user ID from API key
- **Null Response**: Returns null if user has no default device set
- **Python Compatibility**: Matches Python `get_default_device` function exactly

---

### POST /api/gpodder/devices

**Description:** Create a new GPodder device via the GPodder API

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| device_name | string | Yes | Name for the new device |
| device_type | string | Yes | Device type (mobile, desktop, laptop, etc.) |
| device_caption | string | No | Optional caption/description for device |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"device_name":"My Tablet","device_type":"tablet","device_caption":"iPad Pro 2024"}' \
     http://localhost:8000/api/gpodder/devices
```

**Response Example:**
```json
{
  "id": "pinepods-tablet-789",
  "name": "My Tablet",
  "type": "tablet", 
  "caption": "iPad Pro 2024",
  "last_sync": null,
  "is_active": true,
  "is_remote": true,
  "is_default": false
}
```

**Error Responses:**
- `400`: Bad Request - GPodder sync not enabled or invalid request data
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Failed to create device via GPodder API

**Implementation Notes:**
- **Sync Requirement**: User must have GPodder sync enabled (sync_type: gpodder, both, or external)
- **API Integration**: Creates device via actual GPodder API using user's configured credentials
- **Token Handling**: Properly handles encrypted tokens for external GPodder servers
- **Standard Format**: Returns GPodder API v2 standard device response format
- **Python Compatibility**: Matches Python `create_device` function exactly

---

### POST /api/gpodder/sync/force

**Description:** Force a complete initial GPodder synchronization (without timestamps)

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/gpodder/sync/force
```

**Response Example (Success):**
```json
{
  "success": true,
  "message": "Initial sync completed successfully - all data refreshed",
  "data": null
}
```

**Response Example (No Sync Configured):**
```json
{
  "success": false,
  "message": "No sync configured for this user",
  "data": null
}
```

**Response Example (Failure):**
```json
{
  "success": false,
  "message": "Initial sync failed: Authentication failed",
  "data": null
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Sync process failed

**Implementation Notes:**
- **Full Sync**: Performs complete initial synchronization without timestamp filtering
- **Multi-Type Support**: Handles gpodder, nextcloud, external, and both sync types
- **Device Management**: Automatically creates or retrieves default device
- **Token Decryption**: Properly decrypts stored tokens for external servers
- **Fault Tolerance**: For "both" sync type, attempts both internal and external, succeeds if either works
- **Python Compatibility**: Matches initial full sync behavior from Python implementation

---

### POST /api/gpodder/sync

**Description:** Perform standard incremental GPodder synchronization with timestamps

**Authentication:** 🔐 User API Key  

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/gpodder/sync
```

**Response Example (Success):**
```json
{
  "success": true,
  "message": "Sync completed successfully", 
  "data": null
}
```

**Response Example (No Changes):**
```json
{
  "success": false,
  "message": "Sync failed or no changes detected - check your sync configuration",
  "data": null
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Sync process failed

**Implementation Notes:**
- **Incremental Sync**: Uses timestamps to only sync changes since last sync
- **Task Integration**: Uses same sync process as scheduled background tasks
- **Change Detection**: Returns false if no changes were detected or sync failed
- **Efficient Operation**: Only transfers modified data, not complete datasets
- **Python Compatibility**: Matches scheduled sync behavior from tasks.py

---

### GET /api/gpodder/gpodder_statistics

**Description:** Get comprehensive GPodder server statistics and connection status

**Authentication:** 🔐 User API Key

**Request Headers:**  
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/gpodder/gpodder_statistics
```

**Response Example (Sync Enabled):**
```json
{
  "server_url": "https://gpodder.net",
  "sync_type": "external",
  "sync_enabled": true,
  "server_devices": [
    {
      "id": "device-123",
      "caption": "My Phone",
      "device_type": "mobile",
      "subscriptions": 42
    }
  ],
  "total_devices": 1,
  "server_subscriptions": [
    {
      "url": "https://example.com/feed.xml",
      "title": "Tech Talk",
      "description": "Weekly technology discussion"
    }
  ],
  "total_subscriptions": 1,
  "recent_episode_actions": [
    {
      "podcast": "https://example.com/feed.xml",
      "episode": "https://example.com/ep123.mp3", 
      "action": "play",
      "timestamp": "2024-01-15T14:30:00Z",
      "position": 1800,
      "device": "device-123"
    }
  ],
  "total_episode_actions": 1,
  "connection_status": "All endpoints working",
  "last_sync_timestamp": "2024-01-15T14:00:00Z",
  "api_endpoints_tested": [
    {
      "endpoint": "/api/2/auth/login",
      "status": "success",
      "response_time_ms": 125,
      "error": null
    }
  ]
}
```

**Response Example (No Sync):**
```json
{
  "server_url": "No sync configured",
  "sync_type": "None", 
  "sync_enabled": false,
  "server_devices": [],
  "total_devices": 0,
  "server_subscriptions": [],
  "total_subscriptions": 0,
  "recent_episode_actions": [],
  "total_episode_actions": 0,
  "connection_status": "Not configured",
  "last_sync_timestamp": null,
  "api_endpoints_tested": []
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Failed to gather statistics

**Implementation Notes:**
- **Real Server Data**: Fetches actual statistics from configured GPodder server
- **Connection Testing**: Tests multiple API endpoints and measures response times
- **Comprehensive Status**: Includes devices, subscriptions, episode actions, and sync timestamps
- **Performance Monitoring**: Tracks API response times for monitoring
- **Fault Tolerance**: Gracefully handles partial failures and connection issues
- **Python Compatibility**: Provides equivalent statistics to Python implementation

---

## Task Management & WebSockets

Real-time task management and progress tracking system with WebSocket support for live updates. These endpoints provide comprehensive task monitoring capabilities including background downloads, imports, and sync operations.

### GET /api/tasks/user/*user_id*

**Description:** Get all tasks (pending, running, completed, failed) for a specific user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get tasks for |

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/tasks/user/123
```

**Response Example:**
```json
[
  {
    "id": "task-uuid-1234",
    "task_type": "podcast_download",
    "user_id": 123,
    "status": "DOWNLOADING",
    "progress": 45.5,
    "message": "Downloading episode: Tech Talk Episode 42",
    "created_at": "2024-01-15T14:30:00Z",
    "updated_at": "2024-01-15T14:32:15Z",
    "result": null
  },
  {
    "id": "task-uuid-5678",
    "task_type": "opml_import", 
    "user_id": 123,
    "status": "SUCCESS",
    "progress": 100.0,
    "message": "Import completed successfully",
    "created_at": "2024-01-15T14:00:00Z",
    "updated_at": "2024-01-15T14:05:30Z",
    "result": {
      "imported_podcasts": 15,
      "imported_episodes": 342
    }
  }
]
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Cannot access other user's tasks (unless web key)
- `500`: Internal Server Error - Task manager error

**Implementation Notes:**
- **Authorization Check**: Users can only view their own tasks unless using web key
- **Task Status**: PENDING, DOWNLOADING (Running), SUCCESS (Completed), FAILED
- **Progress Tracking**: Real-time progress from 0.0 to 100.0
- **Task Types**: podcast_download, youtube_download, opml_import, gpodder_sync, etc.
- **Result Data**: Contains task-specific completion data when successful

---

### GET /api/tasks/active

**Description:** Get all currently active (pending or running) tasks for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get active tasks for |

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     "http://localhost:8000/api/tasks/active?user_id=123"
```

**Response Example:**
```json
[
  {
    "id": "task-uuid-1234",
    "task_type": "podcast_download",
    "user_id": 123,
    "status": "DOWNLOADING",
    "progress": 67.3,
    "message": "Downloading: episode-audio.mp3 (15MB/22MB)",
    "created_at": "2024-01-15T14:30:00Z",
    "updated_at": "2024-01-15T14:34:22Z",
    "result": null
  },
  {
    "id": "task-uuid-9999", 
    "task_type": "gpodder_sync",
    "user_id": 123,
    "status": "PENDING",
    "progress": 0.0,
    "message": "Queued for processing",
    "created_at": "2024-01-15T14:35:00Z",
    "updated_at": "2024-01-15T14:35:00Z",
    "result": null
  }
]
```

**Response Example (No Active Tasks):**
```json
[]
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `400`: Bad Request - Missing user_id parameter
- `500`: Internal Server Error - Task manager error

**Implementation Notes:**
- **Filtering**: Only returns tasks with status PENDING or DOWNLOADING (Running)
- **Real-time Data**: Progress and messages update in real-time
- **Required Parameter**: user_id must be provided in query string
- **Empty Response**: Returns empty array when no active tasks exist

---

### GET /api/tasks/*task_id*

**Description:** Get detailed status and information for a specific task

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| task_id | string | Yes | Unique task ID (UUID format) |

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/tasks/task-uuid-1234
```

**Response Example (Running Task):**
```json
{
  "id": "task-uuid-1234",
  "task_type": "podcast_download",
  "user_id": 123,
  "status": "DOWNLOADING",
  "progress": 78.2,
  "message": "Downloading: tech-talk-ep42.mp3 (18.5MB/23.7MB)",
  "created_at": "2024-01-15T14:30:00Z",
  "updated_at": "2024-01-15T14:36:45Z",
  "result": null
}
```

**Response Example (Completed Task):**
```json
{
  "id": "task-uuid-5678",
  "task_type": "opml_import",
  "user_id": 123,
  "status": "SUCCESS",
  "progress": 100.0,
  "message": "OPML import completed successfully",
  "created_at": "2024-01-15T14:00:00Z",
  "updated_at": "2024-01-15T14:05:30Z",
  "result": {
    "imported_podcasts": 15,
    "imported_episodes": 342,
    "skipped_duplicates": 3,
    "processing_time_seconds": 330
  }
}
```

**Response Example (Failed Task):**
```json
{
  "id": "task-uuid-9999",
  "task_type": "podcast_download",
  "user_id": 123,
  "status": "FAILED",
  "progress": 25.0,
  "message": "Download failed: Connection timeout",
  "created_at": "2024-01-15T15:00:00Z",
  "updated_at": "2024-01-15T15:02:30Z",
  "result": {
    "error_code": "TIMEOUT",
    "retry_count": 3,
    "last_error": "Failed to download after 3 attempts"
  }
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `404`: Not Found - Task ID does not exist
- `403`: Forbidden - Task belongs to different user (unless web key)
- `500`: Internal Server Error - Task manager error

**Implementation Notes:**
- **Task Ownership**: Users can only view tasks they own unless using web key
- **Progress Details**: Includes real-time progress updates and detailed status messages
- **Result Data**: Contains task-specific completion data or error details
- **UUID Format**: Task IDs are in UUID format for uniqueness
- **Status Tracking**: Comprehensive status information with timestamps

---

### WS /ws/api/tasks/*user_id*

**Description:** WebSocket connection for real-time task progress updates and notifications

**Authentication:** 🔐 User API Key (via query parameter)

**Connection URL:**
```
ws://localhost:8000/ws/api/tasks/*user_id*?api_key=YOUR_API_KEY
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to receive task updates for |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| api_key | string | Yes | User's API key for authentication |

**Connection Example (JavaScript):**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/api/tasks/123?api_key=YOUR_API_KEY');

ws.onopen = function() {
    console.log('Connected to task progress WebSocket');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Task update:', data);
};

ws.onclose = function() {
    console.log('Task WebSocket connection closed');
};
```

**Initial Message (on connection):**
```json
{
  "event": "initial",
  "task": null,
  "tasks": [
    {
      "id": "task-uuid-1234",
      "task_type": "podcast_download", 
      "user_id": 123,
      "status": "DOWNLOADING",
      "progress": 45.5,
      "message": "Downloading episode audio...",
      "created_at": "2024-01-15T14:30:00Z",
      "updated_at": "2024-01-15T14:32:15Z",
      "result": null
    }
  ]
}
```

**Update Message (during task execution):**
```json
{
  "event": "update",
  "task": {
    "task_id": "task-uuid-1234",
    "user_id": 123,
    "type": "podcast_download",
    "item_id": 789,
    "progress": 67.8,
    "status": "DOWNLOADING",
    "details": {
      "episode_title": "Tech Talk Episode 42",
      "file_size": "23.7MB",
      "downloaded": "16.1MB",
      "download_speed": "1.2MB/s"
    },
    "started_at": "2024-01-15T14:30:00Z"
  },
  "tasks": null
}
```

**Completion Message:**
```json
{
  "event": "update", 
  "task": {
    "task_id": "task-uuid-1234",
    "user_id": 123,
    "type": "podcast_download",
    "item_id": 789,
    "progress": 100.0,
    "status": "SUCCESS",
    "details": {
      "episode_title": "Tech Talk Episode 42",
      "file_path": "/downloads/tech-talk-ep42.mp3",
      "file_size": "23.7MB",
      "duration": "3600"
    },
    "started_at": "2024-01-15T14:30:00Z",
    "completed_at": "2024-01-15T14:38:22Z"
  },
  "tasks": null
}
```

**Client Messages (optional):**
- Send `"ping"` to test connection (server will acknowledge)
- Connection automatically closes on authentication failure

**Error Responses:**
- `403 Unauthorized`: Invalid API key or insufficient permissions
- Connection will be refused for invalid authentication

**Implementation Notes:**
- **Real-time Updates**: Receives live progress updates for all user tasks
- **Initial State**: Gets current task list immediately on connection
- **Authorization**: Users can only subscribe to their own task updates (unless web key)
- **Connection Management**: Automatic cleanup on disconnect
- **Progress Broadcasting**: All task progress changes are broadcast instantly
- **Multiple Connections**: User can have multiple WebSocket connections active
- **Task Filtering**: Only receives updates for tasks belonging to the authenticated user

---

### WS /ws/api/data/episodes/*user_id*

**Description:** WebSocket connection for real-time episode refresh progress and podcast feed updates

**Authentication:** 🔐 User API Key (via query parameter)  

**Connection URL:**
```
ws://localhost:8000/ws/api/data/episodes/*user_id*?api_key=YOUR_API_KEY&nextcloud_refresh=false
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to refresh episodes for |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| api_key | string | Yes | User's API key for authentication |
| nextcloud_refresh | boolean | No | Whether to include Nextcloud sync (default: false) |

**Connection Example (JavaScript):**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/api/data/episodes/123?api_key=YOUR_API_KEY&nextcloud_refresh=true');

ws.onopen = function() {
    console.log('Connected to episode refresh WebSocket');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    handleRefreshUpdate(data);
};

ws.onclose = function(event) {
    if (event.code === 1008) {
        console.error('Authentication failed');
    } else {
        console.log('Episode refresh completed');
    }
};
```

**Progress Messages:**

**Start Message:**
```json
{
  "type": "refresh_start",
  "message": "Starting podcast refresh for user 123",
  "total_podcasts": 25,
  "timestamp": "2024-01-15T14:30:00Z"
}
```

**Podcast Progress Message:**
```json
{
  "type": "podcast_progress",
  "podcast_id": 789,
  "podcast_name": "Tech Talk",
  "current": 5,
  "total": 25,
  "progress_percent": 20.0,
  "message": "Refreshing: Tech Talk (5/25)",
  "new_episodes": 3,
  "timestamp": "2024-01-15T14:32:15Z"
}
```

**Episode Discovery Message:**
```json
{
  "type": "episodes_found",
  "podcast_id": 789,
  "podcast_name": "Tech Talk",
  "episodes": [
    {
      "title": "AI Revolution in 2024",
      "url": "https://techtalk.example/ep42.mp3",
      "pub_date": "2024-01-15T12:00:00Z"
    },
    {
      "title": "Blockchain Updates",
      "url": "https://techtalk.example/ep41.mp3", 
      "pub_date": "2024-01-12T12:00:00Z"
    }
  ],
  "timestamp": "2024-01-15T14:32:30Z"
}
```

**Auto-Download Message:**
```json
{
  "type": "auto_download",
  "podcast_id": 789,
  "episode_id": 1234,
  "episode_title": "AI Revolution in 2024",
  "task_id": "download-task-uuid-5678",
  "message": "Auto-download queued for: AI Revolution in 2024",
  "timestamp": "2024-01-15T14:32:45Z"
}
```

**Nextcloud Sync Message (when enabled):**
```json
{
  "type": "nextcloud_sync",
  "status": "running",
  "message": "Syncing subscriptions with Nextcloud server",
  "synced_podcasts": 12,
  "timestamp": "2024-01-15T14:33:00Z"
}
```

**Completion Message:**
```json
{
  "type": "refresh_complete",
  "message": "Episode refresh completed successfully",
  "total_podcasts": 25,
  "total_new_episodes": 47,
  "total_auto_downloads": 12,
  "duration_seconds": 185,
  "timestamp": "2024-01-15T14:33:05Z"
}
```

**Error Message:**
```json
{
  "type": "error",
  "podcast_id": 789,
  "podcast_name": "Tech Talk", 
  "message": "Failed to refresh podcast: Connection timeout",
  "error_code": "NETWORK_ERROR",
  "timestamp": "2024-01-15T14:32:45Z"
}
```

**Concurrent Refresh Block:**
```json
{
  "type": "error",
  "message": "Refresh job already running for this user.",
  "code": "REFRESH_IN_PROGRESS",
  "timestamp": "2024-01-15T14:30:05Z"
}
```

**Error Responses:**
- `403 Unauthorized`: Invalid API key or insufficient permissions  
- `409 Conflict`: Refresh already running for user (connection closes with error message)
- Connection will be refused for invalid authentication

**Implementation Notes:**
- **Concurrency Protection**: Only one refresh per user at a time - additional connections rejected
- **Authorization**: Users can only refresh their own episodes (unless web key)
- **Auto-Download Integration**: Triggers automatic downloads for enabled podcasts
- **Nextcloud Integration**: Optional Nextcloud synchronization during refresh
- **Real-time Feedback**: Live progress updates for each podcast being processed
- **Error Handling**: Individual podcast errors don't stop overall refresh
- **YouTube Support**: Handles both regular podcasts and YouTube channels
- **Feed Processing**: Fetches and parses RSS feeds with comprehensive error handling
- **Background Tasks**: Spawns download tasks automatically for new episodes when enabled

---

## Image Proxy

Secure image proxy service for serving external images through PinePods infrastructure with caching and security controls.

### GET /api/proxy/image

**Description:** Proxy external images securely with validation, caching, and CORS support

**Authentication:** 🔓 Open Endpoint (No authentication required)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Yes | External image URL to proxy (must be http/https) |

**Request Example:**
```bash
curl -X GET "http://localhost:8000/api/proxy/image?url=https://example.com/podcast-cover.jpg"
```

**Response Example (Success):**
- **Content-Type**: Original image content type (image/jpeg, image/png, etc.)
- **Cache-Control**: `public, max-age=86400` (24 hour cache)
- **Access-Control-Allow-Origin**: `*` (CORS enabled)
- **X-Content-Type-Options**: `nosniff` (security header)
- **Body**: Binary image data

**Error Responses:**
- `400`: Bad Request - Invalid URL format or non-image content type
- `502`: Bad Gateway - Failed to fetch image from external URL or upstream server error
- `500`: Internal Server Error - HTTP client initialization failed

**Implementation Notes:**
- **URL Validation**: Only accepts http/https URLs for security
- **Content-Type Validation**: Ensures response is image/* or application/octet-stream
- **Redirect Handling**: Follows up to 10 redirects automatically
- **Timeout Protection**: 10-second timeout for external requests
- **Cache Headers**: Sets 24-hour cache for browser/CDN caching
- **Security Headers**: Includes CORS and content-type protection
- **No Authentication**: Public endpoint for serving podcast artwork and images
- **Python Compatibility**: Matches Python proxy_image endpoint functionality

---

## Podcast Notifications

User notification system supporting multiple platforms including Ntfy and Gotify for podcast episode alerts and updates.

### GET /api/data/user/notification_settings

**Description:** Get notification settings for all platforms configured by a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get notification settings for |

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     "http://localhost:8000/api/data/user/notification_settings?user_id=123"
```

**Response Example:**
```json
{
  "settings": [
    {
      "platform": "ntfy",
      "enabled": true,
      "ntfy_topic": "my-podcast-alerts",
      "ntfy_server_url": "https://ntfy.sh",
      "ntfy_username": "myuser",
      "ntfy_password": "encrypted_password_hash",
      "ntfy_access_token": null,
      "created_at": "2024-01-15T14:30:00Z",
      "updated_at": "2024-01-15T16:45:00Z"
    },
    {
      "platform": "gotify",
      "enabled": false,
      "gotify_url": "https://gotify.example.com",
      "gotify_token": "encrypted_token_hash",
      "created_at": "2024-01-12T10:15:00Z",
      "updated_at": "2024-01-12T10:15:00Z"
    }
  ]
}
```

**Response Example (No Settings):**
```json
{
  "settings": []
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Can only view your own notification settings (unless web key)
- `404`: Not Found - User does not exist
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Authorization Check**: Users can only view their own settings unless using web key
- **Multiple Platforms**: Returns settings for all configured notification platforms
- **Credential Security**: Passwords and tokens are stored encrypted in database
- **Platform Support**: Currently supports Ntfy and Gotify notification services
- **Python Compatibility**: Matches Python notification_settings GET function exactly

---

### PUT /api/data/user/notification_settings

**Description:** Update notification settings for a specific platform

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_id | integer | Yes | User ID (must match API key owner) |
| platform | string | Yes | Notification platform ("ntfy" or "gotify") |
| enabled | boolean | Yes | Whether notifications are enabled for this platform |
| ntfy_topic | string | No | Ntfy topic name (required if platform=ntfy) |
| ntfy_server_url | string | No | Ntfy server URL (default: https://ntfy.sh) |
| ntfy_username | string | No | Ntfy username for authenticated topics |
| ntfy_password | string | No | Ntfy password (will be encrypted) |
| ntfy_access_token | string | No | Ntfy access token (alternative to username/password) |
| gotify_url | string | No | Gotify server URL (required if platform=gotify) |
| gotify_token | string | No | Gotify application token (will be encrypted) |

**Request Example (Ntfy):**
```bash
curl -X PUT -H "Api-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"user_id":123,"platform":"ntfy","enabled":true,"ntfy_topic":"podcast-alerts","ntfy_server_url":"https://ntfy.sh","ntfy_username":"myuser","ntfy_password":"mypassword"}' \
     http://localhost:8000/api/data/user/notification_settings
```

**Request Example (Gotify):**
```bash
curl -X PUT -H "Api-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"user_id":123,"platform":"gotify","enabled":true,"gotify_url":"https://gotify.example.com","gotify_token":"A1B2C3D4E5F6"}' \
     http://localhost:8000/api/data/user/notification_settings
```

**Response Example:**
```json
{
  "detail": "Notification settings updated successfully"
}
```

**Error Responses:**
- `400`: Bad Request - Invalid request body or missing required platform fields
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Can only update your own notification settings (unless web key)
- `500`: Internal Server Error - Database error or encryption failure

**Implementation Notes:**
- **Authorization Check**: Users can only update their own settings unless using web key
- **Platform Validation**: Validates required fields for each notification platform
- **Credential Encryption**: Passwords and tokens are automatically encrypted before storage
- **Upsert Behavior**: Creates new settings or updates existing ones for the platform
- **Field Validation**: Ensures required fields are provided for each platform type
- **Python Compatibility**: Matches Python notification_settings PUT function exactly

---

## Startup Configuration

User interface startup configuration management for customizing the default landing page and initial view settings.

### GET /api/data/startpage

**Description:** Get the configured startup page for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to get startup page configuration for |

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     "http://localhost:8000/api/data/startpage?user_id=123"
```

**Response Example:**
```json
{
  "StartPage": "queue"
}
```

**Response Example (Default):**
```json
{
  "StartPage": "home"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Can only view your own startpage setting (unless web key)
- `404`: Not Found - User does not exist
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Authorization Check**: Users can only view their own startpage unless using web key
- **Default Value**: Returns "home" if no custom startpage is configured
- **Valid Options**: Typically includes "home", "queue", "episodes", "podcasts", "history", etc.
- **UI Integration**: Used by frontend to determine initial page after login
- **Python Compatibility**: Matches Python startpage GET function exactly

---

### POST /api/data/startpage

**Description:** Update the startup page configuration for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID (must match API key owner) |
| startpage | string | No | Startup page name (default: "home") |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_API_KEY" \
     "http://localhost:8000/api/data/startpage?user_id=123&startpage=queue"
```

**Response Example:**
```json
{
  "success": true,
  "message": "StartPage updated successfully"
}
```

**Error Responses:**
- `400`: Bad Request - Invalid startpage value
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Can only update your own startpage setting (unless web key)
- `500`: Internal Server Error - Database error

**Valid Startpage Values:**
- `"home"` - Dashboard/home page (default)
- `"queue"` - Episode queue page
- `"episodes"` - All episodes listing
- `"podcasts"` - Podcast subscriptions
- `"history"` - Listening history
- `"downloads"` - Downloaded episodes
- `"saved"` - Saved episodes
- `"playlists"` - User playlists

**Implementation Notes:**
- **Authorization Check**: Users can only update their own startpage unless using web key
- **Default Handling**: Uses "home" if no startpage parameter provided
- **Database Update**: Persists setting to user's profile in database
- **UI Behavior**: Frontend redirects to this page after authentication
- **Validation**: Should validate against known page names in production
- **Python Compatibility**: Matches Python startpage POST function exactly


---

## 📝 Transcripts & Advanced Features

Advanced podcast features including transcript fetching and Podcasting 2.0 standard support for enhanced metadata, chapters, transcripts, people information, funding details, and other modern podcast features.

---

#### POST /api/data/fetch_transcript

**Description:** Fetch episode transcript content from external URL (CORS proxy endpoint)

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "url": "https://example.com/transcript.txt"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | External URL of the transcript file to fetch |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://podcasts.example.com/transcripts/episode123.txt"}' \
  http://localhost:8000/api/data/fetch_transcript
```

**Response Example:**
```json
{
  "success": true,
  "content": "Welcome to today's episode. Today we're discussing..."
}
```

**Error Response Example:**
```json
{
  "success": false,
  "error": "Failed to fetch transcript: Connection timeout"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `200`: Always returns 200, but check `success` field in response

**Notes:**
- Acts as a CORS proxy to fetch transcript content from external URLs
- Returns success/error status within the JSON response body
- Used to bypass browser CORS restrictions when fetching transcripts
- Handles network errors gracefully and returns error details

---

#### GET /api/data/fetch_podcasting_2_data

**Description:** Get comprehensive Podcasting 2.0 metadata for a specific episode, including chapters, transcripts, and people information

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episode_id` | integer | Yes | ID of the episode to get Podcasting 2.0 data for |
| `user_id` | integer | Yes | User ID (must match API key owner) |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/fetch_podcasting_2_data?episode_id=789&user_id=123"
```

**Response Example:**
```json
{
  "chapters": [
    {
      "start_time": 0,
      "title": "Introduction",
      "url": "https://example.com/chapter1",
      "image": "https://example.com/chapter1.jpg"
    },
    {
      "start_time": 300,
      "title": "Main Discussion",
      "url": "https://example.com/chapter2"
    }
  ],
  "transcripts": [
    {
      "url": "https://example.com/transcript.json",
      "type": "application/json",
      "language": "en",
      "rel": "captions"
    }
  ],
  "people": [
    {
      "name": "John Doe",
      "role": "host",
      "href": "https://johndoe.example.com",
      "image": "https://johndoe.example.com/avatar.jpg"
    },
    {
      "name": "Jane Smith", 
      "role": "guest",
      "href": "https://janesmith.example.com"
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' episode data
- `404`: Not Found - Episode not found
- `500`: Internal Server Error - Feed parsing error

**Notes:**
- Parses RSS feed for Podcasting 2.0 standard tags
- Returns chapters with timestamps and optional metadata
- Includes transcript URLs in various formats (JSON, SRT, VTT)
- People data includes hosts, guests, and other contributors
- Falls back to PodPeople API for additional person metadata
- Requires user to have access to the episode's podcast
- Some features depend on podcast feed supporting Podcasting 2.0 standard

---

#### GET /api/data/fetch_podcasting_2_pod_data

**Description:** Get podcast-level Podcasting 2.0 metadata including people, podroll, funding information, and value settings

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `podcast_id` | integer | Yes | ID of the podcast to get Podcasting 2.0 data for |
| `user_id` | integer | Yes | User ID (must match API key owner) |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/fetch_podcasting_2_pod_data?podcast_id=456&user_id=123"
```

**Response Example:**
```json
{
  "people": [
    {
      "name": "John Doe",
      "role": "host",
      "href": "https://johndoe.example.com",
      "image": "https://johndoe.example.com/avatar.jpg",
      "group": "cast"
    }
  ],
  "podroll": [
    {
      "title": "Similar Podcast",
      "url": "https://similar-podcast.example.com/feed.xml",
      "description": "Another great tech podcast"
    }
  ],
  "funding": [
    {
      "url": "https://patreon.com/podcast",
      "message": "Support us on Patreon"
    },
    {
      "url": "https://ko-fi.com/podcast", 
      "message": "Buy us a coffee"
    }
  ],
  "value": {
    "type": "lightning",
    "method": "keysend",
    "suggested": 0.00000010,
    "recipients": [
      {
        "name": "Host",
        "type": "node",
        "address": "030a58b8653d32b99200a5ccb8f5e2e7f8f8a9c1d5e5f5e5f5e5f5e5f5e5f5e5",
        "split": 80
      }
    ]
  }
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' podcast data
- `404`: Not Found - Podcast not found
- `500`: Internal Server Error - Feed parsing error

**Notes:**
- Fetches podcast-level Podcasting 2.0 metadata from RSS feed
- People includes all podcast contributors with roles and metadata
- Podroll contains recommendations for similar podcasts
- Funding provides ways for listeners to financially support the podcast
- Value contains Lightning Network payment information for micropayments
- Requires user to be subscribed to the podcast
- Data availability depends on podcast feed supporting Podcasting 2.0 standard
- Falls back to PodPeople API for enhanced people metadata

---

## 👥 Person/Host Features

Person and host management features that allow users to subscribe to specific podcast hosts or guests, track episodes where they appear, and discover podcasts by host. Integrates with the PodPeople database for enhanced person metadata.

---

#### GET /api/data/podpeople/host_podcasts

**Description:** Search for podcasts by host name using the PodPeople external database service

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hostname` | string | Yes | Name of the host to search for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/podpeople/host_podcasts?hostname=Joe%20Rogan"
```

**Response Example:**
```json
{
  "success": true,
  "podcasts": [
    {
      "podcast_id": "123456789",
      "name": "The Joe Rogan Experience",
      "artwork_url": "https://example.com/artwork.jpg",
      "description": "The official podcast of comedian Joe Rogan",
      "feed_url": "https://feeds.redcircle.com/jre",
      "website": "https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk",
      "categories": ["Comedy", "Society & Culture"],
      "host_info": {
        "name": "Joe Rogan",
        "role": "host"
      }
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `503`: Service Unavailable - PodPeople API unavailable
- `500`: Internal Server Error - External API error

**Notes:**
- Queries the external PodPeople database service
- Service URL configurable via `PEOPLE_API_URL` environment variable
- Returns podcasts where the specified person is a host
- Used for podcast discovery by host/personality
- Data sourced from comprehensive podcast host database

---

#### POST /api/data/person/subscribe/*user_id*/*person_id*

**Description:** Subscribe to a specific person/host to track episodes where they appear

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `person_id` | integer | Yes | External person ID from PodPeople database |

**Request Body:**
```json
{
  "person_name": "Joe Rogan",
  "person_img": "https://example.com/joe-rogan.jpg",
  "podcast_id": 456
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `person_name` | string | Yes | Display name of the person |
| `person_img` | string | Yes | URL to person's profile image |
| `podcast_id` | integer | Yes | Associated podcast ID where person appears |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"person_name":"Joe Rogan","person_img":"https://example.com/joe-rogan.jpg","podcast_id":456}' \
  http://localhost:8000/api/data/person/subscribe/123/789
```

**Response Example:**
```json
{
  "success": true,
  "message": "Successfully subscribed to person",
  "person_id": 42
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot subscribe for other users
- `400`: Bad Request - Invalid person or podcast data
- `500`: Internal Server Error - Subscription failed

**Notes:**
- User can only subscribe to people for themselves
- Triggers background task to collect person's episodes
- Person metadata stored locally for faster access
- Associates person with specific podcast context
- Enables episode tracking across multiple podcasts

---

#### DELETE /api/data/person/unsubscribe/*user_id*/*person_id*

**Description:** Unsubscribe from a person/host to stop tracking their episodes

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `person_id` | integer | Yes | External person ID from subscription |

**Request Body:**
```json
{
  "person_name": "Joe Rogan"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `person_name` | string | Yes | Name of the person to unsubscribe from |

**Request Example:**
```bash
curl -X DELETE \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"person_name":"Joe Rogan"}' \
  http://localhost:8000/api/data/person/unsubscribe/123/789
```

**Response Example:**
```json
{
  "success": true,
  "message": "Successfully unsubscribed from person"
}
```

**Error Response Example:**
```json
{
  "success": false,
  "message": "Person subscription not found"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot unsubscribe for other users
- `404`: Not Found - Subscription not found
- `500`: Internal Server Error - Unsubscribe failed

**Notes:**
- User can only unsubscribe from their own person subscriptions
- Removes person from tracking list
- Episodes associated with person remain but are no longer tracked
- Returns success status even if subscription wasn't found

---

#### GET /api/data/person/subscriptions/*user_id*

**Description:** Get all person subscriptions for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/person/subscriptions/123
```

**Response Example:**
```json
{
  "subscriptions": [
    {
      "personid": 789,
      "userid": 123,
      "name": "Joe Rogan",
      "personimg": "https://example.com/joe-rogan.jpg",
      "peopledbid": 456,
      "associatedpodcasts": "456,789,123"
    },
    {
      "personid": 790,
      "userid": 123,
      "name": "Lex Fridman",
      "personimg": "https://example.com/lex-fridman.jpg",
      "peopledbid": 457,
      "associatedpodcasts": "789"
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' subscriptions
- `500`: Internal Server Error - Database error

**Notes:**
- User can only access their own person subscriptions
- Returns comprehensive person metadata and associations
- `associatedpodcasts` contains comma-separated podcast IDs
- Used to populate person subscription management interfaces
- Ordered alphabetically by person name

---

#### GET /api/data/person/episodes/*user_id*/*person_id*

**Description:** Get episodes featuring a specific person/host that the user has subscribed to

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `person_id` | integer | Yes | Person ID from user's subscriptions |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/person/episodes/123/789
```

**Response Example:**
```json
{
  "episodes": [
    {
      "episodeid": 12345,
      "episodetitle": "AI and the Future of Humanity",
      "episodedescription": "Discussion about artificial intelligence...",
      "episodeurl": "https://example.com/episode.mp3",
      "episodeartwork": "https://example.com/artwork.jpg",
      "episodepubdate": "2024-01-15T14:30:00Z",
      "episodeduration": 7200,
      "podcastname": "The Joe Rogan Experience",
      "saved": true,
      "completed": false,
      "user_subscribed": true
    },
    {
      "episodeid": null,
      "episodetitle": "Guest Episode on Another Show",
      "episodedescription": "Joe appears as a guest...",
      "episodeurl": "https://other-show.com/episode.mp3",
      "episodeartwork": "https://other-show.com/artwork.jpg", 
      "episodepubdate": "2024-01-10T10:00:00Z",
      "episodeduration": 5400,
      "podcastname": "Another Podcast",
      "saved": false,
      "completed": false,
      "user_subscribed": false
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' person episodes
- `404`: Not Found - Person subscription not found
- `500`: Internal Server Error - Database error

**Notes:**
- User can only access episodes for people they're subscribed to
- Returns episodes from both subscribed and non-subscribed podcasts
- `episodeid` is null for episodes from podcasts user isn't subscribed to
- `user_subscribed` indicates if user is subscribed to episode's podcast
- Episodes include playback status (saved, completed) when available
- Used to create personalized feeds based on host/guest appearances

---

## 🎛️ Media Controls & Customization

Media playback customization and notification management features that allow users to personalize their podcast listening experience with custom skip times, notification preferences, and platform integrations.

---

#### POST /api/data/adjust_skip_times

**Description:** Adjust custom skip forward and backward times for a specific podcast

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
  "start_skip": 30,
  "end_skip": 45,
  "user_id": 123
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `podcast_id` | integer | Yes | ID of the podcast to adjust skip times for |
| `start_skip` | integer | No | Seconds to skip at episode start (default: 0) |
| `end_skip` | integer | No | Seconds to skip at episode end (default: 0) |
| `user_id` | integer | Yes | User ID (must match API key owner) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"podcast_id":456,"start_skip":30,"end_skip":45,"user_id":123}' \
  http://localhost:8000/api/data/adjust_skip_times
```

**Response Example:**
```json
{
  "detail": "Skip times updated."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot modify other users' podcast settings
- `400`: Bad Request - Invalid podcast ID or skip values
- `500`: Internal Server Error - Database update failed

**Notes:**
- User can only adjust skip times for their own podcasts
- Skip times are applied automatically during playback
- Useful for skipping intros, outros, or ads consistently
- Values are in seconds and must be non-negative
- Settings are podcast-specific, not episode-specific

---

#### PUT /api/data/podcast/toggle_notifications

**Description:** Toggle notification settings for a specific podcast

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
  "enabled": true
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `podcast_id` | integer | Yes | ID of the podcast to toggle notifications for |
| `enabled` | boolean | Yes | Whether to enable (true) or disable (false) notifications |

**Request Example:**
```bash
curl -X PUT \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"podcast_id":456,"enabled":true}' \
  http://localhost:8000/api/data/podcast/toggle_notifications
```

**Response Example:**
```json
true
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot modify other users' podcast settings
- `404`: Not Found - Podcast not found or not owned by user
- `500`: Internal Server Error - Database update failed

**Notes:**
- User can only toggle notifications for their own podcasts
- Returns boolean indicating success/failure of the operation
- Requires global notification settings to be configured
- Only affects notifications for new episodes of the specified podcast
- Does not impact existing queued notifications

---

#### POST /api/data/podcast/notification_status

**Description:** Get the current notification status for a specific podcast

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
| `podcast_id` | integer | Yes | ID of the podcast to check notification status for |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"podcast_id":456}' \
  http://localhost:8000/api/data/podcast/notification_status
```

**Response Example:**
```json
{
  "enabled": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access other users' podcast settings
- `404`: Not Found - Podcast not found or does not belong to user
- `500`: Internal Server Error - Database query failed

**Notes:**
- User can only check notification status for their own podcasts
- Returns current notification setting for the specified podcast
- Used by client applications to show toggle states
- Does not indicate global notification system status

---

#### POST /api/data/user/test_notification

**Description:** Send a test notification to verify notification platform configuration

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
  "platform": "ntfy"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `platform` | string | Yes | Notification platform to test ("ntfy", "gotify", "discord", etc.) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"platform":"ntfy"}' \
  http://localhost:8000/api/data/user/test_notification
```

**Response Example:**
```json
{
  "detail": "Test notification sent successfully"
}
```

**Error Response Example:**
```json
{
  "error": "Failed to send test notification - check your settings"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot test notifications for other users
- `400`: Bad Request - Platform not found or invalid configuration
- `500`: Internal Server Error - Notification system error

**Notes:**
- User can only test their own notification configurations
- Requires notification platform settings to be configured first
- Sends a test message through the specified platform
- Supported platforms include ntfy, Gotify, Discord, and others
- Useful for verifying notification credentials and connectivity
- Returns detailed error messages for troubleshooting

---

## 📂 Categories & Organization

Category management features that allow users to organize their podcasts with custom categories and tags for better organization and discovery.

---

#### POST /api/data/add_category

**Description:** Add a custom category to a podcast for better organization

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
  "category": "Technology"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `podcast_id` | integer | Yes | ID of the podcast to add category to |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `category` | string | Yes | Name of the category to add |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"podcast_id":456,"user_id":123,"category":"Technology"}' \
  http://localhost:8000/api/data/add_category
```

**Response Example:**
```json
{
  "detail": "Category added successfully."
}
```

**Response Example (Category Already Exists):**
```json
{
  "detail": "Category already exists."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot modify other users' podcast categories
- `404`: Not Found - Podcast not found or not owned by user
- `500`: Internal Server Error - Database update failed

**Notes:**
- User can only add categories to their own podcasts
- Categories are stored as key-value pairs in JSON format
- Duplicate categories are detected and prevented
- Category keys are auto-generated sequential numbers
- Useful for organizing podcasts by topic, genre, or personal preferences
- Categories can be used for filtering and searching podcasts

---

#### POST /api/data/remove_category

**Description:** Remove a custom category from a podcast

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
  "category": "Technology"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `podcast_id` | integer | Yes | ID of the podcast to remove category from |
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `category` | string | Yes | Name of the category to remove |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"podcast_id":456,"user_id":123,"category":"Technology"}' \
  http://localhost:8000/api/data/remove_category
```

**Response Example:**
```json
{
  "detail": "Category removed."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot modify other users' podcast categories
- `404`: Not Found - Podcast not found, not owned by user, or category not found
- `500`: Internal Server Error - Database update failed

**Notes:**
- User can only remove categories from their own podcasts
- Removes category by matching the exact category name
- No error returned if category doesn't exist (idempotent operation)
- Categories are removed from the JSON structure in the database
- Used to clean up podcast organization when categories are no longer needed
- Does not affect other podcasts that may have the same category name

---

## RSS & External Access

### RSS Key Management

#### GET /api/data/get_rss_key

**Description:** Get or create an RSS access key for a specific user to enable RSS feed access

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to get/create RSS key for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  "http://localhost:8000/api/data/get_rss_key?user_id=123"
```

**Response Example:**
```json
{
  "rss_key": "rss_abc123def456789ghi012345jkl678901"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot get RSS key for other users (unless using web key)
- `500`: Internal Server Error - Failed to create/retrieve RSS key

**Notes:**
- Creates a new RSS key if user doesn't have one
- Returns existing RSS key if one already exists
- Web keys can retrieve RSS keys for any user
- RSS key is required to access RSS feeds
- Keys are automatically generated as UUIDs with "rss_" prefix

#### GET /api/data/rss_key

**Description:** Get the existing RSS key for the authenticated user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Parameters:** None (uses authenticated user's ID)

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/rss_key
```

**Response Example:**
```json
{
  "rss_key": "rss_abc123def456789ghi012345jkl678901"
}
```

**Error Response Example:**
```json
{
  "success": false,
  "message": "No RSS key found. Please enable RSS feeds first."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Invalid API key
- `404`: Not Found - No RSS key exists for user

**Notes:**
- Only returns existing RSS keys, does not create new ones
- User can only retrieve their own RSS key
- RSS feeds must be enabled in user settings before key is created
- Use `/api/data/get_rss_key` to automatically create a key if needed

### RSS Feed Access

#### GET /api/feed/*user_id*

**Description:** Generate and retrieve RSS 2.0 XML feed containing user's podcast episodes with full RSS functionality including filtering, limiting, and iTunes-compatible tags

**Authentication:** 🔓 RSS Key (via query parameter)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID whose feed to generate |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | string | Yes | User's RSS key (not regular API key) |
| `limit` | integer | No | Maximum episodes to return (default: 1000) |
| `podcast_id` | integer | No | Filter to specific podcast ID |
| `type` | string | No | Filter by source type ("podcast" or "youtube") |

**Request Example:**
```bash
curl -X GET \
  "http://localhost:8000/api/feed/123?api_key=rss_abc123def456789ghi012345jkl678901&limit=50&podcast_id=456"
```

**Response Example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>JohnDoe's PinePods Feed</title>
    <link>http://localhost:8000</link>
    <description>Personal podcast feed for JohnDoe</description>
    <language>en-us</language>
    <itunes:author>PinePods</itunes:author>
    <itunes:category text="Technology"/>
    
    <item>
      <title>Episode Title Here</title>
      <link>http://localhost:8000/api/stream/123/456/rss_key</link>
      <description><![CDATA[Episode description content here...]]></description>
      <pubDate>Wed, 15 Nov 2023 14:30:00 +0000</pubDate>
      <guid>http://localhost:8000/api/stream/123/456/rss_key</guid>
      <enclosure url="http://localhost:8000/api/stream/123/456/rss_key" type="audio/mpeg" length="0"/>
      <itunes:duration>45:30</itunes:duration>
      <itunes:image href="https://example.com/episode-artwork.jpg"/>
    </item>
    <!-- Additional episodes... -->
  </channel>
</rss>
```

**Error Response Example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<error>RSS feeds not enabled for this user</error>
```

**Error Responses:**
- `403`: Forbidden - Invalid RSS key or RSS feeds not enabled for user
- `404`: Not Found - User not found
- `500`: Internal Server Error - Feed generation failed

**Notes:**
- Returns RSS 2.0 XML format with iTunes namespace extensions
- Episodes are ordered by publication date (newest first)
- Supports both regular podcast episodes and YouTube videos
- Stream URLs use user's RSS key for authentication
- Domain is automatically detected from request headers (supports X-Forwarded-Proto)
- Filtering by `podcast_id` limits feed to episodes from specific podcast
- Source type filtering ("podcast"/"youtube") allows content type separation
- Episodes include duration, artwork, descriptions, and iTunes-compatible metadata
- RSS key validation ensures only authorized access to user's content
- Feed title includes username for identification
- Supports both downloaded and streamed content through unified stream API
- Episode descriptions are wrapped in CDATA for HTML content safety

---

## Multi-Factor Authentication

### MFA Setup & Management

#### GET /api/data/generate_mfa_secret/*user_id*

**Description:** Generate a new MFA secret key and QR code for Time-based One-Time Password (TOTP) authentication setup

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to generate MFA secret for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/generate_mfa_secret/123
```

**Response Example:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qr_code_svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 200 200\">...</svg>"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot generate MFA secrets for other users (unless using web key)
- `404`: Not Found - User not found
- `500`: Internal Server Error - MFA secret generation failed

**Notes:**
- Generates a random 160-bit (20-byte) Base32-encoded secret
- Creates TOTP-compatible QR code with 6-digit codes, 30-second intervals
- QR code includes provisioning URI: `otpauth://totp/Pinepods:user@email.com?secret=SECRET&issuer=Pinepods`
- Secret is temporarily stored until verified with `verify_temp_mfa`
- User can only generate MFA secrets for themselves (web keys can access any user)
- Uses SHA-1 algorithm with 6-digit codes refreshed every 30 seconds
- QR code returned as scalable SVG format (200x200 minimum dimensions)

#### POST /api/data/verify_temp_mfa

**Description:** Verify a temporary MFA code during setup to confirm TOTP app configuration is working correctly

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
  "mfa_code": "123456"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `mfa_code` | string | Yes | 6-digit TOTP code from authenticator app |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"mfa_code":"123456"}' \
  http://localhost:8000/api/data/verify_temp_mfa
```

**Response Example:**
```json
{
  "verified": true
}
```

**Error Response Example:**
```json
{
  "verified": false
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot verify MFA codes for other users (unless using web key)
- `500`: Internal Server Error - TOTP verification failed

**Notes:**
- Must be called after `generate_mfa_secret` to complete MFA setup
- Automatically saves MFA secret permanently if code verification succeeds
- Removes temporary secret from memory after successful verification
- Supports time window tolerance for clock drift between server and client
- Returns `verified: false` for invalid codes (not an error)
- One-time verification - secret moves from temporary to permanent storage
- Required step before MFA is fully enabled on the account

#### GET /api/data/check_mfa_enabled/*user_id*

**Description:** Check whether Multi-Factor Authentication is enabled for a specific user account

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to check MFA status for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/check_mfa_enabled/123
```

**Response Example:**
```json
{
  "mfa_enabled": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot check MFA status for other users (unless using web key or admin)
- `404`: Not Found - User not found

**Notes:**
- Returns true if user has a saved MFA secret in the database
- Users can only check their own MFA status
- Web keys and admin users can check any user's MFA status
- Used by frontend to display MFA setup options appropriately
- MFA is considered enabled once `save_mfa_secret` has been successfully called

#### POST /api/data/save_mfa_secret

**Description:** Manually save an MFA secret key to enable Multi-Factor Authentication for a user

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
  "mfa_secret": "JBSWY3DPEHPK3PXP"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `mfa_secret` | string | Yes | Base32-encoded TOTP secret key |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"mfa_secret":"JBSWY3DPEHPK3PXP"}' \
  http://localhost:8000/api/data/save_mfa_secret
```

**Response Example:**
```json
{
  "success": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot save MFA secrets for other users (unless using web key)
- `404`: Not Found - User not found
- `500`: Internal Server Error - Database update failed

**Notes:**
- Permanently stores MFA secret in user's database record
- Usually called automatically by `verify_temp_mfa` after successful verification
- Can be used to manually configure MFA if importing from another system
- Overwrites any existing MFA secret for the user
- User can only save MFA secrets for themselves (web keys can save for any user)
- Secret should be Base32-encoded TOTP-compatible string

#### POST /api/data/verify_mfa

**Description:** Verify a Multi-Factor Authentication code for an already-configured user during login or sensitive operations

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
  "mfa_code": "123456"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `mfa_code` | string | Yes | 6-digit TOTP code from authenticator app |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123,"mfa_code":"123456"}' \
  http://localhost:8000/api/data/verify_mfa
```

**Response Example:**
```json
{
  "valid": true
}
```

**Error Response Example:**
```json
{
  "valid": false
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot verify MFA codes for other users
- `404`: Not Found - User not found or MFA not enabled
- `500`: Internal Server Error - TOTP verification failed

**Notes:**
- Used for ongoing MFA verification after initial setup is complete
- Requires user to already have MFA enabled (saved secret exists)
- Validates 6-digit TOTP code against stored secret using current time
- Returns `valid: false` for incorrect codes (not an error response)
- Supports time window tolerance for minor clock synchronization issues
- User can only verify their own MFA codes
- Part of the complete MFA authentication flow for sensitive operations

#### DELETE /api/data/delete_mfa

**Description:** Remove Multi-Factor Authentication from a user account by deleting their saved MFA secret

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Parameters:** None (uses authenticated user's ID from API key)

**Request Example:**
```bash
curl -X DELETE \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/delete_mfa
```

**Response Example:**
```json
{
  "success": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Invalid API key
- `404`: Not Found - User not found
- `500`: Internal Server Error - Database update failed

**Notes:**
- Permanently removes MFA secret from user's database record
- User can only disable MFA on their own account
- Sets mfa_secret field to NULL in the Users table
- Returns success: true even if no MFA was previously enabled
- After deletion, user will no longer be required to provide MFA codes
- Does not affect any temporary MFA secrets stored during setup process
- Recommended to require current password verification before allowing MFA deletion

---

## OPML Import/Export

### Podcast Subscription Management

#### POST /api/data/import_opml

**Description:** Import podcast subscriptions from OPML format with background processing and real-time progress tracking

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
  "podcasts": [
    "https://feeds.example.com/podcast1.xml",
    "https://feeds.example.com/podcast2.xml",
    "https://feeds.example.com/podcast3.xml"
  ]
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `podcasts` | array[string] | Yes | List of podcast RSS feed URLs to import |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "podcasts": [
      "https://feeds.example.com/tech-podcast.xml",
      "https://feeds.example.com/news-show.xml"
    ]
  }' \
  http://localhost:8000/api/data/import_opml
```

**Response Example:**
```json
{
  "success": true,
  "message": "Import process started",
  "task_id": "opml_import_123_1703527800"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot import podcasts for other users
- `500`: Internal Server Error - Task creation or background processing failed

**Notes:**
- Processes imports asynchronously in background to handle large OPML files
- Creates a task manager entry for tracking overall import status
- Stores progress in Redis with 1-hour timeout for real-time updates
- Each podcast URL is individually processed with robust error handling
- Continues processing remaining podcasts even if some feeds fail
- Updates progress after each podcast attempt (successful or failed)
- Automatically extracts podcast metadata from RSS feeds
- Duplicate podcasts are handled gracefully by database constraints
- Task completion triggers cleanup of progress tracking data
- Use `/api/data/import_progress/*user_id*` to monitor real-time progress

#### GET /api/data/import_progress/*user_id*

**Description:** Get real-time progress updates for ongoing OPML import operations

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/import_progress/123
```

**Response Example (Import in progress):**
```json
{
  "current": 5,
  "total": 12,
  "current_podcast": "https://feeds.example.com/tech-podcast.xml"
}
```

**Response Example (Import completed/not running):**
```json
{
  "current": 0,
  "total": 0,
  "current_podcast": ""
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot check import progress for other users
- `500`: Internal Server Error - Redis connection failed

**Notes:**
- Returns live progress data stored in Redis during active imports
- Progress is updated after each podcast feed is processed
- `current` indicates number of podcasts processed so far
- `total` shows the complete number of podcasts in the import
- `current_podcast` displays the URL currently being processed
- Returns zeros when no import is active or after completion
- Progress data expires from Redis after 1 hour automatically
- Designed for polling by frontend applications to show progress bars
- User can only check their own import progress for privacy
- Does not distinguish between successful and failed podcast imports in count

#### POST /api/data/backup_user

**Description:** Export user's podcast subscriptions to OPML format for backup or migration purposes

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 123}' \
  http://localhost:8000/api/data/backup_user
```

**Response Example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Podcast Subscriptions</title>
  </head>
  <body>
    <outline text="Tech Talk Daily" title="Tech Talk Daily" type="rss" xmlUrl="https://feeds.example.com/tech-talk.xml" />
    <outline text="Morning News Podcast" title="Morning News Podcast" type="rss" xmlUrl="https://feeds.example.com/morning-news.xml" />
    <outline text="History Stories" title="History Stories" type="rss" xmlUrl="https://feeds.example.com/history.xml" />
  </body>
</opml>
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot backup data for other users (unless using web key)
- `404`: Not Found - User not found
- `500`: Internal Server Error - Database query or OPML generation failed

**Notes:**
- Generates valid OPML 2.0 format compatible with most podcast applications
- Includes all podcast subscriptions associated with the user account
- XML characters in podcast names and URLs are properly escaped
- Each subscription becomes an `<outline>` element with required attributes
- `text` and `title` attributes both contain the podcast name
- `type="rss"` indicates RSS feed format
- `xmlUrl` contains the original RSS feed URL
- User can only backup their own data (web keys can backup any user)
- Returns raw OPML XML content, not JSON-wrapped
- Output can be directly imported into other podcast applications
- No episode data is included, only subscription information
- Podcast order matches database storage order (typically by name)

---

## API Key Management

### Key Creation & Administration

#### POST /api/data/create_api_key

**Description:** Create a new API key for user authentication, with support for both standard API keys and RSS-only keys with podcast filtering

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
  "rssonly": false,
  "podcast_ids": null
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `rssonly` | boolean | Yes | If true, creates RSS-only key; if false, creates standard API key |
| `podcast_ids` | array[integer] | No | List of podcast IDs for RSS key filtering (only used when rssonly=true) |

**Request Example (Standard API Key):**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "rssonly": false,
    "podcast_ids": null
  }' \
  http://localhost:8000/api/data/create_api_key
```

**Request Example (RSS-Only Key):**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "rssonly": true,
    "podcast_ids": [456, 789, 101112]
  }' \
  http://localhost:8000/api/data/create_api_key
```

**Response Example (Standard API Key):**
```json
{
  "api_key": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789AB"
}
```

**Response Example (RSS-Only Key):**
```json
{
  "rss_key": "rss_abc123def456789ghi012345jkl678901"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot create API keys for other users (unless using web key)
- `500`: Internal Server Error - Database key creation failed

**Notes:**
- Generates 64-character random alphanumeric API keys using secure random generation
- Standard API keys provide full access to all API endpoints for the user
- RSS-only keys are limited to RSS feed access with optional podcast filtering
- User can only create API keys for themselves (web keys can create for any user)
- Keys are immediately active and stored in database with creation timestamp
- No practical limit on number of API keys per user
- API keys do not expire automatically but can be manually deleted
- RSS keys with podcast_ids filter access to only specified podcasts

#### DELETE /api/data/delete_api_key

**Description:** Delete an API key with comprehensive safety checks to prevent account lockouts and system disruption

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "api_id": "42",
  "user_id": "123"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_id` | string | Yes | API key ID to delete (as string, will be parsed to integer) |
| `user_id` | string | Yes | User ID (provided but not used for authorization) |

**Request Example:**
```bash
curl -X DELETE \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "api_id": "42",
    "user_id": "123"
  }' \
  http://localhost:8000/api/data/delete_api_key
```

**Response Example:**
```json
{
  "detail": "API key deleted."
}
```

**Error Responses:**
- `400`: Bad Request - Invalid api_id format (not a valid integer)
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Multiple authorization failure scenarios (see notes)
- `404`: Not Found - API key not found
- `500`: Internal Server Error - Database deletion failed

**Error Response Examples:**
```json
{
  "success": false,
  "message": "You are not authorized to access or remove other users api-keys."
}
```

```json
{
  "success": false,
  "message": "You cannot delete the API key that is currently in use."
}
```

```json
{
  "success": false,
  "message": "Cannot delete your final API key - you must have at least one key to maintain access."
}
```

**Notes:**
- **Authorization Logic**: Admin users can delete any key except background task keys (user_id=1), regular users can only delete their own keys
- **Self-Deletion Protection**: Cannot delete the API key currently being used for the request
- **Background Task Protection**: Keys belonging to user_id=1 (background tasks) cannot be deleted by anyone
- **Account Lockout Prevention**: Users must retain at least one API key to maintain system access
- **Admin Safety**: Admins cannot delete another user's final API key to prevent lockouts
- **Database Consistency**: Performs multiple validation queries before deletion
- **Audit Logging**: Debug logging tracks deletion attempts with user and ownership details
- User_id parameter in request body is not used for authorization (determined by API key)

#### GET /api/data/get_api_info/*user_id*

**Description:** Retrieve comprehensive API key information for a user, with admin users seeing all keys and regular users seeing only their own

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to get API key information for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/get_api_info/123
```

**Response Example (Regular User):**
```json
{
  "api_info": [
    {
      "apikeyid": 42,
      "userid": 123,
      "username": "johndoe",
      "lastfourdigits": "AB12",
      "created": "2023-11-15 14:30:00",
      "podcastids": []
    },
    {
      "apikeyid": 43,
      "userid": 123,
      "username": "johndoe",
      "lastfourdigits": "CD34",
      "created": "2023-11-20 09:15:00",
      "podcastids": [456, 789]
    }
  ]
}
```

**Response Example (Admin User - All Keys):**
```json
{
  "api_info": [
    {
      "apikeyid": 41,
      "userid": 1,
      "username": "background_tasks",
      "lastfourdigits": "SYS1",
      "created": "2023-01-01 00:00:00",
      "podcastids": []
    },
    {
      "apikeyid": 42,
      "userid": 123,
      "username": "johndoe",
      "lastfourdigits": "AB12",
      "created": "2023-11-15 14:30:00",
      "podcastids": []
    },
    {
      "apikeyid": 44,
      "userid": 456,
      "username": "janedoe",
      "lastfourdigits": "EF56",
      "created": "2023-11-22 16:45:00",
      "podcastids": [101, 202, 303]
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access API key information for other users (unless web key)
- `404`: Not Found - User not found
- `500`: Internal Server Error - Database query failed

**Notes:**
- **Admin Visibility**: Admin users see ALL API keys across the entire system
- **User Privacy**: Regular users only see their own API keys
- **Security**: Only last 4 digits of API keys are displayed for security
- **Web Key Access**: Web keys can access any user's API key information
- **Comprehensive Data**: Includes key ID, user info, creation timestamp, and associated podcast IDs
- **Database Join**: Efficiently joins APIKeys and Users tables for username display
- **RSS Key Support**: Shows podcast IDs for RSS-only keys (empty array for standard keys)
- **Timestamp Format**: Creation dates returned as readable timestamp strings
- **System Keys**: Background task keys (user_id=1) visible to admins for system monitoring
- Authorization determined by API key ownership, not path parameter

---

## Sync Services (GPodder/Nextcloud)

### Nextcloud Integration

#### POST /api/data/initiate_nextcloud_login

**Description:** Start Nextcloud login flow v2 authentication process to obtain login credentials for sync integration

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
  "nextcloud_url": "https://nextcloud.example.com"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `nextcloud_url` | string | Yes | Full URL to Nextcloud instance |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "nextcloud_url": "https://nextcloud.example.com"
  }' \
  http://localhost:8000/api/data/initiate_nextcloud_login
```

**Response Example:**
```json
{
  "poll": {
    "token": "abc123def456",
    "endpoint": "https://nextcloud.example.com/index.php/login/v2/poll"
  },
  "login": "https://nextcloud.example.com/index.php/login/v2/flow/abc123def456"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot initiate login for other users
- `500`: Internal Server Error - Failed to connect to Nextcloud or invalid response

**Notes:**
- Implements Nextcloud Login Flow v2 for secure authentication
- Returns polling token for monitoring authentication completion
- User must visit the login URL to authorize the application
- Poll endpoint should be used to check for authentication completion
- Only the user associated with the API key can initiate their own login
- URL is automatically formatted to use correct Nextcloud login endpoint
- Raw response from Nextcloud is returned directly to client

#### POST /api/data/add_nextcloud_server

**Description:** Complete Nextcloud server setup by polling for authentication completion and storing credentials

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
  "nextcloud_url": "https://nextcloud.example.com",
  "token": "abc123def456"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |
| `nextcloud_url` | string | Yes | Full URL to Nextcloud instance |
| `token` | string | Yes | Poll token from initiate_nextcloud_login response |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "nextcloud_url": "https://nextcloud.example.com",
    "token": "abc123def456"
  }' \
  http://localhost:8000/api/data/add_nextcloud_server
```

**Response Example:**
```json
{
  "status": "success",
  "message": "Nextcloud server added successfully"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot add server for other users
- `408`: Request Timeout - Authentication polling timed out
- `500`: Internal Server Error - Failed to complete authentication or store credentials

**Notes:**
- Clears any existing sync configuration before adding Nextcloud
- Creates background task for authentication polling process
- Continuously polls Nextcloud until authentication completes or times out
- Stores encrypted Nextcloud credentials in user database record
- Sets sync type to "nextcloud" upon successful completion
- User must complete web-based authorization before this endpoint succeeds
- Background task handles all polling logic asynchronously
- Returns success only after credentials are fully stored and verified

### GPodder Integration

#### POST /api/data/verify_gpodder_auth

**Description:** Test GPodder server credentials by attempting authentication against the GPodder API

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "gpodder_url": "https://gpodder.example.com",
  "gpodder_username": "username",
  "gpodder_password": "password"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `gpodder_url` | string | Yes | Base URL of GPodder server |
| `gpodder_username` | string | Yes | GPodder username for authentication |
| `gpodder_password` | string | Yes | GPodder password for authentication |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "gpodder_url": "https://gpodder.example.com",
    "gpodder_username": "myuser",
    "gpodder_password": "mypass"
  }' \
  http://localhost:8000/api/data/verify_gpodder_auth
```

**Response Example:**
```json
{
  "status": "success",
  "message": "Logged in!"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key or GPodder authentication failed
- `500`: Internal Server Error - Failed to connect to GPodder server

**Notes:**
- Makes direct HTTP call to GPodder login endpoint for verification
- Uses GPodder API v2 authentication with basic auth
- Does not store credentials - only tests authentication
- Authentication URL format: `{gpodder_url}/api/2/auth/{username}/login.json`
- Password is sent securely using HTTP basic authentication
- Use this endpoint before `add_gpodder_server` to verify credentials
- Does not require specific user authorization - any authenticated user can test credentials

#### POST /api/data/add_gpodder_server

**Description:** Configure GPodder sync by storing encrypted server credentials and enabling synchronization

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "gpodder_url": "https://gpodder.example.com",
  "gpodder_username": "username",
  "gpodder_password": "password"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `gpodder_url` | string | Yes | Base URL of GPodder server |
| `gpodder_username` | string | Yes | GPodder username |
| `gpodder_password` | string | Yes | GPodder password (will be encrypted) |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "gpodder_url": "https://gpodder.example.com",
    "gpodder_username": "myuser",
    "gpodder_password": "mypass"
  }' \
  http://localhost:8000/api/data/add_gpodder_server
```

**Response Example:**
```json
{
  "status": "success"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `500`: Internal Server Error - Failed to encrypt password or store credentials

**Notes:**
- Encrypts password before storing in database for security
- Sets sync type to "external" for external GPodder servers
- User can only configure sync for their own account
- Overwrites any existing GPodder configuration for the user
- Does not verify credentials - use `verify_gpodder_auth` first
- Stored credentials enable automatic synchronization processes
- Password encryption uses system encryption keys for security

### Sync Configuration Management

#### GET /api/data/get_gpodder_settings/*user_id*

**Description:** Retrieve GPodder synchronization settings and configuration for a specific user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to get settings for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/get_gpodder_settings/123
```

**Response Example:**
```json
{
  "data": {
    "gpodder_url": "https://gpodder.example.com",
    "gpodder_login": "myuser",
    "pod_sync_type": "external"
  }
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot access settings for other users (unless web key)
- `404`: Not Found - GPodder settings not found for user

**Notes:**
- Returns sync configuration including server URL and username
- Password/token information is never included in response for security
- Web keys can access any user's settings for administrative purposes
- Regular users can only access their own settings
- Includes sync type (None, external, internal, nextcloud, both)
- Empty or null values indicate unconfigured settings
- Used by frontend to display current sync configuration

#### GET /api/data/check_gpodder_settings/*user_id*

**Description:** Check if GPodder synchronization is configured for a user (boolean check)

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID to check settings for |

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/check_gpodder_settings/123
```

**Response Example:**
```json
{
  "data": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot check settings for other users (unless web key)

**Notes:**
- Returns boolean indicating if GPodder sync is configured
- Checks for presence of both GPodder URL and login name
- Does not verify if credentials are still valid
- Web keys can check any user's configuration status
- Regular users can only check their own settings
- Useful for UI conditional rendering of sync features
- Returns false if either URL or username is missing

#### DELETE /api/data/remove_podcast_sync

**Description:** Remove all podcast synchronization settings and disable sync for a user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "user_id": 123
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | User ID (must match API key owner) |

**Request Example:**
```bash
curl -X DELETE \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 123}' \
  http://localhost:8000/api/data/remove_podcast_sync
```

**Response Example:**
```json
{
  "status": "success"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `403`: Forbidden - Cannot remove sync for other users
- `500`: Internal Server Error - Database update failed

**Notes:**
- Clears all sync-related fields: URL, username, token, and sync type
- Sets sync type to "None" to disable all synchronization
- User can only remove their own sync configuration
- Affects both GPodder and Nextcloud sync settings
- Does not affect existing podcast subscriptions or episode data
- Stops all automatic synchronization processes
- Irreversible action - user must reconfigure sync from scratch

### Sync Status & Control

#### GET /api/data/gpodder/status

**Description:** Get comprehensive GPodder synchronization status and statistics for the authenticated user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X GET \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  http://localhost:8000/api/data/gpodder/status
```

**Response Example:**
```json
{
  "server_url": "https://gpodder.example.com",
  "sync_type": "external",
  "sync_enabled": true,
  "server_devices": [
    {"device_id": "device1", "name": "Phone"},
    {"device_id": "device2", "name": "Desktop"}
  ],
  "total_devices": 2,
  "server_subscriptions": [
    {"url": "https://feeds.example.com/podcast1.xml"},
    {"url": "https://feeds.example.com/podcast2.xml"}
  ],
  "total_subscriptions": 2,
  "recent_episode_actions": [
    {"action": "play", "episode": "Episode 1", "timestamp": "2023-11-15T14:30:00Z"}
  ],
  "total_episode_actions": 1,
  "connection_status": "All endpoints working",
  "last_sync_timestamp": "2023-11-15 14:25:00 UTC"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `500`: Internal Server Error - Failed to retrieve sync status

**Notes:**
- Only authenticated user can access their own sync status
- Returns comprehensive sync statistics including device and subscription counts
- Connection status indicates API endpoint health
- Episode actions show recent synchronization activity
- Empty arrays returned when no sync is configured (sync_type: "None")
- Last sync timestamp shows when synchronization last completed
- Used for sync diagnostics and monitoring dashboard
- Automatically determined from API key - no user_id parameter needed

#### POST /api/data/gpodder/toggle

**Description:** Toggle GPodder synchronization on/off for the authenticated user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
```json
{
  "enabled": true
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | boolean | Yes | Whether to enable (true) or disable (false) sync |

**Request Example:**
```bash
curl -X POST \
  -H "Api-Key: pk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}' \
  http://localhost:8000/api/data/gpodder/toggle
```

**Response Example:**
```json
{
  "status": "success",
  "sync_enabled": false,
  "sync_type": "None"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid API key
- `500`: Internal Server Error - Failed to update sync status

**Notes:**
- Toggles between current sync type and "None" without losing configuration
- When enabling, restores previous sync type or defaults to "external"
- When disabling, sets sync type to "None" but preserves credentials
- Only affects the authenticated user's sync settings
- Does not clear stored credentials - only toggles active synchronization
- Useful for temporarily disabling sync without full reconfiguration
- Returns current sync status after toggle operation

---

## Custom Podcast Management

Administrative functionality for adding custom podcast feeds with optional authentication credentials.

### POST /api/data/add_custom_podcast

**Description:** Add a custom podcast feed with optional HTTP basic authentication credentials

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| feed_url | string | Yes | RSS/Atom feed URL for the podcast |
| user_id | integer | Yes | User ID to add the podcast for |
| username | string | No | HTTP basic auth username (if feed requires auth) |
| password | string | No | HTTP basic auth password (if feed requires auth) |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "feed_url": "https://example.com/podcast/feed.xml",
       "user_id": 123,
       "username": "feeduser",
       "password": "feedpass"
     }' \
     http://localhost:8000/api/data/add_custom_podcast
```

**Response Example (Success):**
```json
{
  "status": "success",
  "podcast_id": 456,
  "message": "Custom podcast added successfully"
}
```

**Error Responses:**
- `400`: Bad Request - Invalid feed URL or malformed request
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required or insufficient privileges
- `404`: Not Found - Feed URL not accessible or user not found
- `500`: Internal Server Error - Database error or feed parsing failed

**Implementation Notes:**
- **Admin Only**: Requires admin API key privileges for security
- **Feed Parsing**: Uses feed-rs library to parse RSS/Atom feeds
- **HTTP Authentication**: Supports basic auth for password-protected feeds
- **Default Cutoff**: Sets 30-episode retention limit (matches Python default)
- **User Assignment**: Adds podcast to specified user's subscription list
- **Metadata Extraction**: Automatically extracts title, description, artwork from feed
- **Feed Validation**: Validates feed format and accessibility before adding
- **Python Compatibility**: Matches Python add_custom_podcast endpoint functionality

---

## OIDC Provider Management

Administrative functionality for managing OpenID Connect identity providers for federated authentication.

### POST /api/data/add_oidc_provider

**Description:** Add a new OpenID Connect identity provider for federated authentication

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
-H "Content-Type: application/json"
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| provider_name | string | Yes | Unique name identifier for the provider |
| client_id | string | Yes | OAuth2/OIDC client ID from provider |
| client_secret | string | Yes | OAuth2/OIDC client secret from provider |
| authorization_url | string | Yes | Provider's authorization endpoint URL |
| token_url | string | Yes | Provider's token exchange endpoint URL |
| user_info_url | string | Yes | Provider's user information endpoint URL |
| button_text | string | Yes | Display text for login button |
| scope | string | Yes | OAuth2 scopes to request (space-separated) |
| button_color | string | Yes | Hex color code for login button background |
| button_text_color | string | Yes | Hex color code for login button text |
| icon_svg | string | No | SVG icon for provider button (optional) |
| name_claim | string | No | JWT claim for user's display name (default: "name") |
| email_claim | string | No | JWT claim for user's email address (default: "email") |
| username_claim | string | No | JWT claim for user's username (default: "username") |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "provider_name": "google",
       "client_id": "your-google-client-id.apps.googleusercontent.com",
       "client_secret": "your-google-client-secret",
       "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth",
       "token_url": "https://oauth2.googleapis.com/token",
       "user_info_url": "https://www.googleapis.com/oauth2/v2/userinfo",
       "button_text": "Sign in with Google",
       "scope": "openid email profile",
       "button_color": "#4285f4",
       "button_text_color": "#ffffff",
       "icon_svg": "<svg>...</svg>",
       "name_claim": "name",
       "email_claim": "email",
       "username_claim": "email"
     }' \
     http://localhost:8000/api/data/add_oidc_provider
```

**Response Example (Success):**
```json
{
  "status": "success",
  "provider_id": 789,
  "message": "OIDC provider added successfully"
}
```

**Error Responses:**
- `400`: Bad Request - Invalid URLs or malformed provider configuration
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `409`: Conflict - Provider name already exists
- `500`: Internal Server Error - Database error or provider validation failed

**Implementation Notes:**
- **Admin Only**: Requires admin API key privileges for security
- **Provider Validation**: Validates all URLs are properly formatted
- **Secure Storage**: Client secrets are encrypted in database storage
- **JWT Claims**: Configurable claim mapping for user attributes
- **Visual Customization**: Supports custom button colors and SVG icons
- **Scope Configuration**: Flexible OAuth2 scope specification
- **Provider Testing**: Validates provider endpoints during addition
- **Python Compatibility**: Matches Python add_oidc_provider endpoint functionality

### GET /api/data/list_oidc_providers

**Description:** List all configured OpenID Connect identity providers

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/data/list_oidc_providers
```

**Response Example (Success):**
```json
{
  "providers": [
    {
      "id": 1,
      "provider_name": "google",
      "client_id": "your-google-client-id.apps.googleusercontent.com",
      "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth",
      "token_url": "https://oauth2.googleapis.com/token",
      "user_info_url": "https://www.googleapis.com/oauth2/v2/userinfo",
      "button_text": "Sign in with Google",
      "scope": "openid email profile",
      "button_color": "#4285f4",
      "button_text_color": "#ffffff",
      "icon_svg": "<svg>...</svg>",
      "name_claim": "name",
      "email_claim": "email",
      "username_claim": "email"
    },
    {
      "id": 2,
      "provider_name": "microsoft",
      "client_id": "your-microsoft-client-id",
      "authorization_url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      "token_url": "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      "user_info_url": "https://graph.microsoft.com/v1.0/me",
      "button_text": "Sign in with Microsoft",
      "scope": "openid email profile",
      "button_color": "#0078d4",
      "button_text_color": "#ffffff",
      "icon_svg": null,
      "name_claim": "displayName",
      "email_claim": "mail",
      "username_claim": "userPrincipalName"
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Database error retrieving providers

**Implementation Notes:**
- **Public Listing**: Available to all authenticated users for login form generation
- **No Secrets**: Client secrets are excluded from response for security
- **Complete Configuration**: Returns all non-sensitive provider configuration
- **Frontend Integration**: Used by login forms to display available providers
- **Provider Status**: Only returns active/enabled providers
- **Python Compatibility**: Matches Python list_oidc_providers endpoint functionality

---

## 👑 Admin ENDPOINTS (Administrative privileges required)

---

## 👑 Admin User Management

Administrative endpoints for comprehensive user account management including creation, deletion, permissions, and system-wide user oversight. All endpoints require admin privileges.

### GET /api/data/get_user_info

**Description:** Get comprehensive information for all users in the system

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_ADMIN_API_KEY" \
     http://localhost:8000/api/data/get_user_info
```

**Response Example:**
```json
[
  {
    "userid": 1,
    "fullname": "Admin User",
    "username": "admin",
    "email": "admin@example.com",
    "isadmin": 1
  },
  {
    "userid": 2,
    "fullname": "John Smith",
    "username": "jsmith",
    "email": "john@example.com",
    "isadmin": 0
  },
  {
    "userid": 3,
    "fullname": "Jane Doe",
    "username": "jdoe",
    "email": "jane@example.com",
    "isadmin": 0
  }
]
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Admin Only**: Requires admin privileges to access system-wide user information
- **Complete Data**: Returns all user fields including sensitive admin status
- **Boolean Conversion**: `isadmin` field serialized as integer (1/0) for Python compatibility
- **No Pagination**: Returns all users in system (consider pagination for large deployments)
- **Python Compatibility**: Matches Python `api_get_user_info` function exactly

---

### POST /api/data/add_user

**Description:** Create a new user account with admin privileges

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullname | string | Yes | User's full display name |
| username | string | Yes | Unique username (will be converted to lowercase) |
| email | string | Yes | Unique email address |
| hash_pw | string | Yes | Pre-hashed password (bcrypt recommended) |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_ADMIN_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"fullname":"New User","username":"newuser","email":"newuser@example.com","hash_pw":"$2b$12$hashed_password_here"}' \
     http://localhost:8000/api/data/add_user
```

**Response Example (Success):**
```json
{
  "detail": "Success",
  "user_id": 4
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `409`: Conflict - Username or email already exists
  ```json
  {
    "error": "This username is already taken. Please choose a different username."
  }
  ```
  ```json
  {
    "error": "This email is already in use. Please use a different email address."
  }
  ```
- `500`: Internal Server Error - Failed to create user

**Implementation Notes:**
- **Admin Only**: Only administrators can create user accounts via this endpoint
- **Username Normalization**: Username automatically converted to lowercase
- **Password Security**: Expects pre-hashed password, does not hash plain text
- **Unique Constraints**: Both username and email must be unique system-wide
- **User ID Return**: Returns newly created user's ID for reference
- **Python Compatibility**: Matches Python `api_add_user` function exactly

---

### DELETE /api/data/user/delete/*user_id*

**Description:** Permanently delete a user account and all associated data

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | ID of user to delete |

**Request Example:**
```bash
curl -X DELETE -H "Api-Key: YOUR_ADMIN_API_KEY" \
     http://localhost:8000/api/data/user/delete/123
```

**Response Example:**
```json
{
  "status": "User deleted"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `404`: Not Found - User ID does not exist
- `500`: Internal Server Error - Deletion failed

**Implementation Notes:**
- **Admin Only**: Requires administrator privileges for user deletion
- **Permanent Action**: User deletion is irreversible and removes all associated data
- **Cascade Delete**: Removes user's podcasts, episodes, history, and all related records
- **Safety Considerations**: No confirmation prompt - ensure proper UI warnings
- **Final Admin Protection**: System should prevent deletion of final admin user
- **Python Compatibility**: Matches Python `api_delete_user` function exactly

---

### PUT /api/data/user/set_isadmin

**Description:** Grant or revoke administrative privileges for a user

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_id | integer | Yes | ID of user to modify |
| isadmin | boolean | Yes | Whether user should have admin privileges |

**Request Example (Grant Admin):**
```bash
curl -X PUT -H "Api-Key: YOUR_ADMIN_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"user_id":123,"isadmin":true}' \
     http://localhost:8000/api/data/user/set_isadmin
```

**Request Example (Revoke Admin):**
```bash
curl -X PUT -H "Api-Key: YOUR_ADMIN_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"user_id":123,"isadmin":false}' \
     http://localhost:8000/api/data/user/set_isadmin
```

**Response Example:**
```json
{
  "detail": "IsAdmin status updated."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `404`: Not Found - User ID does not exist
- `500`: Internal Server Error - Update failed

**Implementation Notes:**
- **Admin Only**: Only administrators can modify admin privileges
- **Permission Management**: Controls access to all admin-only endpoints and features
- **Final Admin Check**: Should prevent removal of admin status from final admin
- **Immediate Effect**: Changes take effect immediately for active sessions
- **Security Critical**: Grants access to all administrative functions
- **Python Compatibility**: Matches Python `api_set_isadmin` function exactly

---

### GET /api/data/user/final_admin/*user_id*

**Description:** Check if a user is the final (last remaining) administrator in the system

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to check final admin status |

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_ADMIN_API_KEY" \
     http://localhost:8000/api/data/user/final_admin/1
```

**Response Example (Is Final Admin):**
```json
{
  "final_admin": true
}
```

**Response Example (Not Final Admin):**
```json
{
  "final_admin": false
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `404`: Not Found - User ID does not exist
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Admin Only**: Requires administrator privileges to check final admin status
- **System Protection**: Used to prevent deletion or demotion of final admin
- **UI Integration**: Frontend should disable delete/demote buttons for final admin
- **Business Logic**: System must always maintain at least one administrator
- **Safety Check**: Critical for preventing system lockout scenarios
- **Python Compatibility**: Matches Python `api_final_admin` function exactly

---

### GET /api/data/user_admin_check/*user_id*

**Description:** Check if a specific user has administrative privileges

**Authentication:** 🔐 User API Key (Self-check only)

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID to check (must match API key owner) |

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/data/user_admin_check/123
```

**Response Example (Is Admin):**
```json
{
  "is_admin": true
}
```

**Response Example (Not Admin):**
```json
{
  "is_admin": false
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Can only check your own admin status
- `404`: Not Found - User ID does not exist
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Self-Check Only**: Users can only check their own admin status for security
- **Authorization Restriction**: API key must belong to the user being checked
- **UI Integration**: Used by frontend to show/hide admin features and menus
- **Session Management**: Helps determine user capabilities and interface elements
- **Security Model**: Prevents users from probing other users' privilege levels
- **Python Compatibility**: Matches Python `api_user_admin_check_route` function exactly

---

## System Configuration

Administrative endpoints for managing system-wide settings including guest access, download permissions, self-service registration, and RSS feed features. All endpoints require admin privileges.

### POST /api/data/enable_disable_guest

**Description:** Toggle guest access on/off for the PinePods instance

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
```

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_ADMIN_API_KEY" \
     http://localhost:8000/api/data/enable_disable_guest
```

**Response Example:**
```json
{
  "success": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Admin Only**: Requires administrator privileges to toggle guest access
- **Toggle Behavior**: Switches between enabled/disabled states automatically
- **System Wide**: Affects all non-authenticated access to the application
- **Security Impact**: Controls whether unauthenticated users can access content
- **Python Compatibility**: Matches Python `api_enable_disable_guest` function exactly

---

### POST /api/data/enable_disable_downloads

**Description:** Toggle download functionality on/off for the PinePods instance

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
```

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_ADMIN_API_KEY" \
     http://localhost:8000/api/data/enable_disable_downloads
```

**Response Example:**
```json
{
  "success": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Admin Only**: Requires administrator privileges to control download feature
- **Toggle Behavior**: Switches between enabled/disabled states automatically
- **System Wide**: Affects all users' ability to download podcast episodes
- **Storage Impact**: Disabling prevents new downloads but doesn't remove existing files
- **UI Integration**: Frontend should hide/show download buttons based on this setting
- **Python Compatibility**: Matches Python `api_enable_disable_downloads` function exactly

---

### POST /api/data/enable_disable_self_service

**Description:** Toggle self-service user registration on/off for the PinePods instance

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
```

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_ADMIN_API_KEY" \
     http://localhost:8000/api/data/enable_disable_self_service
```

**Response Example:**
```json
{
  "success": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Admin Only**: Requires administrator privileges to control user registration
- **Toggle Behavior**: Switches between enabled/disabled states automatically
- **Registration Control**: Affects `/api/data/add_login_user` endpoint availability
- **Security Feature**: Prevents unauthorized user account creation when disabled
- **UI Integration**: Registration forms should check this status before allowing signups
- **Python Compatibility**: Matches Python `api_enable_disable_self_service` function exactly

---

### GET /api/data/guest_status

**Description:** Get current guest access status for the PinePods instance

**Authentication:** 🔐 User API Key (Any authenticated user)

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/data/guest_status
```

**Response Example (Enabled):**
```json
true
```

**Response Example (Disabled):**
```json
false
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Public Check**: Any authenticated user can check guest access status
- **Boolean Response**: Simple true/false indicating if guest access is enabled
- **UI Integration**: Used by frontend to show/hide guest access features
- **Security Information**: Helps determine if unauthenticated browsing is available
- **Python Compatibility**: Matches Python `api_guest_status` function exactly

---

### GET /api/data/download_status

**Description:** Get current download feature status for the PinePods instance

**Authentication:** 🔐 User API Key (Any authenticated user)

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/data/download_status
```

**Response Example (Enabled):**
```json
true
```

**Response Example (Disabled):**
```json
false
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Public Check**: Any authenticated user can check download feature status
- **Boolean Response**: Simple true/false indicating if downloads are enabled
- **UI Integration**: Used by frontend to show/hide download buttons and features
- **Feature Control**: Determines availability of episode download functionality
- **Python Compatibility**: Matches Python `api_download_status` function exactly

---

### GET /api/data/admin_self_service_status

**Description:** Get detailed self-service registration status including admin existence

**Authentication:** 🔐 User API Key (Any authenticated user)

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/data/admin_self_service_status
```

**Response Example:**
```json
{
  "status": true,
  "first_admin_created": true
}
```

**Response Example (Registration Disabled):**
```json
{
  "status": false,
  "first_admin_created": true
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Public Check**: Any authenticated user can check self-service status
- **Detailed Response**: Includes both registration status and admin existence
- **Setup Integration**: `first_admin_created` helps determine if initial setup is complete
- **Registration Control**: `status` indicates if new user registration is allowed
- **Setup Flow**: Used during initial application setup and configuration
- **Python Compatibility**: Matches Python `api_self_service_status` function exactly

---

### GET /api/data/rss_feed_status

**Description:** Get RSS feed feature status for the authenticated user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/data/rss_feed_status
```

**Response Example (Enabled):**
```json
true
```

**Response Example (Disabled):**
```json
false
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **User-Specific**: Returns RSS feed status for the authenticated user
- **Boolean Response**: Simple true/false indicating if RSS feeds are enabled
- **Feature Control**: Determines availability of RSS feed generation for user
- **Privacy Control**: Allows users to control public access to their podcast feeds
- **Python Compatibility**: Matches Python `get_rss_feed_status` function exactly

---

### POST /api/data/toggle_rss_feeds

**Description:** Toggle RSS feed feature on/off for the authenticated user

**Authentication:** 🔐 User API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_API_KEY"
```

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_API_KEY" \
     http://localhost:8000/api/data/toggle_rss_feeds
```

**Response Example:**
```json
{
  "success": true,
  "enabled": true
}
```

**Response Example (Disabled):**
```json
{
  "success": true,
  "enabled": false
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **User-Specific**: Toggles RSS feed feature for the authenticated user only
- **Toggle Behavior**: Switches between enabled/disabled states automatically
- **Return Status**: Response includes the new status after toggling
- **Privacy Feature**: Allows users to control public access to their RSS feeds
- **Feed Access**: When disabled, RSS feed URLs become inaccessible
- **Python Compatibility**: Matches Python `toggle_rss_feeds` function exactly

---

## Email Settings

Administrative endpoints for configuring and managing SMTP email settings, testing email functionality, and sending emails through the system. All endpoints require admin privileges.

### POST /api/data/save_email_settings

**Description:** Configure SMTP email server settings for the PinePods instance

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email_settings | object | Yes | Email configuration object |
| email_settings.server_name | string | Yes | SMTP server hostname |
| email_settings.server_port | string/integer | Yes | SMTP server port number |
| email_settings.from_email | string | Yes | Email address to send from |
| email_settings.send_mode | string | Yes | Send mode (typically "SMTP") |
| email_settings.encryption | string | Yes | Encryption type ("SSL/TLS", "STARTTLS", "None") |
| email_settings.auth_required | boolean | Yes | Whether SMTP authentication is required |
| email_settings.email_username | string | No | SMTP username (if auth_required) |
| email_settings.email_password | string | No | SMTP password (if auth_required) |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_ADMIN_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"email_settings":{"server_name":"smtp.gmail.com","server_port":"587","from_email":"noreply@example.com","send_mode":"SMTP","encryption":"STARTTLS","auth_required":true,"email_username":"user@gmail.com","email_password":"app_password"}}' \
     http://localhost:8000/api/data/save_email_settings
```

**Response Example:**
```json
{
  "message": "Email settings saved."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `400`: Bad Request - Invalid email settings format
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Admin Only**: Requires administrator privileges to configure email settings
- **SMTP Configuration**: Supports standard SMTP server configurations
- **Encryption Options**: Supports SSL/TLS, STARTTLS, and no encryption
- **Authentication**: Optional SMTP authentication for secure servers
- **Password Storage**: Email passwords are stored securely in database
- **Python Compatibility**: Matches Python `api_save_email_settings` function exactly

---

### GET /api/data/get_email_settings

**Description:** Retrieve current SMTP email server configuration

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_ADMIN_API_KEY" \
     http://localhost:8000/api/data/get_email_settings
```

**Response Example:**
```json
{
  "Emailsettingsid": 1,
  "ServerName": "smtp.gmail.com",
  "ServerPort": 587,
  "FromEmail": "noreply@example.com",
  "SendMode": "SMTP",
  "Encryption": "STARTTLS",
  "AuthRequired": 1,
  "Username": "user@gmail.com",
  "Password": "encrypted_password_hash"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `404`: Not Found - Email settings not configured
- `500`: Internal Server Error - Database error

**Implementation Notes:**
- **Admin Only**: Requires administrator privileges to view email settings
- **Complete Configuration**: Returns all configured email settings
- **Password Security**: Passwords are returned encrypted/hashed for security
- **Field Naming**: Uses Python-compatible field naming convention
- **Setup Check**: Returns 404 if email has not been configured yet
- **Python Compatibility**: Matches Python `api_get_email_settings` function exactly

---

### POST /api/data/send_test_email

**Description:** Send a test email using provided SMTP settings to verify configuration

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| server_name | string | Yes | SMTP server hostname |
| server_port | string | Yes | SMTP server port number |
| from_email | string | Yes | Email address to send from |
| send_mode | string | Yes | Send mode (typically "SMTP") |
| encryption | string | Yes | Encryption type ("SSL/TLS", "STARTTLS", "None") |
| auth_required | boolean | Yes | Whether SMTP authentication is required |
| email_username | string | No | SMTP username (if auth_required) |
| email_password | string | No | SMTP password (if auth_required) |
| to_email | string | Yes | Recipient email address for test |
| message | string | Yes | Test message content |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_ADMIN_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"server_name":"smtp.gmail.com","server_port":"587","from_email":"test@example.com","send_mode":"SMTP","encryption":"STARTTLS","auth_required":true,"email_username":"user@gmail.com","email_password":"app_password","to_email":"admin@example.com","message":"This is a test email from PinePods."}' \
     http://localhost:8000/api/data/send_test_email
```

**Response Example (Success):**
```json
{
  "email_status": "Email sent successfully"
}
```

**Response Example (Failure):**
```json
{
  "email_status": "Failed to send email: Authentication failed"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `400`: Bad Request - Invalid email settings or addresses
- `500`: Internal Server Error - SMTP configuration or connection error

**Implementation Notes:**
- **Admin Only**: Requires administrator privileges to send test emails
- **Configuration Test**: Tests SMTP settings without saving them to database
- **Timeout Protection**: 30-second timeout to prevent hanging connections
- **Encryption Support**: Handles SSL/TLS, STARTTLS, and unencrypted connections
- **Error Reporting**: Detailed error messages for troubleshooting SMTP issues
- **Real SMTP**: Uses lettre library for actual SMTP communication
- **Python Compatibility**: Matches Python `api_send_email` function behavior

---

### POST /api/data/send_email

**Description:** Send an email using stored database email settings

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| to_email | string | Yes | Recipient email address |
| subject | string | Yes | Email subject line |
| message | string | Yes | Email message content |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_ADMIN_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"to_email":"user@example.com","subject":"Welcome to PinePods","message":"Your PinePods account has been created successfully."}' \
     http://localhost:8000/api/data/send_email
```

**Response Example (Success):**
```json
{
  "email_status": "Email sent successfully"
}
```

**Response Example (Failure):**
```json
{
  "email_status": "Failed to send email: SMTP server connection failed"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `404`: Not Found - Email settings not configured in database
- `400`: Bad Request - Invalid recipient email address
- `500`: Internal Server Error - SMTP sending failure

**Implementation Notes:**
- **Admin Only**: Requires administrator privileges to send emails
- **Database Settings**: Uses email settings previously saved in database
- **Production Use**: Designed for sending actual emails (notifications, alerts, etc.)
- **Timeout Protection**: 30-second timeout to prevent hanging connections
- **Error Handling**: Comprehensive error reporting for debugging
- **Security**: Uses encrypted stored credentials for SMTP authentication
- **Python Compatibility**: Matches Python `api_send_email` function exactly

---

## Server Backup & Restore

Administrative endpoints for comprehensive database backup and restore operations. These endpoints provide full system backup capabilities for disaster recovery and data migration. All endpoints require admin privileges.

### POST /api/data/backup_server

**Description:** Create a complete backup of the PinePods database using native database tools

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| database_pass | string | Yes | Database user password for authentication |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_ADMIN_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"database_pass":"your_db_password"}' \
     http://localhost:8000/api/data/backup_server
```

**Response Example (Success):**
- **Content-Type**: `application/sql` or `text/plain`
- **Content-Disposition**: `attachment; filename="pinepods_backup_YYYY-MM-DD.sql"`
- **Body**: SQL dump file content (streamed)

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `500`: Internal Server Error - Backup process failed

**Implementation Notes:**
- **Admin Only**: Requires administrator privileges for database backup
- **Native Tools**: Uses `pg_dump` for PostgreSQL or `mysqldump` for MySQL
- **Streaming Response**: Large databases are streamed to prevent memory issues
- **Data-Only Backup**: Includes data without schema for portability
- **Security**: Database password required and passed securely via environment
- **Environment Variables**: Uses DB_HOST, DB_PORT, DB_NAME, DB_USER from environment
- **File Format**: Returns standard SQL dump format compatible with database restore tools

**Database-Specific Options:**

**PostgreSQL (pg_dump):**
- `--data-only`: Exports only data, not schema
- `--disable-triggers`: Prevents trigger execution during restore
- `--format=plain`: Standard SQL format
- Password passed via `PGPASSWORD` environment variable

**MySQL (mysqldump):**
- `--single-transaction`: Ensures consistent backup
- `--routines --triggers`: Includes stored procedures and triggers
- `--default-auth=mysql_native_password`: Compatibility option
- Password passed via command line (secured in process)

---

### POST /api/data/restore_server

**Description:** Restore PinePods database from uploaded SQL backup file

**Authentication:** 👑 Admin API Key

**Request Headers:**
```bash
-H "Api-Key: YOUR_ADMIN_API_KEY"
-H "Content-Type: multipart/form-data"
```

**Form Data:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| backup_file | file | Yes | SQL backup file (.sql extension required) |
| database_pass | string | Yes | Database user password for authentication |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_ADMIN_API_KEY" \
     -F "backup_file=@pinepods_backup.sql" \
     -F "database_pass=your_db_password" \
     http://localhost:8000/api/data/restore_server
```

**Response Example:**
```json
{
  "message": "Server restore started successfully"
}
```

**Error Responses:**
- `400`: Bad Request - Invalid file format, missing file, or file too large
  ```json
  {
    "error": "Only SQL files are allowed"
  }
  ```
  ```json
  {
    "error": "File too large (max 100MB)"
  }
  ```
  ```json
  {
    "error": "Database password is required"
  }
  ```
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Admin access required
- `500`: Internal Server Error - Restore process failed

**Implementation Notes:**
- **Admin Only**: Requires administrator privileges for database restore
- **Multipart Upload**: Accepts file uploads via multipart form data
- **File Validation**: Only accepts .sql files with UTF-8 encoding
- **Size Limit**: Maximum file size of 100MB to prevent memory issues
- **Background Processing**: Restore runs asynchronously to prevent request timeouts
- **Immediate Response**: Returns success immediately, actual restore runs in background
- **Data Safety**: Overwrites existing data - ensure proper backups before restore
- **File Format**: Accepts standard SQL dump files from pg_dump or mysqldump

**Security Considerations:**
- **Admin Verification**: Double-checks admin status before processing
- **File Type Validation**: Ensures only SQL files are processed
- **Size Limits**: Prevents abuse through large file uploads
- **UTF-8 Validation**: Ensures file content is valid UTF-8
- **Password Required**: Database authentication required for restore operations

**Operational Notes:**
- **Downtime**: Restore operations may cause temporary service interruption
- **Data Loss**: Restore overwrites existing database - backup current data first
- **Background Task**: Long-running restores continue after HTTP response
- **Monitoring**: Check application logs for restore progress and completion
- **Recovery**: Failed restores may require manual database recovery

---

## System Maintenance Tasks

Administrative endpoints for system maintenance operations including podcast feed refresh, sync operations, cleanup tasks, and system initialization. These endpoints are primarily designed for automated scheduled tasks and system administration.

### GET /api/data/refresh_pods

**Description:** Refresh all podcast feeds system-wide as a background task

**Authentication:** 👑 Admin API Key (System Task)

**Request Headers:**
```bash
-H "Api-Key: YOUR_SYSTEM_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_SYSTEM_API_KEY" \
     http://localhost:8000/api/data/refresh_pods
```

**Response Example:**
```json
{
  "detail": "Refresh initiated."
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - System API key required
- `500`: Internal Server Error - Task spawning failed

**Implementation Notes:**
- **Background Task**: Runs as asynchronous background process, returns immediately
- **System-Wide**: Refreshes all podcast feeds for all users
- **No WebSocket**: Unlike user-specific refresh, this runs without real-time updates
- **Task Spawning**: Creates background task that continues after HTTP response
- **Python Compatibility**: Matches Python `refresh_pods` function exactly
- **Scheduled Operation**: Designed for automated scheduled execution

---

### GET /api/data/refresh_gpodder_subscriptions

**Description:** Refresh GPodder subscriptions for all users with GPodder sync enabled

**Authentication:** 👑 Admin API Key (System Task)

**Request Headers:**
```bash
-H "Api-Key: YOUR_SYSTEM_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_SYSTEM_API_KEY" \
     http://localhost:8000/api/data/refresh_gpodder_subscriptions
```

**Response Example:**
```json
{
  "detail": "GPodder sync initiated",
  "task_id": "task-uuid-1234"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - System API key required
- `500`: Internal Server Error - Task spawning failed

**Implementation Notes:**
- **Multi-User Operation**: Processes all users with GPodder sync enabled
- **Progress Tracking**: Returns task ID for progress monitoring
- **Sync Type Support**: Handles internal, external, and both sync types (excludes Nextcloud)
- **Background Processing**: Runs asynchronously with progress reporting
- **User Filtering**: Only syncs users with GPodder sync configured
- **Error Tolerance**: Individual user sync failures don't stop overall process
- **Statistics Tracking**: Counts successful and failed syncs

---

### GET /api/data/refresh_nextcloud_subscriptions

**Description:** Refresh Nextcloud subscriptions for all users with Nextcloud sync enabled

**Authentication:** 👑 Admin API Key (System Task)

**Request Headers:**
```bash
-H "Api-Key: YOUR_SYSTEM_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_SYSTEM_API_KEY" \
     http://localhost:8000/api/data/refresh_nextcloud_subscriptions
```

**Response Example:**
```json
{
  "detail": "Nextcloud sync initiated",
  "task_id": "task-uuid-5678"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - System API key required
- `500`: Internal Server Error - Task spawning failed

**Implementation Notes:**
- **Nextcloud-Specific**: Separate from GPodder sync operations
- **Multi-User Operation**: Processes all users with Nextcloud sync enabled
- **Progress Tracking**: Returns task ID for monitoring sync progress
- **Background Processing**: Runs asynchronously to prevent timeouts
- **User Filtering**: Only processes users with Nextcloud sync configured
- **Success Tracking**: Counts successful and failed sync operations
- **Independent Operation**: Separate from GPodder sync for different sync mechanisms

---

### GET /api/data/refresh_hosts

**Description:** Refresh podcast host/person information and trigger related podcast updates

**Authentication:** 👑 Admin API Key (System Task - UserID 1)

**Request Headers:**
```bash
-H "Api-Key: YOUR_SYSTEM_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_SYSTEM_API_KEY" \
     http://localhost:8000/api/data/refresh_hosts
```

**Response Example:**
```json
{
  "detail": "Host refresh initiated.",
  "task_id": "task-uuid-9999"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - System API key (UserID 1) required
- `500`: Internal Server Error - Task spawning failed

**Implementation Notes:**
- **System API Key**: Requires specific system API key from UserID 1
- **Host Processing**: Refreshes all people/hosts in the system
- **Progress Tracking**: Provides detailed progress updates per host
- **Background Processing**: Runs asynchronously with progress reporting
- **Cascade Refresh**: Triggers podcast refresh after host processing
- **Person Subscriptions**: Updates subscriptions based on host information
- **Error Tolerance**: Individual host failures don't stop overall process

---

### GET /api/data/cleanup_tasks

**Description:** Run system cleanup tasks to remove old episodes and optimize database

**Authentication:** 👑 Admin API Key (System Task - UserID 1)

**Request Headers:**
```bash
-H "Api-Key: YOUR_SYSTEM_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_SYSTEM_API_KEY" \
     http://localhost:8000/api/data/cleanup_tasks
```

**Response Example:**
```json
{
  "detail": "Cleanup tasks initiated.",
  "task_id": "task-uuid-abcd"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - System API key (UserID 1) required
- `500`: Internal Server Error - Task spawning failed

**Implementation Notes:**
- **System API Key**: Requires specific system API key from UserID 1
- **Database Optimization**: Removes old episodes based on retention policies
- **Background Processing**: Runs asynchronously to prevent request timeouts
- **Progress Tracking**: Provides task ID for monitoring cleanup progress
- **Storage Management**: Helps manage disk space by removing outdated content
- **Scheduled Operation**: Designed for regular automated execution

---

### GET /api/data/auto_complete_episodes

**Description:** Auto-complete episodes for users based on their configured completion settings

**Authentication:** 👑 Admin API Key (System Task - UserID 1)

**Request Headers:**
```bash
-H "Api-Key: YOUR_SYSTEM_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_SYSTEM_API_KEY" \
     http://localhost:8000/api/data/auto_complete_episodes
```

**Response Example:**
```json
{
  "status": "Auto-complete task completed successfully",
  "episodes_completed": 42
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - System API key (UserID 1) required
- `500`: Internal Server Error - Auto-complete process failed

**Implementation Notes:**
- **System API Key**: Requires specific system API key from UserID 1
- **User-Based Processing**: Processes users with auto-complete settings enabled
- **Completion Logic**: Automatically marks episodes as completed based on user thresholds
- **Statistics**: Returns count of episodes marked as completed
- **Nightly Task**: Designed for regular scheduled execution
- **User Settings**: Respects individual user auto-complete second settings

---

### GET /api/data/update_playlists

**Description:** Update all playlist information and metadata system-wide

**Authentication:** 👑 Admin API Key (System Task - UserID 1)

**Request Headers:**
```bash
-H "Api-Key: YOUR_SYSTEM_API_KEY"
```

**Request Example:**
```bash
curl -X GET -H "Api-Key: YOUR_SYSTEM_API_KEY" \
     http://localhost:8000/api/data/update_playlists
```

**Response Example:**
```json
{
  "detail": "Playlist update initiated.",
  "task_id": "task-uuid-efgh"
}
```

**Error Responses:**
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - System API key (UserID 1) required
- `500`: Internal Server Error - Task spawning failed

**Implementation Notes:**
- **System API Key**: Requires specific system API key from UserID 1
- **System-Wide Update**: Updates all playlists across all users
- **Background Processing**: Runs asynchronously with progress tracking
- **Metadata Refresh**: Updates playlist metadata and statistics
- **Progress Monitoring**: Returns task ID for tracking update progress
- **Scheduled Operation**: Designed for regular maintenance execution

---

### POST /api/init/startup_tasks

**Description:** Run system initialization tasks required at application startup

**Authentication:** 👑 Admin API Key (System Task - UserID 1)

**Request Headers:**
```bash
-H "Api-Key: YOUR_SYSTEM_API_KEY"
-H "Content-Type: application/json"
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| api_key | string | Yes | System API key for authentication |

**Request Example:**
```bash
curl -X POST -H "Api-Key: YOUR_SYSTEM_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"api_key":"YOUR_SYSTEM_API_KEY"}' \
     http://localhost:8000/api/init/startup_tasks
```

**Response Example:**
```json
{
  "status": "Startup tasks completed successfully."
}
```

**Error Responses:**
- `403`: Forbidden - System API key (UserID 1) required
  ```json
  {
    "error": "Invalid or unauthorized API key"
  }
  ```
- `500`: Internal Server Error - Startup task execution failed

**Implementation Notes:**
- **System API Key**: Requires specific system API key from UserID 1 (background_tasks user)
- **Initialization Tasks**: Adds default news feed if not already present
- **Startup Integration**: Called during application initialization process
- **Synchronous Execution**: Completes before returning response
- **System Setup**: Ensures required system data is properly initialized
- **Python Compatibility**: Matches Python `startup_tasks` function exactly