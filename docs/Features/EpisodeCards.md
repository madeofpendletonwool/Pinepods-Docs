# Episode Cards

Episode lists on the web and desktop apps (Home, Feed, Saved, History, Queue, Downloads, playlists and podcast pages) all use the same card.

## What a card shows

- **Podcast name** above the title. Click it to open that podcast. Podcast pages leave it out, since every card there is from the same show.
- **Play button** with a ring that fills as you listen. It turns solid while the episode plays, and shows a check once you've finished it (hover it to play again).
- **Time left** in place of the duration once you've started an episode.
- **Status icons** for episodes you've saved, queued or downloaded.
- The **artwork** is a play button too. The episode playing now gets a highlight and an animated equalizer on its artwork.

## Artwork colours

Cards take an accent colour from each episode's artwork and use it for the podcast name, play ring, progress and highlight. The colour is adjusted for your theme, so it stays readable on light and dark themes alike. Artwork with no real colour (black and white covers, for example) uses your theme's accent instead.

Episode pages and podcast pages do the same with their artwork: the play or subscribe button, tabs, chapters, progress and other highlights take its colour, and the episode page's header sits on a blurred copy of the artwork.

To turn this off, go to **Settings → Change Theme** and switch off **Artwork colours**. The choice is saved in that browser, and signing out keeps it.

Colours are worked out in your browser from a copy of the artwork that your Pinepods server fetches. Each cover is only analysed once per browser.

## Episode preview

Click an episode's description to open a preview with the full show notes. From there you can:

- play, resume or pause the episode
- open the podcast, or the full episode page
- copy a link to the episode page (only people who can sign in to your server can open it)
- use the same **⋯** menu as the card (queue, save, download, mark complete and so on)

Press **Esc**, click outside the preview or click the close button to close it. On phones it opens as a sheet from the bottom of the screen.

## Faster page loads

Home, Feed and Podcasts show what you saw last time as soon as you open them, then update in the background when the server answers. This mostly helps on slower servers: you don't wait on a loading spinner for every visit, including right after reloading the page or reopening the desktop app.

The saved copy stays in your browser and belongs to your account on that server. Signing out deletes it.
