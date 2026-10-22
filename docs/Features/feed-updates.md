# Feed problems and Podping

## Feed problems

Pinepods refreshes your podcasts on a schedule. When a feed keeps failing, you see it instead of the podcast quietly going stale.

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

Failing feeds are retried less often the longer they fail: 30 minutes after the first failure, longer after each further one, up to once a day.

## Podping

[Podping](https://podping.org) is how many podcast hosts (Buzzsprout, Spreaker, RSS.com and others) announce a new episode the moment they publish it. With Podping on, Pinepods refreshes those feeds within about a minute instead of at the next scheduled refresh.

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
