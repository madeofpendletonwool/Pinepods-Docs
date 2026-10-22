# Podcast Sync Guide

Pinepods can keep your subscriptions and listening progress in sync with other podcast apps. There are two parts, and you can use either or both:

1. **The PinePods gpodder server.** Pinepods is itself a gpodder sync server. gpodder.net-compatible apps such as AntennaPod and Kasts sign in to Pinepods and sync with it directly. Nothing else to install.
2. **An external sync server.** Pinepods also syncs, as a client, with one other server: a gpodder-compatible server (oPodSync, Podfetch, a self-hosted gpodder.net, …) or a Nextcloud with the GPodder Sync app.

Both are set up in **Settings → Podcast Sync**.

:::tip Which one do I want?
If your other apps can talk to a gpodder server, use the PinePods gpodder server: point the apps at Pinepods and you're done. Add an external server only if you already have one that other apps rely on.
:::

## What gets synced

- **Subscriptions.** Adding or removing a podcast on one side adds or removes it on the other. A podcast an app subscribes to is imported in the background, so it can take a moment to show up in Pinepods.
- **Episode progress.** Play position, and episodes marked played or unplayed. When two devices disagree, the most recent change wins.

Changes you make in Pinepods (web, desktop or mobile) are recorded the moment you make them, so an app sees them on its next sync.

## The PinePods gpodder server

### Turning it on

1. Go to **Settings → Podcast Sync**.
2. Under **PinePods gpodder server**, switch on **Enable the gpodder server**.
3. The section now shows the **Server URL** and **Username** to enter in your apps, each with a copy button.

When you turn it on, your current listening progress is published to the server, so the first sync of a new app gets your full state.

### App passwords

Apps sign in with an **app password**, never your Pinepods password:

- each app gets its own password, and you can revoke one without touching the others or your Pinepods password;
- revoking it signs that app out straight away;
- it works the same for accounts with MFA or that sign in with OIDC/SSO;
- your real password never sits in a third-party app.

To create one, enter a label (e.g. "AntennaPod on my phone") under **App passwords** and click **Generate app password**. It's shown **once**, so copy it into your app right away. The list shows when each password was created and last used, with a **Revoke** button.

### Setting up your apps

Use the **Server URL**, your **Username** and an **app password** from the settings page.

**AntennaPod (Android)**

1. Settings → **Synchronization** → **Choose a synchronization provider** → **gpodder.net**.
2. Choose to use a custom server and enter the Server URL (e.g. `https://pods.example.com`).
3. Enter your username and app password.
4. Pick an existing device or create a new one, then finish. AntennaPod syncs subscriptions and episode progress from then on.

**Kasts (KDE)**

1. Settings → **Synchronization** → select **gpodder.net** as the provider and choose a custom server.
2. Enter the Server URL, username and app password, and pick or create a device.

**Other apps**

Look for gpodder or gpodder.net sync with a custom server, and enter the same three things. Menu names differ between apps and versions. Pinepods also answers the older "Simple API" (`/subscriptions/{user}`) used by some apps.

### The server URL

Pinepods shows the address you opened it with, which is usually the right one. If your apps reach Pinepods at a different address than your browser does (for example, you browse it on your LAN but your phone goes through a reverse proxy), set `PINEPODS_PUBLIC_URL` to the address apps should use:

```yaml
environment:
  PINEPODS_PUBLIC_URL: https://pods.example.com
```

Behind a reverse proxy, Pinepods reads the original host and scheme from the `X-Forwarded-Host` and `X-Forwarded-Proto` headers. Most proxies send them, and the nginx inside the Pinepods container passes them through, so the right host name and `https` come out without extra setup.

### Devices

**Devices** lists every app that has synced, with when it was last seen.

- **Rename** changes the name shown in Pinepods (and to your apps). It sticks even when an app updates its device.
- **Remove** deletes the device. Its history is kept, and the app simply registers a new device on its next sync.
- Pinepods' own device is listed too (it's how changes made in Pinepods reach your apps). It can't be removed.

You don't need to create devices yourself, and there's no "default device" to pick: apps register their own, and Pinepods uses its own.

## External sync server

Under **External sync server**, choose what to sync with: **Nothing else**, **gpodder server** or **Nextcloud**. You can use an external server and the PinePods gpodder server at the same time; Pinepods passes changes between them.

### A gpodder server

1. Choose **gpodder server** and enter the server's URL, your username and password.
2. Optionally set a **Device name**: how Pinepods shows up on that server. Leave it empty and Pinepods picks one.
3. Click **Test connection**. It checks the login and lists your devices on that server, without saving anything.
4. Click **Save and sync**. The login is checked again, and the first sync starts in the background (you can follow it in the activity panel).

The first sync is a full one: subscriptions and progress from both sides are merged, and nothing is removed from either side.

### Nextcloud

You need a Nextcloud with the **GPodder Sync** app installed.

1. Choose **Nextcloud** and enter your Nextcloud URL.
2. Either click **Log in with Nextcloud** and approve Pinepods in the tab that opens (Pinepods waits for the approval), or enter your Nextcloud username and an app password and click **Save and sync**.

Nextcloud's sync app has no device list, so there's nothing to manage there.

### Status and manual syncs

The section shows when the last sync succeeded, the last error if there was one, and whether the next sync is a full one.

- **Sync now** runs a sync straight away.
- **Force full sync** re-merges everything from both sides (again without removing anything). Use it if the two sides look out of step.
- **Remove** stops syncing with the server. Nothing is deleted on either side.

If syncing keeps failing (the server is down, the password changed), automatic syncs back off: 30 minutes after the first failure, longer after each further one, up to once a day. The status says when they resume. **Sync now** always works.

### When it syncs

- **On a schedule**, every 5 minutes by default.
- **After a change in Pinepods**: about 30 seconds after your last change, and never more than 2 minutes after the first one, so a burst of changes goes out as one sync.

Both can be tuned with environment variables:

| Variable | Default | Meaning |
|---|---|---|
| `PINEPODS_SYNC_CRON` | `0 */5 * * * *` | Schedule for syncing with external servers. Six fields, starting with seconds. |
| `PINEPODS_SYNC_PUSH_DELAY` | `30` | Seconds to wait after the last local change before pushing it. |
| `PINEPODS_SYNC_PUSH_MAX_DELAY` | `120` | Push no later than this many seconds after the first unsent change. |
| `PINEPODS_PUBLIC_URL` | (unset) | The server URL shown for gpodder apps. |
| `PINEPODS_SYNC_LOG_RETENTION_DAYS` | `90` | How long changes that a newer one replaced are kept in the sync history. `0` keeps everything. |

The first three only affect external servers.

### Sync history

Pinepods keeps a history of sync changes; it's what apps download. After 90 days, changes that a newer one replaced are dropped (once every external server has them). The latest state of every podcast and episode is always kept, so a newly connected app still gets everything. Apps syncing with the PinePods gpodder server decide for themselves when to sync.

## Statistics

**Sync statistics** (collapsed by default) shows how many podcasts are synced, recent episode actions and where they came from, and how many changes are still waiting to be sent to the external server. It's read from Pinepods' own sync history, so opening it doesn't contact any server.

## Upgrading from 0.9.0 or earlier

- Your setup is carried over. The PinePods gpodder server stays on if it was on.
- **Apps need an app password.** An app set up with your Pinepods password stops syncing after the upgrade: generate an app password in **Settings → Podcast Sync** and enter it in the app instead of your Pinepods password.
- The gpodder server is now part of the Pinepods API, on the same address and paths as before, so the server URL in your apps and your proxy stay the same. Port `8042` is gone: if you mapped it, remove the mapping.
- If you used the PinePods gpodder server **and** an external server at the same time, the external server couldn't be carried over. Pinepods shows a notice on the home page; enter the server again in the sync settings.

## Troubleshooting

- **An app can't log in.** Compare the Server URL in the app with the one in the settings, and check that the gpodder server is switched on. Apps need an app password: your Pinepods password is refused. Try a fresh app password.
- **A podcast from an app doesn't show up.** New subscriptions are imported in the background. If the feed can't be fetched, Pinepods keeps trying for about a week and lists it under **Settings → Feed problems**, where you can try again, unsubscribe everywhere, or dismiss it. See [Feed problems and Podping](../Features/feed-updates.md).
- **The external server isn't syncing.** Look at the status for the last error, and use **Test connection** to check the login.
- **Logs.** Sync failures are logged as warnings in the Pinepods container log.

When reporting an issue on [GitHub](https://github.com/madeofpendletonwool/PinePods/issues), include the app and its version, whether you use the PinePods gpodder server or an external one (and which), and any errors from the status or the log.

## FAQ

**Can I use the PinePods gpodder server and an external server together?**
Yes. Pinepods syncs with the external server and serves your apps at the same time.

**Can I sync with more than one external server?**
Not at the moment: one external server per user.

**Will turning sync on delete podcasts?**
Turning on the PinePods gpodder server doesn't remove anything. The first sync with an external server merges both sides and doesn't remove anything either. After that, removing a podcast on one side removes it on the other.

**Is it secure?**
Use HTTPS (a reverse proxy in front of Pinepods) so passwords and sync data are encrypted in transit, and give each app its own app password.
