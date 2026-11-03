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
