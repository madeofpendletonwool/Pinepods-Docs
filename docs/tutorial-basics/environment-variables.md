# PinePods Environment Variables Guide

Complete reference for all PinePods configuration options

Below are all the environment variables supported by PinePods. These should be configured in your `docker-compose.yml` file or `.env` file.

## Core Application Settings

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `SEARCH_API_URL` | `https://search.pinepods.online/api/search` | **Yes** | External URL for the search API that the frontend can access. Set this to your domain + port (e.g., `https://yourdomain.com:8000`) |
| `PEOPLE_API_URL` | `https://people.pinepods.online` | **Yes** | External URL for the people/person lookup API |
| `HOSTNAME` | `http://localhost:8040` | **Yes** | The URL where you will access the app. Used for RSS feed sharing and callbacks |

## Database Configuration

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `DB_TYPE` | `postgresql` | **Yes** | Database type: `postgresql` or `mariadb` |
| `DB_HOST` | `localhost` | **Yes** | Database host address |
| `DB_PORT` | `5432` (PostgreSQL) / `3306` (MariaDB) | **Yes** | Database port |
| `DB_USER` | `postgres` (PostgreSQL) / `root` (MariaDB) | **Yes** | Database username |
| `DB_PASSWORD` | - | **Yes** | Database password (required) |
| `DB_NAME` | `pinepods_database` | **Yes** | Database name |

## Redis/Valkey Configuration

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `VALKEY_HOST` | `valkey` | **Yes** | Valkey/Redis host for caching and sessions |
| `VALKEY_PORT` | `6379` | **Yes** | Valkey/Redis port |

## OIDC (OpenID Connect) Configuration

All OIDC variables are optional but must be configured together if using OIDC authentication.

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `OIDC_PROVIDER_NAME` | - | OIDC Setup | Display name for the OIDC provider |
| `OIDC_CLIENT_ID` | - | OIDC Setup | OIDC client ID from your provider |
| `OIDC_CLIENT_SECRET` | - | OIDC Setup | OIDC client secret from your provider |
| `OIDC_AUTHORIZATION_URL` | - | OIDC Setup | OIDC authorization endpoint URL |
| `OIDC_TOKEN_URL` | - | OIDC Setup | OIDC token endpoint URL |
| `OIDC_USER_INFO_URL` | - | OIDC Setup | OIDC user info endpoint URL |
| `OIDC_BUTTON_TEXT` | `Login with OIDC` | No | Text displayed on the OIDC login button |
| `OIDC_SCOPE` | `openid email profile` | No | Space-separated list of OIDC scopes |
| `OIDC_BUTTON_COLOR` | `#000000` | No | Background color of the OIDC login button |
| `OIDC_BUTTON_TEXT_COLOR` | `#FFFFFF` | No | Text color of the OIDC login button |
| `OIDC_ICON_SVG` | - | No | SVG icon code for the OIDC button |
| `OIDC_NAME_CLAIM` | - | No | OIDC claim field for user's display name |
| `OIDC_EMAIL_CLAIM` | - | No | OIDC claim field for user's email |
| `OIDC_USERNAME_CLAIM` | - | No | OIDC claim field for username |
| `OIDC_ROLES_CLAIM` | - | No | OIDC claim field for user roles |
| `OIDC_USER_ROLE` | - | No | Role value that grants regular user access |
| `OIDC_ADMIN_ROLE` | - | No | Role value that grants administrator access |
| `OIDC_DISABLE_STANDARD_LOGIN` | `false` | No | Set to `true` to disable username/password login entirely |

## Initial Admin Account Setup

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `USERNAME` | - | No | Initial admin username (optional, prompts on first boot if not set) |
| `PASSWORD` | - | No | Initial admin password (optional, prompts on first boot if not set) |
| `FULLNAME` | - | No | Initial admin full name |
| `EMAIL` | - | No | Initial admin email address |

## Logging & Debugging

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `DEBUG_MODE` | `false` | No | Enable debug logging and features |
| `RUST_LOG` | - | No | Rust-specific logging level |

## Container & System Settings

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `PUID` | `1000` | No | User ID for file permissions |
| `PGID` | `1000` | No | Group ID for file permissions |

## Quick Setup Guides

### Essential Variables for Any Setup

```yaml
# Database (required)
DB_TYPE: postgresql  # or mariadb
DB_HOST: db
DB_PORT: 5432  # or 3306 for MariaDB
DB_USER: postgres  # or root for MariaDB
DB_PASSWORD: "your_secure_password"
DB_NAME: pinepods_database

# Valkey/Redis (required)
VALKEY_HOST: valkey
VALKEY_PORT: 6379

# External APIs (required)
SEARCH_API_URL: "https://yourdomain.com:8000/api/search"
PEOPLE_API_URL: "https://people.pinepods.online"
HOSTNAME: "https://yourdomain.com:8040"
```


### Complete OIDC Setup Example

```yaml
# Basic OIDC Configuration
OIDC_PROVIDER_NAME: "My Company SSO"
OIDC_CLIENT_ID: "your-client-id"
OIDC_CLIENT_SECRET: "your-client-secret"
OIDC_AUTHORIZATION_URL: "https://auth.company.com/oauth2/authorize"
OIDC_TOKEN_URL: "https://auth.company.com/oauth2/token"
OIDC_USER_INFO_URL: "https://auth.company.com/oauth2/userinfo"

# Optional OIDC Customization
OIDC_BUTTON_TEXT: "Login with Company SSO"
OIDC_SCOPE: "openid email profile groups"
OIDC_BUTTON_COLOR: "#1a365d"
OIDC_BUTTON_TEXT_COLOR: "#ffffff"

# Role Mapping
OIDC_ROLES_CLAIM: "groups"
OIDC_USER_ROLE: "pinepods-users"
OIDC_ADMIN_ROLE: "pinepods-admins"

# Disable standard login (optional)
OIDC_DISABLE_STANDARD_LOGIN: true
```

---

## Legend

- **Yes**: Required for basic functionality
- **OIDC Setup**: Required if using OIDC authentication
- **Email Setup**: Required if using email features
- **No**: Optional enhancement%
