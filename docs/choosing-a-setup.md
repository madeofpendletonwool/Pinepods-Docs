---
title: Choosing a Database and Cache
---

# Choosing a Database and Cache

Pinepods needs a database, which holds everything that lasts, and a cache for short-lived state. Each has an easy choice that runs inside the Pinepods container and a production choice that runs as its own service.

| | Easiest | Production |
|---|---|---|
| Database | SQLite, a file inside the container | PostgreSQL (or MySQL/MariaDB) |
| Cache | In memory, inside the container | Valkey (or Redis) |
| What you run | One container | Pinepods, a database, Valkey |
| Set up with | `docker run`, or the SQLite compose file | The PostgreSQL compose file, or Helm |

The [Getting Started](./intro.md) guide has both setups.

## The database

### SQLite: the easiest way to get going

With no database settings (no `DB_HOST`), Pinepods keeps its database in one file, `/opt/pinepods/data/pinepods.db`. There's no database server to install, secure or upgrade.

SQLite is the right call when:

- You're trying Pinepods out.
- It's for you or a household: a handful of people, on one server.
- You want the fewest moving parts, for example on a NAS or a Raspberry Pi.

What to know:

- **One writer at a time.** Reads run side by side, but writes (refreshing feeds, saving listening progress, syncing apps) take turns. That's unnoticeable for a few people. With many active users and large libraries, the writes queue up.
- **One Pinepods container.** The file belongs to one container, so you can't run several Pinepods instances against it.
- **Persist the data folder.** Mount `/opt/pinepods/data`, or the database is lost when the container is recreated.
- **Backups** come from Settings → Backup Server like on any server, without a database password, and scheduled backups work too. See [Backup and Restore](./tutorial-basics/Backup-Restore.md).

### PostgreSQL: the production choice

Run PostgreSQL when Pinepods is a server people rely on:

- Many users, or large libraries that refresh often.
- More than one Pinepods instance sharing one database, for example several replicas on Kubernetes.
- You already run PostgreSQL, or you want its tooling: `pg_dump`, replication, point-in-time recovery, monitoring.

The Helm chart and the main compose file use PostgreSQL.

### MySQL / MariaDB

Fully supported, and the same as PostgreSQL in what it can do. Pick it if you already run MariaDB and would rather not add a second database server. Otherwise prefer PostgreSQL.

### Changing your mind later

- **PostgreSQL or MariaDB → SQLite:** supported. Export the database and restore it on a new SQLite server; see [Moving to SQLite](./tutorial-basics/Backup-Restore.md#moving-to-sqlite).
- **SQLite → PostgreSQL or MariaDB:** there's no tool for this yet, and each database's backups restore only on the same kind of database. If you expect to grow past a household, start on PostgreSQL.

## The cache

The cache holds state that only matters for a short time: background task progress, sign-ins that are partway through (OIDC), which devices are playing what for remote control, flags for feeds being refreshed, and cached images. Your library, settings, listening history and notifications are in the database, whichever cache you use.

### In memory

Kept inside the Pinepods process, capped at 256 MB. It's the default with SQLite, and you can choose it with any database by setting `VALKEY_MODE=memory`.

When Pinepods restarts, the cache starts empty. Task progress is cleared, a sign-in in progress has to start again, devices show up for remote control again the next time they report, and images are fetched again. Nothing you'd keep is lost.

Use it when you run **one Pinepods container**, which covers any SQLite install and a single PostgreSQL or MariaDB instance.

### Valkey

A separate service, the default with PostgreSQL and MariaDB. Use Valkey (or Redis) when:

- **You run more than one Pinepods instance.** They share the cache through Valkey: progress, sign-ins and now-playing from one instance are seen by the others, and live updates reach users on any instance. In memory, each instance would only see its own.
- You'd like task progress and remote-control devices to survive a Pinepods restart.

Point Pinepods at it with `VALKEY_HOST` and `VALKEY_PORT`, or `VALKEY_URL`. This works with SQLite too: setting `VALKEY_HOST` switches a SQLite server to Valkey.

### Picking by setting

| Setting | Result |
|---|---|
| Nothing set, SQLite | In memory |
| Nothing set, PostgreSQL or MariaDB | Valkey at host `valkey`, port 6379 |
| `VALKEY_HOST` or `VALKEY_URL` set | Valkey |
| `VALKEY_MODE=memory` | In memory, with any database |
| `VALKEY_MODE=valkey` | Valkey, with any database (with SQLite, also set `VALKEY_HOST` or `VALKEY_URL`) |

See [Environment Variables](./tutorial-basics/environment-variables.md) for every option.

## In short

- **Trying it out, or a household:** one container with SQLite and the in-memory cache.
- **A server many people depend on:** PostgreSQL and Valkey.
- **One PostgreSQL instance but no wish to run Valkey:** PostgreSQL with `VALKEY_MODE=memory`.
