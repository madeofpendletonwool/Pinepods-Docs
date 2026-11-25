# Finding Your Way Around

The sidebar of the web and desktop apps starts with your avatar and name (click for your [statistics](../Features/Statistics.md)), then groups its pages. The page you're on is highlighted.

| Page | What's on it |
|---|---|
| **Listen** | |
| **Home** | Continue listening, your week, recent episodes, top podcasts, collections and playlists. [Home](./sign-in-homescreen.md#the-home-page) |
| **Feed** | Episodes from all your podcasts and YouTube channels published in the last 30 days, newest first. |
| **Inbox** | New episodes you haven't played, queued, saved or dismissed yet, with one-click triage and labels. [Inbox and Labels](../Features/Inbox.md) |
| **Collections** | Saved episodes and your own collections. [Collections](../Features/Collections.md) |
| **Playlists** | Smart playlists. [Smart Playlists](../Features/smart-playlists.md) |
| **History** | Episodes you've listened to, with search. |
| **Downloads** | Episodes downloaded to the server. [Downloads](../Features/Downloads.md) |
| **Local Downloads** | Desktop app only: episodes saved to your computer. |
| **Library** | |
| **Podcasts** | Everything you subscribe to. |
| **People You Follow** | New episodes from hosts and guests you follow. [People](../Features/Person.md) |
| **Search** | Search your own library. [Searching](../Features/Search.md#searching-your-library) |
| **Explore** | |
| **Discover** | Trending shows, fresh episodes you can play without subscribing, **For You** picks, the charts, categories and hosts. |

**Settings** ([The Settings Page](./settings.md)) and **Sign Out** sit at the bottom. The queue opens from the queue button in the top bar ([The Queue](../Features/Queue.md)).

At the top of every page are the search box for finding new podcasts ([Searching](../Features/Search.md)), the favorites filter star ([Favorites](../Features/Favorites.md)), the Activity bell ([Notifications](../tutorial-extras/SettingUpNotifications.md#the-activity-panel)) and, on wide screens, the devices button ([Playing on Other Devices](../Features/RemoteDevices.md)).

The player sits at the bottom; click it, or drag it up with the mouse or a finger, for the full-screen player, and drag that down (or press **Esc**) to close it. Click the podcast name above the episode title to go to that podcast's page. Its **Queue** button opens the queue panel ([The Queue](../Features/Queue.md)), and episodes with chapters get a **Chapters** button ([Chapters](../Features/Chapters.md)) and notches on the progress bar.

Drag or click anywhere on the progress bar to jump; a bubble shows the time (and chapter) you'll land on, and the jump happens when you let go. Click the total length to show the time remaining instead. The **speed** button in the full-screen player has presets from 0.75× to 2.5× and a slider from 0.5× to 3×; on a computer, volume sits beside it and on the right of the bar.

| Key | Does |
|---|---|
| **Space** | Play or pause |
| **←** / **→** | Back or forward 15 seconds |
| **Esc** | Close the full-screen player |

With the progress bar focused, the arrow keys move 5 seconds, **Page Up** / **Page Down** 30, and **Home** / **End** jump to the start or end.

## Podcasts

The **Podcasts** page lists your subscriptions as a grid or a list (toggle at the top). Sort by name (**A to Z**, **Z to A**), **Most Episodes** or **Least Episodes**, **Newest First** or **Oldest First**, **Most Played** or **Least Played**, and filter by category. The star on a cover marks it as a [favorite](../Features/Favorites.md). **Custom Feed** adds a podcast by its feed URL.

Click a podcast to open its page. See [Podcast Page and Podcast Options](../Features/PodcastOptions.md).

## Discover

Discover shows what's popular on the Podcast Index and what's new on it. From top to bottom:

- **Category and language filters.** Pick a category to narrow the spotlight, fresh episodes and charts to it (**More categories** shows the full Podcast Index list). The language menu limits them to shows in one language; it starts at your Pinepods language and remembers what you pick.
- **Spotlight.** The five top trending shows take turns in a large banner (hover over it to pause). **Play latest** plays the show's newest episode, **Follow** subscribes, and **Open show** opens its page so you can look through its episodes first.
- **Fresh episodes.** The newest episodes from the trending shows, at most two per show. Press play on one to listen without subscribing; Pinepods still keeps your progress. Click the card to open the episode's page.
- **For You.** Podcasts similar to the ones you listen to, grouped by why they were picked ("Because you listen to…"). It's worked out on your server from your subscriptions, how much you listen to them and their categories, so it needs a few subscriptions first. Hidden while a category is selected.
- **Top charts.** Trending shows six to twenty-five, with their main category.
- **Browse by category.** Large tiles for the popular categories; clicking one selects it above.
- **Discover Hosts.** Hosts from PodPeopleDB with the most shows. See [People](../Features/Person.md).

The **+** on a show subscribes to it, and turns into a check once you follow it. Click it again to unsubscribe.

Fresh episodes need a search service that has the `/api/episodes` endpoint (see [Search API](../API/search_api.md)). With an older one the row is left out and a note says why; the rest of Discover still works.

## Episode actions

Every episode has a three-dot menu with **Queue Episode**, **Save Episode**, **Add to Collection**, **Download Episode** (and **Download to this computer** in the desktop app), **Mark Episode Complete**, and **Play on** another device when one is online. Click an episode to open its page with the show notes, chapters, people, transcript and the **Share Episode** button.
