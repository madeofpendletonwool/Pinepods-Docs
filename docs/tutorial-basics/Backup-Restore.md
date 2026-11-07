# Server Backup and Restore

A backup is a full SQL dump of the Pinepods database: users, subscriptions, episodes, listening history, settings and API keys. Restoring one replaces everything on the server with what the backup contains.

Both live on the **Admin** tab of **Settings**, under **Backup Server** and **Restore Server**. Only admins see them.

Backups made on the server are written to `/opt/pinepods/backups` inside the container. Mount it so they survive the container:

```yaml
    volumes:
      - /home/user/pinepods/backups:/opt/pinepods/backups
```

## Scheduled backups

Under **Scheduled Backups**, pick a **Schedule Time**, turn **Status** on, and set **Keep last N backups**.

| Schedule Time | Runs |
|---|---|
| Daily at 2:00 AM | every day at 02:00 |
| Weekly on Sunday at 3:00 AM | Sundays at 03:00 |
| Monthly on 1st at 1:00 AM | the 1st of each month at 01:00 |
| Every 6 hours | 00:00, 06:00, 12:00, 18:00 |
| Every 12 hours | 00:00 and 12:00 |

Times are UTC. Each run writes `scheduled_backup_<date>_<time>.sql` to the backup directory. The first run is the next scheduled time after you turn the schedule on; missed runs aren't made up.

**Keep last N backups** deletes the oldest scheduled backups beyond that number. `0` keeps all of them. Manual backups are never deleted automatically.

## Manual backups

- **Download Backup File:** enter the database password and click **Authenticate**. The browser downloads `server_backup.sql`.
- **Save to Backup Directory:** **Create Backup** writes `manual_backup_<date>_<time>.sql` to the backup directory, using the database credentials the container already has.

Large databases take a few minutes. Keep the page open until it finishes.

**Existing Backups** lists the `.sql` files in the backup directory. Delete the ones you no longer need from there.

## Restoring

:::caution
A restore deletes everything on the server and replaces it with the backup's contents.
:::

Under **Restore Server**, choose a **Restore Method**:

- **Upload Backup File:** choose a `.sql` file, enter the **Database Password**, and click **Restore Server**.
- **Select From Server Backups:** pick a file from the backup directory and click **Restore From Selected**.

Restoring clears all sign-in sessions, so everyone is signed out. The page shows "Server restore in progress" and reloads when it's done. Sign back in with an account from the backup.

## SQLite

On a SQLite server, backups are `.sql` files too, and every option above works the same way, except that there's no database password to enter.

- A SQLite server restores only its own backups, not a PostgreSQL or MariaDB dump (see [Moving to SQLite](#moving-to-sqlite) for those), and its backups don't restore on those servers.
- A backup from an older Pinepods version restores fine. One from a newer version is refused; upgrade first.
- A failed restore changes nothing: the old data stays until the new data has fully loaded.

You can also stop Pinepods and copy the database file (`DB_PATH`). Copy it with the `-wal` and `-shm` files beside it, if there are any.

## Moving to SQLite

A PostgreSQL or MariaDB server can move to SQLite. The old server's database is exported as a SQLite backup, which a new SQLite server restores.

1. Upgrade the old server to the Pinepods version you'll run on SQLite, and let it start once.
2. Export its database from inside the running container. The file lands in the backup directory:

   ```bash
   docker exec pinepods pinepods-db-setup --export-sqlite /opt/pinepods/backups/sqlite_export.sql
   ```

3. Start the new SQLite server (see [Getting Started](../intro.md)), create a temporary admin account, and restore `sqlite_export.sql` under **Restore Server**. Mount the same backup directory to pick it from **Select From Server Backups**, or upload it.
4. Sign back in with your old account. Users, subscriptions, episodes, history, playlists, settings and API keys all come across; everyone has to sign in again.

Downloaded episode files aren't in the database: mount the old downloads directory on the new server too.

