# The Settings Page

**Settings** in the sidebar has two tabs:

- **User Settings:** your own preferences and data. Every user sees this tab.
- **Admin Settings:** server-wide settings. Only admins see it. These docs write it as **Settings → Admin → …**.

Each section has a **?** button with a short description.

## User Settings

| Section | What it's for |
|---|---|
| **Change Theme** | Pick a built-in or custom theme. [Themes](./Theming.md) |
| **Custom Themes** | Build your own theme. [Custom Theme Creator](../Features/CustomThemes.md) |
| **Account Settings** | Your username, name, email, password, language, timezone, date and time format. [Account Settings](./account-settings.md) |
| **Playback Settings** | Default speed, auto-complete threshold, default volume. [Playback Settings](./PlaybackSettings.md) |
| **Auto-Delete Downloads** | Clean up old and finished server downloads. [Downloads](../Features/Downloads.md#cleaning-up-server-downloads) |
| **AI** | Status of the AI features; admins also choose models here. [AI Setup](../AI/Setup.md) |
| **MFA Settings** | Two-factor sign-in. [MFA](./SettingUpMFA.md) |
| **Export/Backup Podcasts** and **Import Podcasts** | OPML export and import. [OPML Import and Export](./Importing-Exporting.md) |
| **Display Settings** | Start page, podcast covers, Gravatar, collection add mode. [Display Settings](./display-settings.md) |
| **Notification Settings** | Push notifications through ntfy or Gotify. [Notifications](../tutorial-extras/SettingUpNotifications.md) |
| **Add Custom Feed** | Add a podcast or YouTube channel by URL. [Adding a Feed by URL](./CustomFeeds.md) |
| **Add Local Podcast** | Turn a folder of audio on the server into a podcast. [Local Podcasts](../Features/LocalPodcasts.md) |
| **Podcast Sync** | The PinePods gpodder server and external sync. [Podcast Sync](../tutorial-extras/gpodder-sync.md) |
| **Feed problems** | Podcasts that stopped updating. [Feed problems](../Features/feed-updates.md#feed-problems) |
| **Enable/Disable RSS Feeds** | Publish your library as RSS feeds. [RSS Feeds](../tutorial-extras/RSSFeeds.md) |
| **Match Podcasts to Podcast Index** | Link podcasts added by URL or OPML to their Podcast Index entry, below. |
| **API Keys** | Keys for scripts and apps. [API Keys](./adding-an-api-key.md) |
| **Shared Links** | Episode links you've shared. [Shared Episode Links](../Features/SharedLinks.md) |

### Match Podcasts to Podcast Index

Podcasts you added by feed URL or OPML may not be linked to their [Podcast Index](https://podcastindex.org) entry. This section lists them. **Click To Search Podcast Index for Matches** looks for candidates; pick the right one and click **Match**. If nothing turns up, use **Manual Search**: **Search by Name**, or **Search By Podcast Index ID**. **Ignore** hides a podcast you don't want to match; **Restore** brings it back from **Ignored Podcasts**.

## Admin Settings

| Section | What it's for |
|---|---|
| **User Management** | Create, edit and delete users. [User Management](./user-management.md) |
| **OIDC/SSO Settings** | Single sign-on providers. [OIDC Setup](../tutorial-extras/OIDC-setup.md) |
| **Podcast update services** | Podping and the search service status. [Podping](../Features/feed-updates.md#podping) |
| **Download Settings** | Turn server downloads on or off, cover and metadata sidecar files. [Downloads](../Features/Downloads.md#server-download-settings-admins) |
| **YouTube (yt-dlp)** | yt-dlp version and updates. [YouTube Channels](../Features/YouTube.md#keeping-yt-dlp-working-admins) |
| **User Self Service Settings** | Let people create their own accounts. [User Self Service](./UserSelfService.md) |
| **Email Settings** | The mail server for password resets. [Email and Password Resets](../tutorial-extras/PasswordResets.md) |
| **Backup Server** and **Restore Server** | Database backups, scheduled and manual, and restores. [Server Backup and Restore](./Backup-Restore.md) |
