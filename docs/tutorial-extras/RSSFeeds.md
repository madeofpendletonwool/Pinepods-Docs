# RSS Feed Integration

Pinepods provides comprehensive RSS feed integration that allows you to access your podcast subscriptions from any RSS-compatible podcast application. This feature enables cross-platform synchronization and gives you the flexibility to use your preferred podcast client while maintaining centralized subscription management.

## Overview

The RSS feed system in Pinepods generates a personalized RSS feed URL that contains all your podcast subscriptions aggregated into a single feed. This URL can be used in any podcast application that supports RSS feeds, enabling you to access your Pinepods library from multiple devices and applications.

### Key Features

- **Universal Access**: Subscribe to your entire Pinepods library from any RSS-compatible app
- **Single Podcast Feeds**: Generate RSS feeds for individual podcasts
- **Secure Access**: RSS URLs include special RSS Keys - These are different from user API keys and can be safely shared to other people
- **Real-time Synchronization**: Changes to your subscriptions are reflected in the RSS feed
- **Cross-platform Compatibility**: Works with all major podcast applications

## Accessing RSS Feed Settings

1. Navigate to **Settings** in the main menu
2. Expand the **RSS Feed Settings** section
3. Configure your RSS feed preferences

## Enabling RSS Feeds

### Step-by-Step Activation

1. **Navigate to Settings**: Open the RSS Feed Settings section
2. **Toggle Enable**: Click the **"Enable RSS Feeds"** toggle switch
3. **Wait for Generation**: The system will generate your personalized RSS feed URL
4. **Copy URL**: Once enabled, your RSS feed URL will be displayed

### RSS Feed URL Generation

When RSS feeds are enabled, Pinepods automatically:
- Generates a unique RSS key for your account
- Creates a personalized RSS feed URL
- Provides a copy button for easy URL sharing

The generated URL follows this format:
```
https://your-server.com/rss/[USER_ID]?api_key=[RSS_KEY]
```

## Using Your RSS Feed

### Adding to Podcast Applications

#### Universal Steps
1. **Copy Your URL**: Use the copy button in RSS Feed Settings to copy your personal RSS URL
2. **Open Podcast App**: Launch your preferred podcast application
3. **Add RSS Feed**: Look for "Add RSS Feed", "Subscribe by URL", or similar option
4. **Paste URL**: Enter your Pinepods RSS feed URL
5. **Subscribe**: Complete the subscription process in your podcast app

### Individual Podcast RSS Feeds

In addition to the aggregated feed, Pinepods also provides RSS feeds for individual podcasts:

1. **Navigate to Podcast**: Open any podcast in your library
2. **Find RSS Icon**: Look for the RSS icon on the podcast page
3. **Get Individual URL**: Click the RSS icon to get a direct RSS feed for that specific podcast
4. **Subscribe Separately**: Use this URL to subscribe to just that podcast in other apps

An interesting use case for this functionality could be to subscribe to a premium feed in an app that normally wouldn't support them.

## RSS Feed Content

### What's Included

Your RSS feed contains:
- **All Subscribed Podcasts**: Every podcast in your Pinepods library
- **Episode Information**: Title, description, publication date, duration
- **Audio URLs**: Direct links to episode audio files
- **Artwork**: Podcast and episode artwork when available
- **Metadata**: Categories, tags, and other podcast metadata

### Real-time Updates

The RSS content is generated as-requested immediately. Therefore:

The RSS feed automatically reflects:
- **New Subscriptions**: Podcasts added to your Pinepods library
- **Removed Subscriptions**: Podcasts unsubscribed from your library
- **New Episodes**: Latest episodes from your subscribed podcasts
- **Episode Updates**: Changes to episode information or availability
