# RSS Feeds

Pinepods can publish your library as podcast RSS feeds, so you can listen in any podcast app that subscribes by URL. The feeds are generated each time an app asks for them, so they're always current.

## Turning them on

Under **Settings → Enable/Disable RSS Feeds**, switch on **Enable RSS Feeds**. While it's off, every feed link returns an error.

The section then lists your feed links, each with a copy button:

| Group | Feeds |
|---|---|
| **General Feeds** | **All Subscriptions** (every episode from every podcast you subscribe to), **Saved Episodes**, **Queue**, **Downloads**, **History** |
| **Playlist Feeds** | one per [playlist](../Features/smart-playlists.md) |
| **Collection Feeds** | one per [collection](../Features/Collections.md) |

Every link has the form `https://your-server/rss/<user id>?api_key=<key>`, with `&source=…` added for everything except All Subscriptions. The key is an RSS key, not your API key: it can only read your feeds, not sign in to Pinepods.

## One podcast's feed

On a podcast's page, the RSS button shows a feed for just that podcast. Its link has a key of its own that only reads that podcast's feed, so it's safe to share: whoever has it can't get at your other feeds. This is useful for a premium feed you added to Pinepods with a username and password: other apps can subscribe to the Pinepods copy without the credentials.

:::caution
The links under **Settings → Enable/Disable RSS Feeds** all share one RSS key, so anyone with one of them can read all your feeds by changing the address. Share those only with people you'd show your whole library to; to share a single podcast, use the RSS button on its page.
:::
