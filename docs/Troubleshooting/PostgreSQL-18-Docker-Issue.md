# PostgreSQL 18 Docker Container Issue

## Overview

A critical issue affects PostgreSQL version 18 Docker containers that prevents them from starting properly when using standard volume mount configurations. This issue is related to changes in how PostgreSQL 18 handles the `PGDATA` directory structure within Docker containers.

## The Problem

When attempting to start a PostgreSQL 18 container, you may encounter an error similar to:

```
Failed to deploy a stack: compose up operation failed: Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error mounting "<POSTGRESQL_PATH>" to rootfs at "/var/lib/postgresql/data": change mount propagation through procfd: open o_path procfd: open /<DOCKER ROOT>/overlay2/17561d31d0730b3fd3071752d82cf8fe60b2ea0ed84521c6ee8b06427ca8f064/merged/var/lib/postgresql/data: no such file or directory: unknown
```

## Root Cause

This issue stems from an intentional breaking change introduced in PostgreSQL 18 Docker images. The PostgreSQL Docker maintainers modified the `PGDATA` path structure to better align with upstream PostgreSQL expectations and facilitate future major version upgrades.

**Key Changes in PostgreSQL 18:**
- The default `PGDATA` path changed from `/var/lib/postgresql/data` to `/var/lib/postgresql/18/docker`
- The `/var/lib/postgresql/data` directory is now a symbolic link, which breaks direct volume mounting
- This change affects how volumes must be mounted and configured

## Impact on Pinepods

**Current Status:** Pinepods is currently **untested** with PostgreSQL 18. While it will likely work with proper configuration adjustments, we recommend using PostgreSQL 17 for production deployments until full compatibility testing is completed.

## Solutions

### Recommended Solution: Use PostgreSQL 17

The simplest and most reliable solution is to specify PostgreSQL 17 in your Docker Compose configuration:

```yaml
services:
  postgres:
    image: postgres:17
    volumes:
      - ./data/database:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: pinepods
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
```

### Alternative Solutions (For PostgreSQL 18)

If you need to use PostgreSQL 18, here are three working approaches:

#### Option 1: Mount to Parent Directory (Recommended for v18)

```yaml
services:
  postgres:
    image: postgres:18
    volumes:
      - ./data/database:/var/lib/postgresql
    environment:
      POSTGRES_DB: pinepods
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
```

With this configuration, your data will be stored in `./data/database/18/docker/`.

#### Option 2: Explicit PGDATA Configuration

```yaml
services:
  postgres:
    image: postgres:18
    volumes:
      - ./data/database:/var/lib/postgresql/18/data
    environment:
      POSTGRES_DB: pinepods
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
      PGDATA: /var/lib/postgresql/18/data
```

#### Option 3: Custom PGDATA Path

```yaml
services:
  postgres:
    image: postgres:18
    volumes:
      - ./data/database:/custom/data/path
    environment:
      POSTGRES_DB: pinepods
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
      PGDATA: /custom/data/path
```

## Migration Considerations

### From PostgreSQL 17 to 18

If you're migrating from PostgreSQL 17 to 18:

1. **Backup your data** first using `pg_dump`
2. **Stop your containers**
3. **Update your Docker Compose file** using one of the solutions above
4. **Restore your data** using `pg_restore` or similar tools

### Data Directory Changes

Be aware that PostgreSQL 18 uses a different directory structure:
- **PostgreSQL 17:** Data stored directly in mounted volume
- **PostgreSQL 18:** Data stored in versioned subdirectory (e.g., `18/docker/`)

## Related Links

- [Official PostgreSQL Docker Issue #1363](https://github.com/docker-library/postgres/issues/1363)

---

**Note:** This issue affects all applications using PostgreSQL Docker containers, not just Pinepods. The solutions provided here are general Docker PostgreSQL fixes that should work with any application.
