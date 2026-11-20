# Searching

Pinepods has two searches.

## Finding new podcasts

The search box at the top of every page looks for podcasts to subscribe to. Pick where to search first:

| Source | |
|---|---|
| **Podcast Index** (default) | The open podcast directory. Recommended: its listings carry the Podcasting 2.0 details Pinepods uses, such as chapters, people, funding and transcripts. |
| **iTunes** | Apple's directory. |
| **YouTube** | YouTube channels. See [YouTube Channels](./YouTube.md). |

Open a result to see its episodes, and subscribe with the button on the podcast's page.

The search goes through your Pinepods server to the search service set by `SEARCH_API_URL`, either the hosted one or [your own](../API/search_api.md).

The mobile apps search the same way. Their default directory is set in the app under **Settings → Search provider**.

If a podcast isn't in any directory, add it by its feed URL: see [Adding a Feed by URL](../tutorial-basics/CustomFeeds.md).

![Seach Button](/img/search.png)

## Searching your library

**Search** in the sidebar searches what you already have: episode titles, show notes and descriptions across everything you subscribe to.

- **Filter by status:** **All**, **Unplayed**, **In Progress**, **Saved**, **Downloaded**.
- **Recent searches** are kept so you can run them again.
- Before you search, the page shows what's **Most played in your library** and lets you **Browse by category**.
- **Select** lets you tick results and **Mark Complete**, **Save**, **Queue** or **Download** them together.

## Searching inside transcripts

Turn on **Search inside transcripts** under the search box to also find episodes where your search was *said*. The setting is remembered. Matching episodes show up first, under **Said in episodes**, each with:

- the lines where the words were said, with the words highlighted
- a timestamp button on each line that plays the episode from there
- how many times they were said, and whether the match came from the podcast's own transcript or an AI one

Click an episode to open its page at the first match: the **Transcript** tab opens scrolled to that line, with **Play from here** and the search already in the transcript's find box.

Words are matched whole and every word must appear. Put a phrase in quotes (`"machine learning"`) to find it exactly, and put `-` before a word to leave out episodes that say it (`rust -game`).

Only episodes with a stored transcript can be found:

- **Transcripts the podcast publishes** ([Podcasting 2.0 transcripts](./Transcript.md)) are fetched in the background a batch at a time, newest episodes first, so a big library takes a few hours to become fully searchable after upgrading. One that can't be fetched is tried again a week later.
- **AI transcripts** are searchable as soon as they finish. See [AI Transcription](../AI/Transcription.md).

When an episode has both, the AI transcript is searched first, because its timings match the audio your server plays.

The mobile apps have the same switch (**Transcripts**) on their search page.

:::note SQLite
On PostgreSQL and MariaDB/MySQL, transcript search uses the database's full-text index. MariaDB/MySQL skip words shorter than three letters and very common words such as "the". On SQLite it reads the transcripts directly: it's slower on big libraries, matches parts of words, and ignores case for English letters only.
:::

