# PostgreSQL 18 Docker Mount Error

## The problem

With the `postgres:18` image, a database container can fail to start with:

```
Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error mounting "<POSTGRESQL_PATH>" to rootfs at "/var/lib/postgresql/data": change mount propagation through procfd: open o_path procfd: open /<DOCKER ROOT>/overlay2/.../merged/var/lib/postgresql/data: no such file or directory: unknown
```

## Why it happens

The `postgres:18` image changed where it keeps its data: the default `PGDATA` moved to `/var/lib/postgresql/18/docker`, and the image now declares `/var/lib/postgresql` as a `VOLUME`. Bind-mounting your data at `/var/lib/postgresql/data`, inside that volume, fails on some Linux hosts using overlay2 ([docker-library/postgres#1363](https://github.com/docker-library/postgres/issues/1363)).

## The fix

Mount your data outside `/var/lib/postgresql` and point `PGDATA` at it. This is what Pinepods' own compose files do:

```yaml
services:
  db:
    image: postgres:18
    environment:
      POSTGRES_DB: pinepods_database
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: myS3curepass
      PGDATA: /var/lib/pgdata/pgdata
    volumes:
      - /home/user/pinepods/pgdata:/var/lib/pgdata
```

The host folder can stay where it is. If you used the older Pinepods compose file (`PGDATA: /var/lib/postgresql/data/pgdata` with the folder mounted at `/var/lib/postgresql/data`), your cluster is already in the `pgdata` subfolder, so only the mount point and `PGDATA` change.

## Coming from PostgreSQL 17?

Changing the mount isn't enough on its own: a data directory created by PostgreSQL 17 has to be upgraded before `postgres:18` will start on it. See [Upgrading PostgreSQL](./PostgresMajorUpgrade.md), which uses the same `/var/lib/pgdata` layout.
