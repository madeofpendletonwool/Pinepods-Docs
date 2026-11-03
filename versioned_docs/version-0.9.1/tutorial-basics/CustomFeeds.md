# Adding a Feed by URL

When a podcast isn't in the search indexes (a premium or private feed, a small independent show), add it by its feed address. You can do this under **Settings → Add Custom Feed**, or with the **Custom Feed** button on the **Podcasts** page, which opens the same form.

1. Enter the RSS feed URL, for example `https://bestpodcast.com/feed.xml`.
2. If the feed needs a login, fill in **Username (optional)** and **Password (optional)**. Pinepods sends them as HTTP Basic authentication every time it fetches the feed. Leave both empty for public feeds.
3. Click **Add Feed**.

The podcast then works like any other: it refreshes on its own schedule (see [Feed updates](../Features/feed-updates.md)) and shows up in your Podcasts list.

Feeds that carry their credentials in the URL itself (`https://example.com/feed?token=…`) don't need the username and password fields; paste the whole URL.

## YouTube channels

The same section has a box for a YouTube channel URL, for example `https://www.youtube.com/@channelname` or `https://www.youtube.com/channel/UC…`. Click **Add Channel** to subscribe to it directly, without searching. See [YouTube channels](../Features/YouTube.md).
