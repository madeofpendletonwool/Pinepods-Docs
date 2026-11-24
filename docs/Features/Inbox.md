# Inbox and Episode Labels

The **Inbox** holds the new episodes you haven't dealt with yet. Go through it, decide what to do with each episode, and it empties as you go. The [Feed](../tutorial-basics/browsing-podcasts.md) doesn't change: it still shows everything from the last 30 days, whether you've acted on it or not.

Open it from **Inbox** in the sidebar on the web (the number beside it is how many episodes are waiting), or the **Inbox** tab in the mobile apps. If you've reordered the mobile tab bar before, the Inbox tab is added at the end; move it with **Settings → Reorganize Bottom Bar**.

## What's in the inbox

An episode is in your inbox when all of these are true:

- It's from a podcast or YouTube channel you subscribe to, and that podcast's **Show in Inbox** option is on (it is by default).
- It was released within the inbox's time window: the last 30 days unless you change it (see [Settings](#settings)).
- You haven't played any of it, marked it played, queued it, saved it, downloaded it to the server, or removed it from the inbox.

So doing any of those things takes an episode out of the inbox, wherever you do it: from the inbox itself, the Feed, the podcast's page, another device or a synced app. Taking an episode back out of the queue (or unsaving it) without having played it puts it back.

Labels don't take an episode out of the inbox. They're for sorting it (see [Labels](#labels)).

## Working through it

### Web

Each episode in the inbox has buttons under it:

| Button | What it does |
|---|---|
| **Play next** | Adds it to the queue right after what's playing. |
| **Queue** | Adds it to the end of the queue. |
| **Save** | Saves it. |
| **Played** | Marks it played. |
| **Labels** | Opens the label picker for it. |
| **Dismiss** | Takes it out of the inbox and nothing else. **Undo** at the top of the page brings it back. |

Playing an episode from the inbox takes it out the next time the inbox loads. The episode's **⋯** menu has the usual actions too, plus **Remove from Inbox**.

At the top of the page:

- **Newest first / Oldest first** changes the order. Oldest first is handy for catching up on a backlog.
- The filter chips show **All** episodes, only **Unlabeled** ones, or only those with one label. The podcast list narrows it to one podcast.
- **Label shown** opens the label picker for every episode that's showing, so you can label a whole filtered list at once.
- **Clear inbox** (or **Clear shown** while a filter is on) removes everything the inbox is showing, after asking you to confirm. **Undo** brings back the episodes that were loaded on the page.
- The gear opens the inbox settings.

### Mobile

- Swipe an episode **right** to add it to the queue, or **left** to take it out of the inbox. The message that appears has **Undo**.
- Long-press an episode for the episode menu: **Remove from inbox**, **Labels…**, save, download, queue (top or bottom) and mark played. Saving, downloading, queueing or marking it played also takes it out of the inbox.
- The filter chips work like on the web. The **⋯** menu at the top has **Refresh**, **Label shown**, **Clear inbox** and **Inbox settings**; the arrows switch between newest and oldest first.

## Keeping a podcast out of the inbox

Turn off **Show in Inbox** for a podcast and its episodes stop appearing in the inbox. They're still in the Feed and on the podcast's page.

- **Web:** on the podcast's page, open **Podcast settings** (the gear). See [Podcast Options](./PodcastOptions.md#podcast-options).
- **Mobile:** in the podcast's **⋯** menu.

A podcast set to [add new episodes to the queue](./PodcastOptions.md#podcast-options) automatically never shows in the inbox, since its new episodes are queued as they arrive.

## Labels

Labels are your own tags for episodes, like **Listen**, **Maybe**, **Later** or **Important**. Each has a name and a colour. They belong to your account, so they're the same on every device, and nobody else sees them.

- **Put a label on an episode:** choose **Labels…** in any episode's menu (web or mobile), or **Labels** on an inbox card. Tick the labels you want; untick to take one off. You can make a new label right there, and it goes straight onto the episode.
- **See them:** an episode's labels show as coloured chips on its card on every page. On the web, clicking the chips opens the picker.
- **Filter the inbox** by a label with the chips at the top, or show only **Unlabeled** episodes to find the ones you haven't sorted yet.
- **Build a playlist from them:** a [smart playlist](./smart-playlists.md#labels-optional) can be limited to episodes with certain labels, for example "everything labeled Listen from the last 7 days".

Manage your labels (rename, recolour, delete, see how many episodes each has) under **Settings → Inbox & labels** on the web, or **Settings → Inbox & labels** (under **Playback**) in the mobile apps. Deleting a label takes it off every episode, and smart playlists that filtered on it stop doing so.

Label names are unique per user, ignoring case, and up to 64 characters.

## Settings

**How far back the inbox goes** (default 30 days, up to 365): episodes released earlier than this don't show in the inbox. Set it longer to work through a backlog, for example 90 days if you're three months behind. Find it under **Settings → Inbox & labels** on the web and in the mobile apps.

## API

The inbox and labels have their own endpoints under `/api/data/inbox` and `/api/data/labels`, and act for the user whose API key makes the call. See the **inbox** section of the [API reference](/docs/API/reference/).
