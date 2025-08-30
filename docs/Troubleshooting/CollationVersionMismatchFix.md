# PostgreSQL Collation Version Mismatch Fix

## Problem Description

After upgrading PinePods, you may see constant warnings in your PostgreSQL logs like:

```
WARNING: database "pinepods_database" has a collation version mismatch
DETAIL: The database was created using collation version 2.36, but the operating system provides version 2.41.
HINT: Rebuild all objects in this database that use the default collation and run ALTER DATABASE pinepods_database REFRESH COLLATION VERSION, or build PostgreSQL with the right library version.
```

This occurs when:
- Your PinePods database was created with an older version of PostgreSQL
- The new PostgreSQL container/version uses updated system libraries
- The database's stored collation version doesn't match the current system's collation version

**Impact:** This is generally harmless but causes log spam and may cause minor performance issues with text sorting/indexing operations.

## Solution

### For Default Docker Setup (PostgreSQL Container)

1. **Find your PostgreSQL container name:**
   ```bash
   docker ps
   ```
   Look for the PostgreSQL container (usually named something like `db`, `postgres_db`, or `pinepods_db`)

2. **Connect to PostgreSQL and fix the collation version:**
   ```bash
   docker exec -it <postgres-container-name> psql -U postgres -d pinepods_database -c "ALTER DATABASE pinepods_database REFRESH COLLATION VERSION;"
   ```
   
   Example:
   ```bash
   docker exec -it postgres_db psql -U postgres -d pinepods_database -c "ALTER DATABASE pinepods_database REFRESH COLLATION VERSION;"
   ```

3. **Expected output:**
   ```
   NOTICE: version has not changed
   ALTER DATABASE
   ```
   or
   ```
   ALTER DATABASE
   ```

4. **Check for additional database warnings:**
   After fixing the main PinePods database, you may see similar warnings for the default `postgres` database:
   ```
   WARNING: database "postgres" has a collation version mismatch
   ```
   
   If this occurs, run the same fix for the postgres database:
   ```bash
   docker exec -it <postgres-container-name> psql -U postgres -d postgres -c "ALTER DATABASE postgres REFRESH COLLATION VERSION;"
   ```

### For External PostgreSQL Database

1. **Connect to your external PostgreSQL server** using your preferred method:
   - Command line: `psql -h <host> -U <username> -d pinepods_database`
   - GUI tools like pgAdmin, DBeaver, etc.
   - Your cloud provider's console (AWS RDS, Google Cloud SQL, etc.)

2. **Run the collation refresh command:**
   ```sql
   ALTER DATABASE pinepods_database REFRESH COLLATION VERSION;
   ```

3. **Check for additional database warnings:**
   You may also need to fix the default `postgres` database if you see warnings for it:
   ```sql
   ALTER DATABASE postgres REFRESH COLLATION VERSION;
   ```

4. **If you have multiple PinePods databases** (unlikely but possible), repeat for each:
   ```sql
   ALTER DATABASE your_other_pinepods_db REFRESH COLLATION VERSION;
   ```

### For Docker Compose Users

If you're using Docker Compose, you can run:

```bash
# Fix the main PinePods database
docker compose exec db psql -U postgres -d pinepods_database -c "ALTER DATABASE pinepods_database REFRESH COLLATION VERSION;"

# Fix the postgres database if needed
docker compose exec db psql -U postgres -d postgres -c "ALTER DATABASE postgres REFRESH COLLATION VERSION;"
```

Replace `db` with your PostgreSQL service name from your `docker-compose.yml` file.

## Verification

After running the command:

1. **Check your logs** - the collation warnings should stop appearing
2. **Restart PinePods** (optional but recommended) to ensure clean startup
3. **Monitor logs** for a few minutes to confirm the warnings are gone

## Alternative Database Names

If your database is named something other than `pinepods_database`, replace it in the commands above. Common variations:
- `pinepods`
- `pinepods_db`
- `podcast_database`

You can find your actual database name by connecting to PostgreSQL and running:
```sql
\l
```

## When This Issue Occurs

This issue typically happens when:
- Upgrading from older PinePods versions (especially major version jumps)
- Moving from one PostgreSQL version to another
- Migrating between different hosting environments
- Updating Docker images that include newer PostgreSQL versions

## Prevention for Future Upgrades

Unfortunately, this is a PostgreSQL-level issue that can occur with any database application during major upgrades. The fix is simple and only needs to be run once after each major PostgreSQL version upgrade.

## Need Help?

If you encounter issues with these steps:
1. Check that you're connecting to the correct database container/server
2. Verify your database name is correct
3. Ensure you have sufficient privileges to run `ALTER DATABASE` commands
4. Open an issue on the PinePods GitHub repository with your specific error message