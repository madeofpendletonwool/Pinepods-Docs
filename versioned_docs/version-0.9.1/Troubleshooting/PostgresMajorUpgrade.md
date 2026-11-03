# Upgrading PostgreSQL (e.g. 17 → 18)

## Problem Description

When you change your `db` container image to a newer PostgreSQL major version (for
example from `postgres:17` to `postgres:18`) and start the stack, the database
container refuses to start and crash-loops with:

```
FATAL:  database files are incompatible with server
DETAIL:  The data directory was initialized by PostgreSQL version 17, which is
         not compatible with this version 18.4 (Debian 18.4-1.pgdg13+1).
```

Pinepods itself will then sit waiting for a database that never comes up:

```
WARNING - Connection attempt 1/30 failed: server closed the connection unexpectedly
```

**This is normal PostgreSQL behavior, not a Pinepods bug.** Every PostgreSQL *major*
version uses an incompatible on-disk data-directory format. A version 18 server will
not read a data directory that was created (`initdb`) by version 17 — it must be
upgraded first. **Your data is not lost**; it is simply bound to the older server
until you run an upgrade.

> **Minor** version upgrades (e.g. `18.3` → `18.4`) are safe and need none of this —
> only **major** version jumps (17 → 18) require the steps below.

## Before You Start: Back Up

A major-version upgrade rewrites the data directory. Always take a backup first:

1. Create a server backup from inside Pinepods — see
   [Server Backup and Restore](../tutorial-basics/Backup-Restore.md).
2. **Also** stop the whole stack (`docker compose down`) and copy your `pgdata`
   host directory somewhere safe:

   ```bash
   cp -a /home/user/pinepods/pgdata /home/user/pinepods/pgdata.v17-backup
   ```

This copy is your guaranteed rollback point (see [Rolling Back](#rolling-back-can-i-go-back-to-17) below).

## Recommended Path: pgautoupgrade (automatic, in-place)

The easiest way to upgrade is the drop-in
[`pgautoupgrade`](https://github.com/pgautoupgrade/docker-pgautoupgrade) image. It
detects the version your data directory was created with, runs `pg_upgrade` in place,
and then runs as the new version — using the **same** volume you already have.

> **Use the Debian (`-trixie`) variant.** The official `postgres:18` image is built on
> Debian (the error above shows `pgdg13` = Debian 13 / *trixie*). Matching that with
> `pgautoupgrade/pgautoupgrade:18-trixie` keeps the system locale/collation libraries
> consistent so your indexes stay valid. Avoid mixing the Alpine variant with the
> Debian `postgres` image.

### Option 1 — Helper script (simplest)

Pinepods ships a helper that takes a safety dump, runs the one-shot upgrade, and tells
you what to change. From a checkout of the Pinepods repo:

```bash
./deployment/docker/upgrade-postgres.sh --help
```

Follow its prompts, then continue with [After the Upgrade](#after-the-upgrade) below.

### Option 2 — Manual, with your existing compose file

1. **Stop the stack:**

   ```bash
   docker compose down
   ```

2. **Temporarily** point the `db` service at `pgautoupgrade` and tell it to upgrade
   then exit. Keep the **same host path** and `POSTGRES_*` values you already use, but
   move the mount and `PGDATA` to `/var/lib/pgdata` (see the note below):

   ```yaml
   services:
     db:
       container_name: db
       image: pgautoupgrade/pgautoupgrade:18-trixie   # was postgres:17
       environment:
         POSTGRES_DB: pinepods_database
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: myS3curepass
         PGDATA: /var/lib/pgdata/pgdata
         PGAUTO_ONESHOT: "yes"                         # upgrade, then exit
       volumes:
         - /home/user/pinepods/pgdata:/var/lib/pgdata
   ```

   > **Why the path changes from `/var/lib/postgresql/data` to `/var/lib/pgdata`:** the
   > `postgres:18` image (which `pgautoupgrade:18-trixie` is based on) declares
   > `/var/lib/postgresql` as a `VOLUME`. Bind-mounting *under* it can fail on some
   > Linux/overlay2 hosts with `change mount propagation ... no such file or directory`
   > ([docker-library/postgres#1363](https://github.com/docker-library/postgres/issues/1363)).
   > Mounting at `/var/lib/pgdata` sidesteps this. Your **host** path is unchanged, so
   > no files move on disk — the cluster still lives at `/home/user/pinepods/pgdata/pgdata`.

3. **Run only the database** and let it upgrade. With `PGAUTO_ONESHOT=yes` the
   container performs the upgrade and exits cleanly (exit code 0):

   ```bash
   docker compose up db
   ```

   Watch the logs — you should see it detect the old version and run `pg_upgrade`
   successfully, then stop.

4. **Switch back to the stock image** and remove the one-shot variable. Keep the
   `/var/lib/pgdata` mount and `PGDATA` from step 2. Your data directory is now
   version 18:

   ```yaml
   services:
     db:
       image: postgres:18                              # was pgautoupgrade
       environment:
         POSTGRES_DB: pinepods_database
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: myS3curepass
         PGDATA: /var/lib/pgdata/pgdata
         # PGAUTO_ONESHOT removed
       volumes:
         - /home/user/pinepods/pgdata:/var/lib/pgdata
   ```

5. **Start everything normally:**

   ```bash
   docker compose up -d
   ```

   PostgreSQL should start with no "incompatible" error and Pinepods should connect.

## After the Upgrade

The new image almost always ships a newer `glibc` than the one your data was created
with, so the `db` logs will warn about a **collation version mismatch** (e.g.
"created using collation version 2.36, but the operating system provides version
2.41"). This is expected. Because the system collation actually changed, the correct
fix is to **rebuild indexes first**, then clear the version flag on every database
that warns (including the system `postgres` and `template1` databases):

```bash
# Rebuild indexes on your real database (protects text/unique indexes)
docker compose exec db psql -U postgres -d pinepods_database \
  -c "REINDEX DATABASE pinepods_database;"

# Clear the collation version flag on every database that warns
docker compose exec db psql -U postgres -d pinepods_database \
  -c "ALTER DATABASE pinepods_database REFRESH COLLATION VERSION;"
docker compose exec db psql -U postgres -d postgres \
  -c "ALTER DATABASE postgres REFRESH COLLATION VERSION;"
docker compose exec db psql -U postgres -d template1 \
  -c "ALTER DATABASE template1 REFRESH COLLATION VERSION;"
```

The `postgres` and `template1` databases are empty system databases, so they only need
the `REFRESH` — no reindex. See
[PostgreSQL Collation Version Mismatch Fix](./CollationVersionMismatchFix.md) for more
detail. Once the upgrade looks healthy and Pinepods works, you can delete the
`pgdata.v17-backup` copy and the safety dump.

## Rolling Back: Can I Go Back to 17?

**Not in place.** A major upgrade is one-way for a given data directory — once it is at
version 18, a version 17 server can no longer read it. There is no "swap back and
forth" between major versions against the same `pgdata`.

To return to 17 you must restore from a pre-upgrade backup:

- **Fastest:** stop the stack, delete the upgraded `pgdata`, and put your
  `pgdata.v17-backup` copy back in its place. Set the image back to `postgres:17` and
  start.
- **Or:** start a fresh `postgres:17` stack with an empty data directory and restore
  your Pinepods server backup into it.

This is exactly why the [backup step](#before-you-start-back-up) above is not optional.

## Alternative Path: Manual dump and restore

If you prefer not to use `pgautoupgrade`, you can migrate logically. This is fully
version-independent:

1. With the stack on `postgres:17`, dump everything:

   ```bash
   docker exec -t db pg_dumpall -U postgres > pinepods-all.sql
   ```

2. Stop the stack, move the old data directory aside, and point the volume at a new
   empty directory. Set the `db` image to `postgres:18` and use the `VOLUME`-safe mount
   from the [recommended path](#option-2--manual-with-your-existing-compose-file)
   (`PGDATA: /var/lib/pgdata/pgdata`, mounted at `/var/lib/pgdata`).
3. Start only `db` so version 18 initializes a fresh data directory, then restore:

   ```bash
   cat pinepods-all.sql | docker exec -i db psql -U postgres
   ```

4. Start the rest of the stack as normal.
