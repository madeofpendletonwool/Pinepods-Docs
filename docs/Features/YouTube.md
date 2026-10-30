# YouTube Channels

You can subscribe to YouTube channels and listen to them like podcasts. Pinepods downloads each new video's audio with [yt-dlp](https://github.com/yt-dlp/yt-dlp), so videos play in the normal audio player and work offline.

## Subscribing

- **Search:** pick **YouTube** as the search source, search for a channel, and open it. Click **Subscribe** on the channel page. The mobile apps' search has the same YouTube option.
- **By URL:** paste the channel address (`https://www.youtube.com/@channelname` or `https://www.youtube.com/channel/UC…`) under **Settings → Add Custom Feed**, or in the **Custom Feed** form on the **Podcasts** page, and click **Add Channel**.

The channel's videos from the last 30 days are added in the background, so they take a moment to appear. After that, new videos are picked up as the channel refreshes; see [Feed updates](./feed-updates.md#youtube-channels) for how often and how.

## Channel settings

Open the channel and its settings:

| Setting | What it does |
|---|---|
| **Youtube Download Episode Limit (days)** | Only keep videos from the last this-many days. Older ones are removed, except ones you've played, saved, queued, downloaded, or added to a playlist or collection. `0` keeps every video the channel lists. |
| **Only add new videos that match** | Filters for new videos: **Shortest (minutes)**, **Longest (minutes)** and **Title contains**. Leave a field empty for no limit. For example, a minimum of 45 minutes keeps a channel's full episodes and skips its clips. Videos already added stay. |

Each subscriber has their own limit and filters.

## Keeping yt-dlp working (admins)

YouTube changes often break yt-dlp until a new yt-dlp comes out, so the copy inside Pinepods updates itself. **Settings → Admin → YouTube (yt-dlp)** shows:

| Setting | |
|---|---|
| **Current version** and **Last update** | The yt-dlp Pinepods is using. |
| **Update channel** | **Nightly** gets YouTube fixes fastest, usually the same day. **Stable** (the default) waits for a stable yt-dlp release. |
| **Automatic updates** | On by default. Checks for a newer yt-dlp on startup and once a day. |
| **Update now** | Updates straight away. |

If YouTube videos stop downloading, try **Update now** first.
