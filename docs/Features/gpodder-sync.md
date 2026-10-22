# Podcast Sync

Pinepods keeps your subscriptions and listening progress in sync with other podcast apps, in two ways that work together:

- **The PinePods gpodder server.** Pinepods is a gpodder sync server, built into the Pinepods API. Point AntennaPod, Kasts or another gpodder.net client at your Pinepods address and sign in with an app password. Nothing else to install or run.
- **One external sync server.** Pinepods also syncs with a gpodder-compatible server (oPodSync, Podfetch, …) or a Nextcloud with the GPodder Sync app. It can run alongside the PinePods gpodder server, and Pinepods passes changes between the two.

## Highlights

- **Subscriptions and episode progress** (position, played, unplayed) sync both ways. The most recent change wins.
- **Changes in Pinepods are recorded as you make them**, so apps see them on their next sync, and external servers get them within a couple of minutes.
- **App passwords:** one per app, shown once, revocable on their own. Revoking one signs that app out straight away.
- **Device list:** see which apps have synced and when; rename or remove them.
- **Status at a glance** for the external server: last successful sync, last error, Sync now and Force full sync. Repeated failures back off automatically instead of retrying every few minutes.
- **First syncs merge** both sides and never remove anything.
- **Statistics** come from Pinepods' own sync history, without contacting a server.

## Setting it up

See the [Podcast Sync Guide](../tutorial-extras/gpodder-sync.md) for step-by-step setup of the PinePods gpodder server and your apps, external gpodder servers and Nextcloud, plus the `PINEPODS_SYNC_CRON`, `PINEPODS_SYNC_PUSH_DELAY`, `PINEPODS_SYNC_PUSH_MAX_DELAY` and `PINEPODS_PUBLIC_URL` settings.

## Compatible servers and apps

The PinePods gpodder server speaks the gpodder.net v2 API (and the older Simple API), and its tests follow the way AntennaPod syncs. Kasts and other gpodder.net clients use the same API. For external servers, oPodSync, Podfetch and Nextcloud GPodder Sync have been used with Pinepods. If an app or server doesn't work, please [open an issue](https://github.com/madeofpendletonwool/PinePods/issues) with its name and version.
