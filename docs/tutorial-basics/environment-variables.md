# PinePods Environment Variables Guide

Complete reference for all PinePods configuration options

Below are all the environment variables supported by PinePods. These should be configured in your `docker-compose.yml` file or `.env` file.

## Core Application Settings

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `SEARCH_API_URL` | - | **Yes** | URL of the search API. Use `https://search.pinepods.online/api/search`, or your own search service if you run one |
| `PEOPLE_API_URL` | - | **Yes** | URL of the people/person lookup API. Use `https://people.pinepods.online` |
| `HOSTNAME` | - | **Yes** | The URL where you will access the app (e.g., `https://pods.example.com`). Used for RSS feed sharing and callbacks |
| `SERVER_URL` | (falls back to `HOSTNAME`) | No | Explicit public URL for building absolute RSS feed links. Checked before `HOSTNAME`; set it if your container platform overrides `HOSTNAME` (see note below) |
| `DEFAULT_LANGUAGE` | `en` | No | Language the web app uses until a user picks their own. A language code such as `en`, `de`, `fr`, `pt-BR` or `zh-Hans` |

:::tip RSS links showing your container name instead of your domain?
PinePods builds absolute RSS feed URLs (`<link>`, `<guid>`, `<enclosure>`) from `HOSTNAME`. Some container runtimes — rootless Podman under a systemd unit is a known case — set their own `HOSTNAME` (the container/pod name), which can override the value you passed in. If your feed's episode links look like `pinepods-pod/api/data/stream/...` instead of your real domain, set `SERVER_URL` to your public URL (the same value you'd give `HOSTNAME`). PinePods checks `SERVER_URL` first, and unlike `HOSTNAME`, nothing in the container platform can silently overwrite it.
:::

## Database Configuration

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `DB_TYPE` | - | **Yes** | Database type: `postgresql` or `mariadb` (`mysql` also works) |
| `DB_HOST` | - | **Yes** | Database host address. A path starting with `/` (e.g., `/var/run/postgresql`) connects through a Unix socket in that directory |
| `DB_PORT` | - | **Yes** | Database port: usually `5432` for PostgreSQL, `3306` for MariaDB/MySQL |
| `DB_USER` | - | **Yes** | Database username |
| `DB_PASSWORD` | - | **Yes** | Database password |
| `DB_NAME` | - | **Yes** | Database name, usually `pinepods_database` |
| `DB_WAIT_TIMEOUT` | `300` | No | Seconds to wait at startup for the database to accept connections before giving up. `0` waits forever. Raise it if your database starts slowly (first boot, slow hosts) |

### PostgreSQL over TLS or with client certificates

PinePods connects to PostgreSQL with the standard PostgreSQL client settings, so a server that requires TLS or a client certificate (mTLS) needs no PinePods-specific options. Mount the certificate files into the container and set:

| Variable | Description |
|----------|-------------|
| `PGSSLMODE` | `disable`, `allow`, `prefer` (default), `require`, `verify-ca` or `verify-full`. Use `verify-full` to check both the server's certificate and its hostname |
| `PGSSLROOTCERT` | Path to the CA certificate that signed the server's certificate |
| `PGSSLCERT` | Path to the client certificate, for servers that require one |
| `PGSSLKEY` | Path to the client certificate's private key |

```yaml
services:
  pinepods:
    environment:
      PGSSLMODE: verify-full
      PGSSLROOTCERT: /certs/postgres/ca.crt
      PGSSLCERT: /certs/postgres/client.crt
      PGSSLKEY: /certs/postgres/client.key
    volumes:
      - /home/user/pinepods/postgres-certs:/certs/postgres:ro
```

These apply to every connection PinePods makes: the startup database setup, the app itself, and backups and restores.

:::caution Private key permissions
PostgreSQL clients refuse a private key that other users can read. Make the key file `chmod 600` and owned by the user PinePods runs as: the `PUID`/`PGID` you set, or root if you didn't set them. With `verify-full`, `DB_HOST` must match a name in the server's certificate.
:::

## Redis/Valkey Configuration

PinePods requires Valkey (or Redis). Set either a connection URL or a host and port. Every `VALKEY_*` variable can also be spelled `REDIS_*`; when both are set, `VALKEY_*` wins.

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `VALKEY_URL` | - | No | Complete connection URL, e.g. `redis://user:password@valkey:6379/0`. When set, it's used instead of the variables below |
| `VALKEY_HOST` | `valkey` | **Yes** (without `VALKEY_URL`) | Valkey/Redis host |
| `VALKEY_PORT` | `6379` | **Yes** (without `VALKEY_URL`) | Valkey/Redis port |
| `VALKEY_PASSWORD` | - | No | Password, if your Valkey/Redis server requires one |
| `VALKEY_USERNAME` | - | No | Username, if your server uses named users (ACLs) |
| `VALKEY_DATABASE` | `0` | No | Database number to use |

## OIDC (OpenID Connect) Configuration

OIDC is turned on when `OIDC_PROVIDER_NAME`, `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET` are set, along with either `OIDC_DISCOVERY_URL` or all three of the authorization, token and user info URLs. See the [OIDC setup guide](../tutorial-extras/OIDC-setup.md).

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `OIDC_PROVIDER_NAME` | - | OIDC Setup | Display name for the OIDC provider |
| `OIDC_CLIENT_ID` | - | OIDC Setup | OIDC client ID from your provider |
| `OIDC_CLIENT_SECRET` | - | OIDC Setup | OIDC client secret from your provider |
| `OIDC_DISCOVERY_URL` | - | OIDC Setup | Your provider's discovery URL (`.../.well-known/openid-configuration`). Can replace the three endpoint URLs below |
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

These are only used the first time PinePods sets up a new database, and only when all four are set. Otherwise the web app asks you to create the first admin account when you first open it.

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `USERNAME` | - | No | Initial admin username |
| `PASSWORD` | - | No | Initial admin password |
| `FULLNAME` | - | No | Initial admin full name |
| `EMAIL` | - | No | Initial admin email address |

## Feed Refreshing, Podping and Podcast People

How these work is explained in [Feed updates, feed problems and Podping](../Features/feed-updates.md).

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `PINEPODS_REFRESH_MAX_INTERVAL` | `24h` | No | The longest any podcast waits between refreshes. Minutes (`90`) or a number with `s`, `m`, `h` or `d` (`6h`). See [when feeds are refreshed](../Features/feed-updates.md#when-feeds-are-refreshed) |
| `PINEPODS_REFRESH_CRON` | - | No | Deprecated. Only read when `PINEPODS_REFRESH_MAX_INTERVAL` isn't set; the gap between its runs becomes the maximum interval |
| `PINEPODS_PODPING_URL` | the search service (`SEARCH_API_URL` without `/api/search`) | No | Where Podping announcements are read from. See [Podping](../Features/feed-updates.md#podping) |
| `PINEPODS_PODPING_INTERVAL` | `60` | No | Seconds between Podping reads |
| `PEOPLE_SYNC_ENABLED` | `true` | No | Set to `false` to stop the background sync of host and guest credits from [PodPeopleDB](../tutorial-extras/podpeopledb.md). Credits from the feeds themselves still work |

## Podcast Sync (gpodder)

How these work is explained in the [Podcast Sync Guide](../tutorial-extras/gpodder-sync.md).

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `PINEPODS_PUBLIC_URL` | (worked out from the request) | No | The server URL shown for gpodder apps. Set it if your apps reach PinePods at a different address than your browser does. See [the server URL](../tutorial-extras/gpodder-sync.md#the-server-url) |
| `PINEPODS_SYNC_CRON` | `0 */5 * * * *` | No | Schedule for syncing with external servers. Six fields, starting with seconds |
| `PINEPODS_SYNC_PUSH_DELAY` | `30` | No | Seconds to wait after the last local change before pushing it |
| `PINEPODS_SYNC_PUSH_MAX_DELAY` | `120` | No | Push no later than this many seconds after the first unsent change |
| `PINEPODS_SYNC_LOG_RETENTION_DAYS` | `90` | No | How long changes that a newer one replaced are kept in the sync history. `0` keeps everything |

## AI Features

Transcripts and ad detection run in the optional `pinepods-ai` container. See [Setting Up the AI Container](../AI/Setup.md), which also lists the AI container's own variables.

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `PINEPODS_AI_URL` | - | No | Address of the AI container, e.g. `http://pinepods-ai:8100`. AI features stay off while it's unset |
| `PINEPODS_AI_TOKEN` | - | No | Shared secret sent to the AI container. Must match the AI container's `PINEPODS_AI_TOKEN` if you set one there |

## Logging & Debugging

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `DEBUG_MODE` | `false` | No | Set to `true` to send the app's logs to the container output (`docker logs`). Otherwise they go to `/var/log/pinepods/service.log` inside the container |
| `RUST_LOG` | `info` | No | Log level for the app, e.g. `debug`, or per module (`info,pinepods_api::services::sync=debug`) |

## Container & System Settings

| Variable | Default Value | Required | Description |
|----------|---------------|----------|-------------|
| `PUID` | - | No | User ID to run PinePods as, so downloaded and backup files get the right owner. Set it together with `PGID`; without both, PinePods runs as root |
| `PGID` | - | No | Group ID to run PinePods as. Set it together with `PUID` |
| `TZ` | `UTC` | No | Container timezone, e.g. `America/New_York` |
| `YTDLP_PATH` | `/opt/pinepods/downloads/.bin/yt-dlp` | No | Where PinePods keeps the yt-dlp copy it uses for YouTube. It lives on the downloads volume so updates to it survive container recreation. You shouldn't need to change this |

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
SEARCH_API_URL: "https://search.pinepods.online/api/search"
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
- **No**: Optional enhancement
