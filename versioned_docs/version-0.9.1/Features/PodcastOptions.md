# Podcast Page and Podcast Options

Open a podcast from **Podcasts**, a search result or an episode to see its page: cover, description, hosts, categories and the episode list.

## The episode list

- **Sort:** **Newest First**, **Oldest First**, **Shortest First**, **Longest First**, **Title A-Z**, **Title Z-A**.
- **Filter** completed episodes: **All**, **Hide** completed, or **Show Only** completed, plus **In Progress**.
- **Select** turns on checkboxes. Use **Select All**, **Select Unplayed** or **Select In Progress**, then **Mark Complete**, **Queue** or **Download** the selected episodes.

## Buttons on the page

- **Subscribe / Subscribed** adds or removes the podcast.
- **Download all** downloads every episode to the server, after asking you to confirm.
- **RSS** shows a feed for just this podcast. See [RSS Feeds](../tutorial-extras/RSSFeeds.md#one-podcasts-feed).
- **Podcast settings** (the gear) opens **Podcast Options**, below.

## Podcast Options

All of these are per user: changing them doesn't affect anyone else who subscribes to the same podcast.

| Option | What it does |
|---|---|
| **Download Future Episodes Automatically** | Downloads each new episode to the server. See [Auto-Download](./AutoDownload.md). |
| **Auto-play next episode** | When an episode ends, plays the next newer episode of this podcast you haven't finished. See [What plays next](./Queue.md#what-plays-next). |
| **Auto-add new episodes to queue** | Adds each new episode to the end of your queue. |
| **Get Notifications For New Episodes** | Sends a push notification per new episode. See [Notifications](../tutorial-extras/SettingUpNotifications.md). |
| **Favorite Podcast** | See [Favorites](./Favorites.md). |
| **Default Playback Speed** | This podcast's speed, 0.5x–2.0x. **Reset** goes back to your default from **Settings → Playback Settings**. |
| **Auto-Delete Downloads After** and **Delete Downloads When Finished** | Override your defaults for this podcast. See [Downloads](./Downloads.md#cleaning-up-server-downloads). |
| **Use Podcast Covers** | Shows the podcast's cover instead of each episode's artwork. |
| **Auto Skip Intros and Outros** | **Start Skip** starts episodes this many seconds in (or where you left off, if that's later); **End Skip** treats the episode as finished this many seconds before the end, marks it complete and moves on. Click **Confirm** to save. |
| **Trim silence** | Skips silent gaps. See below. |
| **Auto-transcribe new episodes**, **Auto-detect ads on new episodes** | AI features; see [AI Transcription](../AI/Transcription.md) and [AI Ad Detection](../AI/AdDetection.md). Only shown when the AI container is set up. |
| **Youtube Download Episode Limit (days)** and the video filters | YouTube channels only. See [YouTube Channels](./YouTube.md#channel-settings). |
| **Adjust Podcast Categories** | Add or remove the podcast's categories. Categories drive [collection auto-add](./Collections.md#adding-episodes-automatically) and your listening stats. |
| **Merge Podcasts** | Shows the episodes of other podcasts you subscribe to under this one. **Unmerge** separates them again. |

### Trim silence

Turn on **Trim silence**, pick an **Aggressiveness** (**Low**, **Medium** or **High**), and click **Confirm**. Higher levels treat shorter and slightly louder pauses as silence.

How it works depends on where you listen:

- **Web, desktop and iOS:** Pinepods finds the silent stretches on the server, in the episode's server download, and the player jumps over them. Episodes need to be downloaded to the server, so pair it with auto-download. Analysis runs once per episode, after it's downloaded.
- **Android:** the player skips silence as it plays, so it also works when streaming.

## Editing a podcast's details

**Edit Podcast Info** changes the **Podcast Name**, **Description**, **Author**, **Artwork URL**, **Website URL** and **Podcast Index ID**, and the **Feed URL** with its **Username** and **Password** for protected feeds. Your edits stay when the feed refreshes.

- **Refresh from Feed** reads the whole feed now, updating the details you haven't edited and picking up new episodes.
- **Reset to Feed Details** throws away your edits to the name, artwork, author, description and website and uses what the feed has now.
