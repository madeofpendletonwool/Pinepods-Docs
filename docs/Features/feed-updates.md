# Feed updates, feed problems and Podping

## When feeds are refreshed

Each podcast is refreshed on its own schedule, based on how often it actually publishes. Pinepods checks once a minute for podcasts that are due.

- **How often:** an eighth of the typical gap between its last ten episodes, between 15 minutes and 6 hours. A daily show is checked about every 3 hours, a weekly one every 6 hours, one that posts twice a day about every 90 minutes.
- **Quiet podcasts** (no new episode in 90 days, or marked as finished by the feed) are checked once a day.
- **The feed and its host can slow this down:** a `Cache-Control: max-age` from the host, or the feed's `<sy:updatePeriod>`/`<sy:updateFrequency>`, set the shortest gap, up to the 6 hours above. Neither makes a podcast refresh more often than its publishing pattern.
- **Announced release times:** a feed with `<podcast:updateFrequency>` (for example "weekly on Mondays") is checked about 10 minutes after each announced time, even if that's sooner than usual.
- **Failures and "slow down" answers** push the next refresh further out (see below). A host asking Pinepods to wait (`Retry-After`) is left alone that long.
- Refresh times vary by up to 10% so feeds don't all come due at once.

A feed several people subscribe to is fetched once for all of them. **Refresh** in the app, **Refresh now** on a feed problem, adding a podcast and [Podping](#podping) refresh straight away; the next scheduled refresh follows from there.

| Variable | Default | Meaning |
|---|---|---|
| `PINEPODS_REFRESH_MAX_INTERVAL` | `24h` | The longest any podcast waits between refreshes. Minutes (`90`) or a number with `s`, `m`, `h` or `d` (`6h`). Set it lower to have even quiet podcasts checked more often; anything below 15 minutes makes every podcast refresh at that interval. |

`PINEPODS_REFRESH_CRON` (a cron schedule for refreshing everything at once) is deprecated. It's still read when `PINEPODS_REFRESH_MAX_INTERVAL` isn't set: the gap between its runs becomes the maximum interval (`0 */30 * * * *` → 30 minutes), and Pinepods logs a warning at startup.

After upgrading, each podcast's interval is worked out from the episodes already stored, and the first refreshes are spread over the following 30 minutes.

### YouTube channels

YouTube channels follow the same schedule, worked out from their videos.

- **New videos are spotted through the channel's RSS feed** (`youtube.com/feeds/videos.xml`), which lists its 15 newest videos. A refresh where nothing changed costs one small request. Changing view counts don't count as a change.
- **yt-dlp only runs for new videos.** All of a channel's new videos are fetched in one yt-dlp run, for their duration and description, and then their audio is downloaded. At most 3 yt-dlp processes run at once during refreshes.
- **A channel several people subscribe to is checked once for all of them.** Each subscriber gets the new videos within their own cutoff ("only videos from the last N days"). Nothing older than the longest cutoff among them is fetched.
- **If the RSS feed fails**, Pinepods lists the channel's 15 newest videos with yt-dlp instead. If that fails too, the channel shows up under [Feed problems](#feed-problems) like any other feed.
- Videos that yt-dlp can't read (members-only, private, upcoming premieres) are skipped without counting as a failure.
- **Old videos past your cutoff are removed**, except ones you've played, saved, queued, downloaded, or added to a playlist or collection.
- New videos show up in **Refresh** in the app as they arrive, the same way new podcast episodes do.

## Feed problems

When a feed keeps failing, you see it instead of the podcast quietly going stale.

**Settings → Feed problems** lists:

- **Podcasts that aren't updating**, with what went wrong in plain words and since when:
  - the feed isn't there any more (the host answers "not found");
  - the host refuses access;
  - the address doesn't return a podcast feed;
  - the host can't be reached, or keeps answering with an error;
  - the host asked Pinepods to slow down (it's then left alone for as long as it asks).

  **Refresh now** tries straight away. **Unsubscribe** removes the podcast.
- **Podcasts from sync apps that couldn't be added.** A podcast an app subscribed to through the [PinePods gpodder server](../tutorial-extras/gpodder-sync.md) (or that came from your external sync server) is retried after an hour, six hours, and then daily for about a week. **Try again** starts it now, **Unsubscribe** removes it from your sync apps too, **Dismiss** only hides it here.

You also get **one message in the activity panel** when a podcast has failed to update for a day (a feed that's gone is reported after three tries), and another when it works again. The podcast's own page shows a note while it's failing.

Failing feeds are retried less often the longer they fail: 30 minutes after the first failure, longer after each further one, up to once a day (or the podcast's usual interval, if that's longer).

## Podping

[Podping](https://podping.org) is how many podcast hosts (Buzzsprout, Spreaker, RSS.com and others) announce a new episode the moment they publish it. With Podping on, Pinepods refreshes those feeds within about a minute instead of waiting for their next scheduled refresh.

Turn it on under **Settings → Admin → Podcast update services**. It's off by default.

### How it works

Announcements are published on the Hive blockchain. The Pinepods search service follows the chain and keeps the last day of announced feed addresses. Your Pinepods server asks it once a minute for the announcements since the last time, matches them against its own subscriptions, and refreshes the matches through the normal refresh (same caching, same limits). A feed refreshed because of an announcement isn't fetched again for 5 minutes; announcements in that time are picked up when the 5 minutes are over.

Nothing about your subscriptions leaves your server: it downloads all announcements and does the matching itself.

### Settings

| Where | Variable | Default | Meaning |
|---|---|---|---|
| Pinepods | `PINEPODS_PODPING_URL` | the search service (`SEARCH_API_URL` without `/api/search`) | Where announcements are read from. |
| Pinepods | `PINEPODS_PODPING_INTERVAL` | `60` | Seconds between reads. |
| Search service | `PODPING_ENABLED` | `true` | Follow Podping and serve `/api/podping/updates`. |
| Search service | `HIVE_API_NODES` | `https://api.hive.blog,https://api.deathwing.me,https://api.openhive.network` | Hive API nodes to read from, tried in turn. |

If you run your own search service, update it to get the Podping relay; Pinepods shows "the relay isn't available" until then.

## Search service status

The same admin section shows whether the search service answers and how quickly. When it doesn't, searching in Pinepods says so ("Search isn't available") instead of failing silently.
