# The Settings Page

**Settings** in the sidebar opens a list of categories on the left and one category's settings on the right. On a phone the list comes first; tap a category to open it and use the back arrow to return.

- **Personal:** your own preferences and data. Every user sees these.
- **Server:** server-wide settings. Only admins see them.

**Search settings** at the top looks through every category at once, so typing `password`, `opml` or `gpodder` shows the matching sections wherever they live. Each section has a **?** button with a short description.

Every category has its own address (`/settings?page=playback`, for example), so you can bookmark one or send someone a link to it.

## Personal

| Category | Sections |
|---|---|
| **Account & security** | **Account Settings**: your username, name, email, password, language, timezone, date and time format. [Account Settings](./account-settings.md) · **MFA Settings**: two-factor sign-in. [MFA](./SettingUpMFA.md) · **API Keys**: keys for scripts and apps. [API Keys](./adding-an-api-key.md) |
| **Appearance** | **Change Theme**: a built-in or custom theme. [Themes](./Theming.md) · **Custom Themes**: build your own. [Custom Theme Creator](../Features/CustomThemes.md) · **Display Settings**: start page, podcast episode count, podcast covers, Gravatar, collection add mode. [Display Settings](./display-settings.md) |
| **Playback** | **Playback Settings**: default speed, auto-complete threshold, default volume. [Playback Settings](./PlaybackSettings.md) · **Auto-Delete Downloads**: clean up old and finished server downloads. [Downloads](../Features/Downloads.md#cleaning-up-server-downloads) |
| **Inbox & labels** | **Inbox**: how far back the inbox goes. **Episode labels**: create, rename, recolour and delete labels. [Inbox and Labels](../Features/Inbox.md) |
| **Notifications** | Push notifications through ntfy or Gotify. [Notifications](../tutorial-extras/SettingUpNotifications.md) |
| **Podcasts & feeds** | **Add Custom Feed**: a podcast or YouTube channel by URL. [Adding a Feed by URL](./CustomFeeds.md) · **Add Local Podcast**: a folder of audio on the server. [Local Podcasts](../Features/LocalPodcasts.md) · **Feed problems**: podcasts that stopped updating. [Feed problems](../Features/feed-updates.md#feed-problems) · **Match Podcasts to Podcast Index**, below |
| **Sync, import & export** | **Podcast Sync**: the PinePods gpodder server and external sync. [Podcast Sync](../tutorial-extras/gpodder-sync.md) · **Import Podcasts** and **Export/Backup Podcasts**: OPML. [OPML Import and Export](./Importing-Exporting.md) |
| **Sharing** | **Enable/Disable RSS Feeds**: publish your library as RSS feeds. [RSS Feeds](../tutorial-extras/RSSFeeds.md) · **Shared Links**: episode links you've shared. [Shared Episode Links](../Features/SharedLinks.md) |
| **AI** | Shown to users only while an admin has AI features on and the AI container is connected. The status of each AI feature and the AI job queue. [AI Setup](../AI/Setup.md) |

### Match Podcasts to Podcast Index

Podcasts you added by feed URL or OPML may not be linked to their [Podcast Index](https://podcastindex.org) entry. This section lists them. **Click To Search Podcast Index for Matches** looks for candidates; pick the right one and click **Match**. If nothing turns up, use **Manual Search**: **Search by Name**, or **Search By Podcast Index ID**. **Ignore** hides a podcast you don't want to match; **Restore** brings it back from **Ignored Podcasts**.

## Server

| Category | Sections |
|---|---|
| **Users & sign-in** | **User Management**: create, edit and delete users. [User Management](./user-management.md) · **User Self Service Settings**: let people create their own accounts. [User Self Service](./UserSelfService.md) · **OIDC/SSO Settings**: single sign-on providers. [OIDC Setup](../tutorial-extras/OIDC-setup.md) |
| **Downloads** | **Download Settings**: turn server downloads on or off, cover and metadata sidecar files. [Downloads](../Features/Downloads.md#server-download-settings-admins) · **YouTube (yt-dlp)**: yt-dlp version and updates. [YouTube Channels](../Features/YouTube.md#keeping-yt-dlp-working-admins) |
| **Podcast update services** | Podping and the search service status. [Podping](../Features/feed-updates.md#podping) |
| **Email Settings** | The mail server for password resets. [Email and Password Resets](../tutorial-extras/PasswordResets.md) |
| **AI** | For admins, AI sits here: the **AI features** switch, models and the job queue. [AI Setup](../AI/Setup.md) |
| **Backup & restore** | **Backup Server** and **Restore Server**: database backups, scheduled and manual, and restores. [Server Backup and Restore](./Backup-Restore.md) |
