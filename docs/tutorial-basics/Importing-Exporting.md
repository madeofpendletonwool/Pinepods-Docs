# OPML Import and Export

OPML is the file format podcast apps use to move a subscription list from one app to another. Each user imports and exports their own subscriptions from **Settings**.

## Exporting

Under **Export/Backup Podcasts**, click **Download/Export OPML**. The browser downloads `podcasts.opml` with the title and feed address of every podcast you subscribe to.

This is a list of feeds, not a backup of your listening history. For a full backup of the server, see [Server Backup and Restore](./Backup-Restore.md).

## Importing

1. Under **Import Podcasts**, click **Choose File** and pick an `.opml` file.
2. Pinepods lists the podcasts it found, all selected. Unselect any you don't want.
3. Click **Add them!**

The import runs on the server. **Import Progress** shows which feed is being added and how many are left; a long list takes a while, because every feed is fetched. A feed that can't be fetched is skipped and the import carries on.

After importing, use **Match Podcasts to Podcast Index** (also in Settings) to link the new podcasts to their Podcast Index entries. That's what brings in host and guest information. See [People](../Features/Person.md).

:::tip
To move your subscriptions and listening progress between Pinepods and another app on an ongoing basis, use [Podcast Sync](../tutorial-extras/gpodder-sync.md) instead of OPML.
:::
