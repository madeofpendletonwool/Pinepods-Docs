# Notifications

Pinepods tells you about things in two places:

- **Push notifications** to your phone or desktop through [ntfy](https://ntfy.sh) or [Gotify](https://gotify.net), for new episodes of the podcasts you choose.
- **The Activity panel** in the web app, for downloads and other background work, and for messages from the server such as a feed that stopped updating.

## Push notifications for new episodes

Push notifications are set up per user and turned on per podcast.

### 1. Set up a platform

Under **Settings → Notification Settings**, pick a **Notification Platform** and switch on **Enable Notifications**.

**ntfy**

| Field | |
|---|---|
| **ntfy Topic** | The topic to publish to. Anyone who knows a topic on a public server can read it, so pick something hard to guess. Subscribe to the same topic in the ntfy app. |
| **ntfy Server URL** | `https://ntfy.sh` by default, or your own ntfy server. |
| **Authentication (Optional)** | For a protected topic: either **Username** and **Password**, or an **Access Token**. Not both. |

**Gotify**

| Field | |
|---|---|
| **Gotify Server URL** | Your Gotify server, for example `https://gotify.example.com`. |
| **Gotify App Token** | Create an application in Gotify's web interface and paste its token. |

Click **Save Settings**, then **Send Test Notification** to check it arrives.

### 2. Choose the podcasts

Notifications are off for every podcast until you turn them on. Open the podcast, open its settings, and turn on **Get Notifications For New Episodes**.

When a refresh finds new episodes of that podcast, you get one notification per episode: "New episode available for *podcast*: *episode*".

## The Activity panel

The bell in the web app's top bar opens the Activity panel. The number on the bell counts what's running and anything that needs your attention.

It lists:

- **Tasks:** downloads, YouTube downloads, OPML imports, adding a podcast, backups and restores, sync runs and feed refreshes, with their progress. Related tasks, such as the episodes of a bulk download, are grouped.
- **Messages** from the server, for example a podcast that has [stopped updating](../Features/feed-updates.md#feed-problems) and when it works again, or a podcast from a sync app that couldn't be added. Click a message to go to the related page.

The **All**, **Active** and **Done** tabs filter the list. Finished tasks move to **Done** and stay until you clear them. Dismiss a message with its **×**. Messages also expire on their own: information after a day, warnings and errors after 30 days.
