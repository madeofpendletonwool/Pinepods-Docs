# Container Fundamentals

## Overview

PinePods ships as a **single Docker image** that runs several cooperating processes
under a lightweight process supervisor. Everything an instance needs at runtime — the
web UI, the main API (which includes the gpodder sync server), and the reverse proxy — lives in that one
container. By default it also keeps its data there, in a **SQLite** database under
`/opt/pinepods/data`, with an in-memory cache. Larger installs point it at a **database**
they run (PostgreSQL or MySQL/MariaDB) and a **Valkey/Redis** cache.

This page documents how the container is put together and what a "native" (non-Docker)
deployment would need to replicate.

:::note Rewritten for the Rust stack
PinePods used to run a Python/FastAPI backend supervised by `supervisord`, with feed
refreshes driven by cron. **That is no longer the case.** The backend is now a Rust
(Axum) API, processes are supervised by [Horust](https://github.com/FedericoPonzi/Horust),
and background jobs run on an internal scheduler — there is no cron and no Python runtime
in the final image.
:::

## Core Components

### 1. Frontend — Rust / Yew (WebAssembly)

- Built with the [Yew](https://yew.rs) framework and compiled to **WebAssembly (WASM)**
  with [Trunk](https://trunkrs.dev).
- Shipped as static files (HTML/JS/WASM/CSS) and served directly by nginx from
  `/var/www/html`. There is no Node.js server involved.
- The desktop and mobile clients are separate apps; this is the browser UI.

### 2. Backend — Rust API (Axum)

The main backend is a compiled Rust binary, `pinepods-api`. It handles:

- All data and business logic (`/api/*` endpoints)
- Podcast feed parsing, refresh, and downloads
- User management, authentication, and OIDC
- RSS feed generation (`/api/feed/*`)
- WebSocket connections for real-time updates and task progress
- The **gpodder.net sync server** that apps like AntennaPod sync with, plus syncing with
  an external gpodder server or Nextcloud (see [Podcast Sync](../tutorial-extras/gpodder-sync.md))
- **Background job scheduling** — feed refreshes, sync, scheduled backups and nightly
  maintenance run on an internal scheduler inside this process (no cron)

It listens on **port 8032 inside the container** and is reached through nginx; it is not
exposed directly.

### 3. Database setup tool — `pinepods-db-setup`

Schema creation, migrations, and validation are performed by a small standalone binary,
`pinepods-db-setup`. It is written in Python but **compiled to a single executable with
PyInstaller at build time**, so the runtime image contains no Python interpreter. It runs
**once on every startup** before the services launch, is idempotent, and supports
SQLite, PostgreSQL and MySQL/MariaDB. It also moves data between them:
`pinepods-db-setup --export-sqlite FILE` writes a PostgreSQL or MariaDB database out for a
SQLite server ([Moving to SQLite](../tutorial-basics/Backup-Restore.md#moving-to-sqlite)), and
`pinepods-db-setup --import-sqlite FILE` fills a PostgreSQL or MariaDB database from a
SQLite one ([Moving from SQLite](../tutorial-basics/Backup-Restore.md#moving-from-sqlite-to-postgresql-or-mariadb)).

### 4. Database layer

Stores users, podcast and episode metadata, listening history, playlists, settings, queue,
downloads, and gpodder sync state. Supports:

- **SQLite** (the default when `DB_HOST` isn't set): a file at `DB_PATH`
  (`/opt/pinepods/data/pinepods.db`), inside the container. Nothing else to run.
- **PostgreSQL** and **MySQL/MariaDB**: you run these yourself (or via the bundled
  Helm/Compose examples); they aren't part of the PinePods image.

### 5. Cache: in memory or Valkey / Redis

Holds short-lived state: login and sync tokens, task progress, now-playing sessions.

- **In memory** (`VALKEY_MODE=memory`, the default with SQLite): kept inside the API
  process, so it's lost on restart, which only means pending tokens and progress reset.
- **Valkey/Redis** (the default with PostgreSQL/MariaDB, or whenever `VALKEY_HOST` /
  `VALKEY_URL` is set): an external service, needed when more than one PinePods
  instance shares a database.

### 6. nginx

nginx listens on **port 8040** (the web UI port) and:

- Serves the compiled WASM frontend (with the correct `application/wasm` MIME type)
- Reverse-proxies API, RSS, and WebSocket routes to the Rust API
- Routes gpodder.net protocol paths to the Rust API too
- Passes the original host and scheme on (`X-Forwarded-Host`, `X-Forwarded-Proto`), so the
  API builds correct public URLs behind another reverse proxy
- Adds CORS headers and handles preflight requests

## Process Supervision — Horust

`startup.sh` is the container entrypoint. It prepares the environment, runs the database
setup binary, and then hands off to **Horust**, which supervises the long-running
services defined in `/etc/horust/services/`:

| Service | Binary | Port | Notes |
|---|---|---|---|
| `pinepods-api` | `/usr/local/bin/pinepods-api` | 8032 (internal) | Main Rust API + internal scheduler |
| `nginx` | `nginx -g 'daemon off;'` | 8040 | Starts after `pinepods-api` |

Each service is configured to restart automatically. Startup ordering is enforced with
`start-after` so the API is up before nginx begins proxying to it.

### Non-root execution (PUID / PGID)

When `PUID` and `PGID` are set, `startup.sh` remaps the runtime `pinepods` user to those
IDs and uses `su-exec` to drop privileges, so the **entire stack runs as your host
user** and downloaded files are owned correctly. A one-time recursive permission
migration is gated by a marker file on the downloads volume, so subsequent boots are
instant. If `PUID`/`PGID` are unset, the stack runs as root (legacy mode).

## Routing (nginx)

nginx (port 8040) maps request paths to the right backend:

| Path | Destination | Purpose |
|---|---|---|
| `/` | static files in `/var/www/html` | The WASM web UI (`try_files … /index.html`) |
| `/api/*` | Rust API (8032) | Main application API |
| `/api/gpodder` | Rust API (8032) | gpodder bridge handled by the Rust API |
| `/ws/api/` | Rust API (8032) | WebSocket connections (tasks, notifications, now-playing) |
| `/rss/{id}` | rewritten to `/api/feed/{id}` → Rust API (8032) | Public RSS feeds |
| `/api/2`, `/auth`, `/subscriptions`, `/devices`, `/updates`, `/episodes`, `/settings`, `/lists`, `/favorites`, `/sync-devices`, … | Rust API (8032) | gpodder.net protocol |

## Ports

- **8040** — web UI, API and gpodder sync (nginx). **Exposed**; this is the only port you publish.
- **8032** — Rust API. **Internal only**, reached via nginx.

The container `HEALTHCHECK` hits `http://localhost:8040/api/health`, which proxies to the
Rust API and verifies database connectivity.

## Authentication

PinePods uses **API-key-based authentication** for client/server calls. Keys are managed
in the database through the API.

:::caution Removed
Older versions wrote a web API key to `/tmp/web_api_key.txt` on startup. **This file is
no longer created** — it was removed for security. Don't rely on it.
:::

## Background Jobs

Feed refreshes and nightly maintenance are **scheduled internally by the Rust API**. The
old cron jobs and helper scripts (`call_refresh_endpoint.sh`, `call_nightly_tasks.sh`)
and their `*/30 * * * *` crontab entries have been **removed**. Each feed is now refreshed
on its own schedule, from how often it publishes; `PINEPODS_REFRESH_MAX_INTERVAL` sets the
longest gap (see [Feed updates](../Features/feed-updates.md#when-feeds-are-refreshed)).

## Build Process (multi-stage Dockerfile)

The image is built in several stages and assembled into a small Alpine final image:

1. **Web (rust:alpine)** — builds the Yew app to WASM:
   ```bash
   rustup target add wasm32-unknown-unknown
   RUSTFLAGS="--cfg=web_sys_unstable_apis --cfg getrandom_backend=\"wasm_js\"" \
     trunk build --features server_build --release
   ```
   Output (`/app/dist`) is copied to `/var/www/html`.
2. **db-setup (python:3.14-alpine)** — PyInstaller compiles `setup_database_new.py`
   (plus `database_functions/`) into the standalone `pinepods-db-setup` binary.
3. **rust-api (rust:alpine)** — `cargo build --release` produces the statically linked
   `pinepods-api` binary.
4. **Final (alpine)** — installs runtime tools (nginx, ffmpeg, yt-dlp, db clients,
   `su-exec`, Horust), copies the three artifacts and the startup files, and sets
   `startup.sh` as the entrypoint.

## Container Directory Structure

```
/usr/local/bin/
├── pinepods-api          # Rust API (Axum)
├── pinepods-db-setup     # Compiled DB setup/migration tool
├── horust                # Process supervisor
└── yt-dlp                # YouTube media fetching

/var/www/html/            # Compiled WASM frontend (served by nginx)
/etc/horust/services/     # *.toml service definitions (copied from startup/services)
/etc/nginx/nginx.conf     # nginx config

/pinepods/
├── startup/              # startup.sh, services/, nginx.conf, setup_database_new.py
├── database_functions/   # migration definitions (source)
├── clients/
├── cache/
└── current_version

/opt/pinepods/
├── data/                 # SQLite database (persist this)
├── downloads/            # downloaded episodes (persist this)
├── backups/              # backups (persist this)
├── certs/
└── local-media/          # user-mounted local podcast library

/var/log/pinepods/service.log   # Horust service logs (production mode)
```

## Environment Variables

None are required: with nothing set, PinePods runs on SQLite with the in-memory cache and
the hosted search and PodPeople services. See
[Environment Variables](../tutorial-basics/environment-variables.md) for the full list.

```bash
# Database (leave DB_HOST unset for SQLite)
DB_TYPE=<sqlite|postgresql|mariadb|mysql>
DB_PATH=<SQLite file, default /opt/pinepods/data/pinepods.db>
DB_HOST=<host or Unix socket directory>
DB_PORT=<port>
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=<database>

# Cache (default: memory with SQLite, Valkey otherwise)
VALKEY_MODE=<memory|valkey>
VALKEY_HOST=<host>
VALKEY_PORT=<port>

# Server / behavior (all optional)
HOSTNAME=<public URL for RSS feed links; default: the address the request came in on>
SEARCH_API_URL=<search API endpoint; default: the hosted service>
PEOPLE_API_URL=<PodPeople DB endpoint; default: the hosted service>
DEBUG_MODE=<true|false>
TZ=<IANA timezone, optional>

# Optional first-boot admin (otherwise you're prompted in the UI)
FULLNAME=<admin full name>
USERNAME=<admin username>
EMAIL=<admin email>
PASSWORD=<admin password>

# Optional non-root execution
PUID=<host user id>
PGID=<host group id>
```

OIDC/SSO adds a family of `OIDC_*` variables (provider name, client id/secret, endpoint
URLs, claim mappings). See the [OIDC setup guide](../tutorial-extras/OIDC-setup.md).

## Running Without Docker (native)

To run PinePods natively you would reproduce what the container does:

1. **Pick a database**: a SQLite file (set `DB_PATH`), or PostgreSQL / MySQL/MariaDB plus
   a Valkey/Redis instance, and set the environment variables above.
2. **Run the database setup** once on startup (idempotent) — the compiled
   `pinepods-db-setup`, or the equivalent `setup_database_new.py` with
   `database_functions/` available.
3. **Start `pinepods-api`** (listens on 8032). Its internal scheduler handles feed
   refresh and nightly tasks — no cron needed.
4. **Serve the WASM frontend and reverse-proxy the APIs** with nginx using the routing
   table above (UI on 8040).
5. Optionally use a supervisor (the container uses Horust) to keep both services
   running and ordered.

:::tip Connecting over a Unix socket
On a bare-metal install you can point PinePods at a local database over a Unix domain
socket instead of TCP. Set `DB_HOST` to the socket **directory** (an absolute path
beginning with `/`) rather than a hostname or IP:

```bash
# PostgreSQL default socket directory
DB_HOST=/var/run/postgresql
DB_PORT=5432
```

Keep `DB_PORT` set — PostgreSQL names its socket file `.s.PGSQL.<port>`, so the port
still selects the right socket. Any `DB_HOST` value starting with `/` is treated as a
socket path; anything else is treated as a TCP host. This works for both PostgreSQL and
MySQL/MariaDB.
:::

## Logging & Debug Mode

In production, Horust writes service output to `/var/log/pinepods/service.log`. Set:

```bash
DEBUG_MODE=true
```

to switch Horust into stdout/stderr mode so all service logs stream directly to the
container's standard output (handy for `docker logs`) along with extra diagnostic
detail.
