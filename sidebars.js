/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Tutorial - Basics',
      items: [
        'tutorial-basics/clients',
        'tutorial-basics/sign-in-homescreen',
        'tutorial-basics/browsing-podcasts',
        'tutorial-basics/searching-and-adding',
        'tutorial-basics/settings',
        'tutorial-basics/adding-an-api-key',
        'tutorial-basics/Theming',
        'tutorial-basics/PlaybackSettings',
        'tutorial-basics/UserSelfService',
        'tutorial-basics/AdjustingUserSettings',
        'tutorial-basics/CustomFeeds',
        'tutorial-basics/Importing-Exporting',
        'tutorial-basics/Backup-Restore',
        'tutorial-basics/ChangingLoginPage',
        'tutorial-basics/SettingUpMFA',
      ],
    },
    {
      type: 'category',
      label: 'Extras',
      items: [
        'tutorial-extras/gpodder-sync',
        'tutorial-extras/RSSFeeds',
        'tutorial-extras/SettingUpNotifications',
        'tutorial-extras/PasswordResets',
        'tutorial-extras/OIDC-setup',
        'tutorial-extras/podpeopledb',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'Features/smart-playlists',
        'Features/Queue',
        'Features/Downloads',
        'Features/AutoDownload',
        'Features/SerialPodcasts',
        'Features/Video',
        'Features/LocalPodcasts',
        'Features/Favorites',
        'Features/SharedLinks',
        'Features/Statistics',
        'Features/CustomThemes',
        'Features/gpodder-sync',
        'Features/Search',
        'Features/Chapters',
        'Features/Transcript',
        'Features/Person',
        'Features/Funding',
      ],
    },
    {
      type: 'category',
      label: 'AI Features',
      items: [
        'AI/Overview',
        'AI/Setup',
        'AI/Transcription',
        'AI/AdDetection',
      ],
    },
    {
      type: 'category',
      label: 'Mobile',
      items: [
        'Mobile/SettingUpMobileApp',
        'Mobile/CarPlay',
        'Mobile/AndroidAuto',
        'Mobile/OfflineQueue',
      ],
    },
    {
      type: 'category',
      label: 'Firewood',
      items: [
        'Firewood (CLI)/UsingPinepodsFirewood',
      ],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        'API/api_intro',
        { type: 'link', label: 'API Reference (interactive)', href: '/docs/API/reference/' },
        'API/database_queries',
        'API/search_api',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        'Troubleshooting/CollationVersionMismatchFix',
        'Troubleshooting/PostgresMajorUpgrade',
      ],
    },
    {
      type: 'category',
      label: 'Developing',
      items: [
        'Developing/Developing',
        'Developing/Container-Fundamentals',
        'Developing/Versioning',
      ],
    },
  ],
};
