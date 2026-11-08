# Local Podcasts

A local podcast is a folder of audio files on your server (an audiobook, an archive of an old show, your own recordings) turned into a podcast you can play, queue and track like any other.

![Adding a local podcast in PinePods](/img/screenshots/localpodcast.png)

## Mounting your media

Pinepods reads local media from `/opt/pinepods/local-media` inside the container. Mount your library there:

```yaml
    volumes:
      - /home/user/pinepods/local-media:/opt/pinepods/local-media
```

On Kubernetes, turn on `persistence.localMedia.enabled` in the Helm chart and set `persistence.localMedia.existingClaim` to a volume that holds your media (or let the chart create one).

The mount must be writable: artwork you upload for a local podcast is saved in an `_artwork` folder inside it.

Keep each podcast in its own folder.

## Adding a local podcast

Under **Settings → Add Local Podcast**:

1. Enter a **Podcast Name**.
2. Enter the folder as a path inside the local-media mount, for example `audiobooks/my-series`, or click **Browse** to pick it.
3. Optionally add an **Author**, a **Description**, **Artwork**, and tick **Explicit**.
4. Leave **Check the folder for new files automatically** on to have new files picked up by themselves (see below).
5. Click **Add Local Podcast**.

Pinepods reads the folder (not its subfolders):

- **Episodes:** every `.mp3`, `.m4a`, `.ogg`, `.flac`, `.wav`, `.aac` and `.opus` file.
- **Episode details** come from the files' tags: title, description, date and track number. A file without a date uses its modification time.
- **Order:** by track number, then by file name.
- **Cover:** the artwork you uploaded; otherwise a `cover.jpg`, `cover.jpeg`, `cover.png`, `folder.jpg`, `folder.jpeg`, `artwork.jpg` or `artwork.png` in the folder, or artwork embedded in the files.

## Adding new files

Audio files you add to the folder later become episodes:

- **Automatically:** Pinepods looks at the folder every 15 minutes (or at `PINEPODS_REFRESH_MAX_INTERVAL`, if you've set it lower), and again whenever you press **Refresh** in the app. Only new files are read, so a big folder costs no more than listing it.
- **Right away:** the refresh button on the podcast's page (**Check for new episodes**) looks now. In the mobile app it's in the podcast's **⋯** menu.

New episodes are added to your queue if the podcast has **Auto-add new episodes to queue** on. They're already on the server, so auto-download has nothing to do.

To stop the automatic checks, turn off **Refresh automatically** in the podcast's [options](./PodcastOptions.md#podcast-options); the refresh button still works. If the folder disappears (the mount is missing, or it was renamed), the podcast shows up under [Feed problems](./feed-updates.md#feed-problems) until it's back.

Files you delete from the folder aren't removed from Pinepods; delete the podcast and add it again to start over.

Local podcasts are never touched by auto-delete; the files are yours.
