# Container Fundamentals

## Overview

PinePods ships as a **single Docker image** that runs several cooperating processes
under a lightweight process supervisor. Everything an instance needs at runtime — the
web UI, the main API, the gpodder sync server, and the reverse proxy — lives in that one
container. It talks to two external services you provide: a **database** (PostgreSQL or
MySQL/MariaDB) and a **Valkey/Redis** cache.

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
- **Background job scheduling** — feed refreshes and nightly maintenance run on an
  internal scheduler inside this process (no cron)

It listens on **port 8032 inside the container** and is reached through nginx; it is not
exposed directly.

### 3. gpodder API — Go

A separate Go binary, `gpodder-api`, implements the gpodder.net sync protocol so apps
like AntennaPod can sync subscriptions and episode actions with PinePods. It listens on
**port 8042** and shares the same database as the Rust API.

### 4. Database setup tool — `pinepods-db-setup`

Schema creation, migrations, and validation are performed by a small standalone binary,
`pinepods-db-setup`. It is written in Python but **compiled to a single executable with
PyInstaller at build time**, so the runtime image contains no Python interpreter. It runs
**once on every startup** before the services launch, is idempotent, and supports both
PostgreSQL and MySQL/MariaDB.

### 5. Database layer (external)

Supports **PostgreSQL** (recommended) and **MySQL/MariaDB**. Stores users, podcast and
episode metadata, listening history, playlists, settings, queue, downloads, and gpodder
sync state. You run this yourself (or via the bundled Helm/Compose examples); it is not
part of the PinePods image.

### 6. Valkey / Redis cache (external)

Used for caching and coordination. Configured via `VALKEY_HOST` / `VALKEY_PORT`.

### 7. nginx

nginx listens on **port 8040** (the web UI port) and:

- Serves the compiled WASM frontend (with the correct `application/wasm` MIME type)
- Reverse-proxies API, RSS, and WebSocket routes to the Rust API
- Routes gpodder.net protocol paths to the Go service
- Adds CORS headers and handles preflight requests

## Process Supervision — Horust

`startup.sh` is the container entrypoint. It prepares the environment, runs the database
setup binary, and then hands off to **Horust**, which supervises the long-running
services defined in `/etc/horust/services/`:

| Service | Binary | Port | Notes |
|---|---|---|---|
| `pinepods-api` | `/usr/local/bin/pinepods-api` | 8032 (internal) | Main Rust API + internal scheduler |
| `gpodder-api` | `/usr/local/bin/gpodder-api` | 8042 | Starts after `pinepods-api` |
| `nginx` | `nginx -g 'daemon off;'` | 8040 | Starts after `gpodder-api` |

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
| `/ws/api/data/`, `/ws/api/tasks/` | Rust API (8032) | WebSocket connections |
| `/rss/{id}` | rewritten to `/api/feed/{id}` → Rust API (8032) | Public RSS feeds |
| `/api/2`, `/auth`, `/subscriptions`, `/devices`, `/updates`, `/episodes`, `/settings`, `/lists`, `/favorites`, `/sync-devices`, … | Go gpodder API (8042) | gpodder.net protocol |

## Ports

- **8040** — web UI (nginx). **Exposed**; this is the port you publish.
- **8042** — gpodder API (Go). **Exposed** for direct gpodder clients.
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
and their `*/30 * * * *` crontab entries have been **removed**. Refresh cadence is
configurable through PinePods' settings rather than the crontab.

## Build Process (multi-stage Dockerfile)

The image is built in several stages and assembled into a small Alpine final image:

1. **Web (rust:alpine)** — builds the Yew app to WASM:
   ```bash
   rustup target add wasm32-unknown-unknown
   RUSTFLAGS="--cfg=web_sys_unstable_apis --cfg getrandom_backend=\"wasm_js\"" \
     trunk build --features server_build --release
   ```
   Output (`/app/dist`) is copied to `/var/www/html`.
2. **gpodder (golang:alpine)** — `go build` produces the static `gpodder-api` binary.
3. **db-setup (python:3.11-alpine)** — PyInstaller compiles `setup_database_new.py`
   (plus `database_functions/`) into the standalone `pinepods-db-setup` binary.
4. **rust-api (rust:alpine)** — `cargo build --release` produces the statically linked
   `pinepods-api` binary.
5. **Final (alpine)** — installs runtime tools (nginx, ffmpeg, yt-dlp, db clients,
   `su-exec`, Horust), copies the four artifacts and the startup files, and sets
   `startup.sh` as the entrypoint.

## Container Directory Structure

```
/usr/local/bin/
├── pinepods-api          # Rust API (Axum)
├── gpodder-api           # Go gpodder.net sync server
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
├── downloads/            # downloaded episodes (persist this)
├── backups/              # backups (persist this)
├── certs/
└── local-media/          # user-mounted local podcast library

/var/log/pinepods/service.log   # Horust service logs (production mode)
```

## Required Environment Variables

```bash
# Database
DB_TYPE=<postgresql|mysql>
DB_HOST=<host>
DB_PORT=<port>
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=<database>

# Cache
VALKEY_HOST=<host>
VALKEY_PORT=<port>

# Server / behavior
HOSTNAME=<public URL, used for RSS feed links>
SEARCH_API_URL=<search API endpoint>
PEOPLE_API_URL=<PodPeople DB endpoint>
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

1. **Provide a database** (PostgreSQL or MySQL/MariaDB) and a **Valkey/Redis** instance,
   and set the environment variables above.
2. **Run the database setup** once on startup (idempotent) — the compiled
   `pinepods-db-setup`, or the equivalent `setup_database_new.py` with
   `database_functions/` available.
3. **Start `pinepods-api`** (listens on 8032). Its internal scheduler handles feed
   refresh and nightly tasks — no cron needed.
4. **Start `gpodder-api`** (listens on 8042) if you want gpodder sync.
5. **Serve the WASM frontend and reverse-proxy the APIs** with nginx using the routing
   table above (UI on 8040).
6. Optionally use a supervisor (the container uses Horust) to keep the three services
   running and ordered.

## Logging & Debug Mode

In production, Horust writes service output to `/var/log/pinepods/service.log`. Set:

```bash
DEBUG_MODE=true
```

to switch Horust into stdout/stderr mode so all service logs stream directly to the
container's standard output (handy for `docker logs`) along with extra diagnostic
detail.
