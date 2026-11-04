# Using Firewood

Firewood has a sidebar with every page, a now-playing bar at the bottom, and the keys for the current page always on screen. **?** lists every key for the page you're on.

## Getting around

| Key | |
|---|---|
| **1–9**, **0** | Jump to a sidebar entry. **Tab** / **Shift+Tab** step through them. |
| **j/k** or **↑/↓** | Move. **g/G** first/last, **Ctrl+D/U** page down/up. |
| **Enter** | Play an episode or open a podcast. |
| **i** or **l** | An episode's details and show notes. **Esc** goes back. |
| **/** | Filter the current list. **Enter** keeps the filter, **Esc** clears it. |
| **:** or **Ctrl+P** | Command palette: type a few letters of a command, a page ("go queue"), a podcast, an episode on screen ("play …") or a recent search. |
| **q** | Quit. **Ctrl+C** works anywhere. |

The mouse works too: click to select, click again to play or open, scroll lists, click the progress bar to seek. `FIREWOOD_NO_MOUSE=1` turns it off.

## Playing

| Key | |
|---|---|
| **Space** | Play/pause. |
| **←/→** | Skip back/forward (15 s by default; **Skip by** in Settings). |
| **[ / ]** | Slower/faster, 0.5× to 3×, without changing pitch. |
| **+/-** | Volume. |
| **n** | Now Playing, which adds **=** for normal speed, **t** to toggle [trim silence](../Features/PodcastOptions.md#trim-silence) for the podcast, **x** to stop, and **.** / **,** for next and previous chapter. |
| **v** | On Now Playing or an episode's details, switch between show notes, chapters and transcript. **Enter** on a chapter or a transcript line jumps there. |

Playback starts each episode at the podcast's speed from Pinepods, resumes where you left off, and saves your position to the server as you listen. Firewood skips the ads and silence Pinepods has detected and the podcast's intro and outro skip times. Episodes the server has downloaded, and YouTube videos, play from the server's copy; the rest stream from the feed.

When an episode ends it's marked played and the next one in your [queue](../Features/Queue.md) starts. Started from a playlist, the playlist's next episode plays instead.

The keyboard's media keys and the system's media controls work too: MPRIS on Linux (so `playerctl` works) and Now Playing on macOS. Next and previous skip by the skip length. Turn this off in Settings or with `FIREWOOD_MEDIA_KEYS=0`.

Firewood plays MP3, AAC/M4A, FLAC, Ogg Vorbis and WAV.

## On any episode

| Key | |
|---|---|
| **a** / **A** | Add to or remove from the queue / play next. |
| **s** | Save or unsave. |
| **d** | Have the server download it, or delete the server's copy. |
| **m** | Mark played or unplayed. |
| **c** | Add it to or take it out of a [collection](../Features/Collections.md). |
| **o** | Play it on another of your devices. See [Remote Control](./Beaming.md). |

## Pages

| Page | |
|---|---|
| **Home** | Where you left off, new episodes and your most-played podcasts. |
| **Feed** | Recent episodes from every subscription. **f** cycles All / Unplayed / In progress / Played. |
| **Podcasts** | Your subscriptions; **Enter** lists a podcast's episodes. **U** twice unsubscribes. |
| **Queue** | **K/J** move an episode up/down, **t/b** to the top/bottom, **x** remove, **S** shuffle, **C** twice to clear. |
| **Saved** | Saved episodes, and your other collections after it. |
| **Playlists** | Your [playlists](../Features/smart-playlists.md); playing from one carries on through it. |
| **History** | What you've played, newest first. |
| **Downloads** | Episodes the server has a copy of, by podcast. |
| **Search** | Your library's episodes as you type. **f** switches to finding new podcasts on Podcast Index, iTunes or YouTube: type a name, **Enter**, then **s** to subscribe. |
| **Devices** | Your other players. See [Remote Control](./Beaming.md). |
| **Now Playing** | The current episode, its chapters and transcript. |
| **Settings** | See below. |

## Settings

**Theme**, **Cover art**, **Media keys**, **Starting volume**, **Skip by**, **Audio output**, **Name on other devices**, **Sidebar order**, **Key bindings** and **Logs**, plus who you're signed in as and the version.

- **Themes:** Firewood starts with the theme you picked in the web app, custom themes included, until you pick one in Settings. **Terminal** uses your terminal's colors. `FIREWOOD_COLOR=truecolor` or `256` overrides the color detection.
- **Cover art** shows as real images in terminals with the kitty (kitty, Ghostty), sixel (foot, Konsole) or iTerm2 (iTerm2, WezTerm) protocols, and as colored blocks elsewhere. In tmux, set `set -g allow-passthrough on`. `FIREWOOD_GRAPHICS=kitty|sixel|iterm2|blocks` forces one.
- **Key bindings** writes `~/.config/pinepods-firewood/keymap.toml` with every binding commented out. Uncomment a line, change its keys and restart:

  ```toml
  [global]
  quit = ["q", "ctrl+q"]

  [queue]
  move_up = ["U", "shift+up"]
  ```
