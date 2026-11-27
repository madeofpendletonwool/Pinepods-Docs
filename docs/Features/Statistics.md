# Listening Statistics

Each user has a statistics page. To open it, click your avatar at the top of the sidebar on the web, or tap your avatar in the mobile app. It only shows your own listening.

![The PinePods user statistics dashboard](/img/screenshots/userstats.png)

The top of the page shows your name, when you started (your account's creation date), your **Listening Style** and your total **Time Listened**.

## Periods

Below that, pick **All time**, a year, or a month of that year. Only years and months you listened in are offered. A year or month shows its own listening, days listened and best streak, episodes played and finished, time saved, a calendar, time of day, day of week, months (for a year), top podcasts and categories, and everything under [More from your listening](#more-from-your-listening).

Periods come from the [listening record](ListeningProgress.md#listening-time), which starts when your server is updated to a version that keeps it. A period from before then shows only what was recorded, with a note saying when the record starts; **All time** also counts the per-episode history from before then.

## Rewind

**Rewind** plays back a month or a year of your listening as a story, one full-screen slide after another. You can play one whenever you like, as often as you like; nothing is held back until the period ends. The **Rewind** banner near the top of the page offers the latest year and the last two months you listened in. When you pick a year or a month below it, **Play Rewind** sits beside the period's name.

A Rewind shows, when there is something to show:

- how long you listened, how many podcasts and episodes, and the change from the month or year before
- the first thing you played (for a period fully covered by the [listening record](ListeningProgress.md#listening-time))
- your top podcast, with its share of your listening, and your top five
- the episode you spent the most time with
- podcasts you played for the first time that period
- your top genres, and the [hosts and guests](Person.md) you heard most
- what kind of listener you are, from the hour you listen most, and your biggest day of the week
- your longest streak, biggest day and how many days you listened
- for a year, your biggest month
- your average speed, time saved, and how often you play new episodes within a day of release
- a summary card to finish

Slides move on by themselves. Tap or click the right side for the next one and the left side to go back; hold to pause. On the web, the arrow keys move between slides, space pauses and Escape closes.

A year that started before your server kept the listening record still gets a Rewind: listening from before the record began counts from the per-episode history, so totals, top podcasts and top episodes include it. Days, hours and streaks only cover the record, and the slides that use them say from which day. Monthly Rewinds are complete from the first full month of the record onwards.

The same data is available from `GET /api/data/rewind?user_id=…&period=YYYY` or `period=YYYY-MM`.

## All time

**Time Listened**, the activity charts, **Top Podcasts** and **Favorite Categories** count time audio was actually playing: not paused time, and not episodes you skipped through or marked as played. See [Listening Progress](ListeningProgress.md#listening-time).

| Item | What it is |
|---|---|
| **Listened in (year)** | Listening time this calendar year. |
| **Episodes Finished** | Episodes you listened to at least 90% of, with that as a share of every episode you started (the completion rate). |
| **Day Streak** | How many days in a row you've listened, up to today (or yesterday if you haven't listened yet today), with your best run underneath. |
| **Days Listened** | How many different days you've listened on. |
| **Episodes Played** | How many different episodes you've started. |
| **Left to Hear** | Episodes in your subscriptions you haven't started, and how long they'd take to hear. |
| **Time Saved** | Time saved by playback speed and by skipping silence and ads. Shown once there is a minute of it. See [Time saved](ListeningProgress.md#time-saved). |
| **Activity** | A calendar of the last six months, darker on days you listened more. |
| **Time of Day** | Listening by hour, with your busiest hour highlighted. |
| **Listening by Day of Week** | |
| **Last 12 Months** | Listening per month. |
| **Top Podcasts** | The five podcasts you've spent the most time on. |
| **Favorite Categories** | The five categories you've spent the most time on, as a share of their combined time. |
| **Longest Episode Listened** | |
| **Library** | Podcasts you subscribe to, how many of them you've played, episodes saved and downloaded (with their size), and which [sync](../tutorial-extras/gpodder-sync.md) you use. |

## More from your listening

These appear for every period, once there is listening in it:

| Item | What it is |
|---|---|
| **Biggest day** | The day you listened most. |
| **Busiest week** | The Monday-to-Sunday week you listened most. |
| **Longest session** | Your longest stretch of listening, with no gap over 10 minutes, across episodes. |
| **Sessions** | How many sessions, and how long they last on average. |
| **Average speed** | Your playback speed, weighted by time played. From Pinepods' own apps. |
| **Played from downloads** | Time played from files downloaded to your device, and its share of your listening. |
| **After release** | How long after release you usually first play an episode, and how many you heard within a day. |
| **Top Episodes** | The episodes you spent the most time on. |
| **Most Heard Voices** | Hosts and guests credited on what you played (an episode's own credits, else its podcast's), by time. See [People](Person.md). |
| **Listening by App** | Your listening split between web, desktop, Android, iOS, podcast sync and other apps. |
| **Most Ads Skipped** | The podcasts where ad skipping saved you the most time. |

Podcasts you've since unsubscribed from still appear, without a link.

The same figures are available from `GET /api/data/listening_report?user_id=…&start=YYYY-MM-DD&end=YYYY-MM-DD` (leave out `start` and `end` for all time).

**Listening Style** is Night Owl, Evening, Afternoon or Morning Listener, from the average time of day you listen.

These numbers are counted from your library and listening history, so podcasts and plays that arrive through [Podcast Sync](../tutorial-extras/gpodder-sync.md) count the same as ones from Pinepods' own apps.

Days and hours use the timezone in your [account settings](../tutorial-basics/account-settings.md). The calendar, time of day, day of week, monthly and streak figures come from the [listening record](ListeningProgress.md#listening-time), which counts each day and hour you actually listened. It starts when your server is updated to a version that keeps it; for listening before then, Pinepods only has one history entry per episode, so that time counts on the day you last played each episode.

The page also shows the server's Pinepods version and links to the documentation and the GitHub repository.

## In the mobile app

The mobile app's statistics page has the same periods, sections and [Rewind](#rewind). Pick **All time**, a year or a month from the chips at the top. The **Activity** calendar for a year scrolls sideways. Tap a podcast to open it, or a person to see their page. Pull down to refresh.

Servers older than the listening record show the all-time figures only. Servers older than that show the account totals and **Library**.
