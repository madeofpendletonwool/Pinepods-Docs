# PinePods Podcast Synchronization Guide

## Introduction

PinePods 0.7.8 introduced a completely rebuilt podcast synchronization system, offering multiple ways to keep your podcast subscriptions and listening progress in sync across different devices and applications. This guide explains the available synchronization options, with a particular focus on the built-in GPodder API server.

## Synchronization Options Overview

PinePods now offers three primary synchronization methods:

1. **Internal GPodder API** (Recommended) - A full-featured built-in GPodder-compatible sync server
2. **External GPodder Server** - Connect to an existing third-party GPodder server
3. **Nextcloud Sync** - Connect to a Nextcloud instance with the GPodder plugin

These options can be configured in the **Podcast Sync Settings** section of your PinePods installation.

## Internal GPodder API (Recommended)

### What is the Internal GPodder API?

The Internal GPodder API is a feature introduced in PinePods 0.7.8 that embeds a full-featured GPodder-compatible synchronization server directly into PinePods itself. This means PinePods can now act as its own podcast synchronization server without requiring any additional external services.

### Key Benefits

- **Single Server Maintenance** - No need to set up and maintain a separate GPodder server
- **High Performance** - Built in Golang for exceptional speed and reliability
- **Simplified Authentication** - Uses your existing PinePods credentials
- **Advanced Device Management** - Full support for managing multiple devices
- **Manual Synchronization Options** - Control exactly when and how your podcasts sync
- **Scalability** - Designed to handle thousands of podcasts efficiently
- **Direct Database Integration** - Uses the same database as your PinePods installation

### Setting Up Internal GPodder Sync

1. Navigate to **Settings → Podcast Sync Settings**
2. In the "Internal Gpodder API" section, toggle the switch to "Enabled"
3. Your internal GPodder server is now active and ready to use. Seriously, it's that easy.

### Connecting External Apps to Internal GPodder

When connecting apps like AntennaPod (Android) to your PinePods server:

- **Server URL**: Use your PinePods server address (e.g., `https://my-pinepods-server.com`)
- **Username**: Your PinePods username
- **Password**: Your PinePods password

## Device Management

With the new GPodder sync system, you can manage multiple devices through an intuitive interface:

- **Add New Devices** - Register smartphones, tablets, desktops, or other instances (Generally apps register their own device as they connect the first time.)
- **Set Default Device** - Designate a primary device for automatic synchronization
- **Manual Sync Controls** - Push or pull podcast subscriptions as needed manually. This also occurs automatically in the background.

**Note** that which ever devices is selected in the dropdown is the one you will sync from. For example, if you have device-1 selected in the dropdown and device-2 if your default device in Pinepods, you'll sync podcasts associated with device-1 to device-2.

### Advanced Device Features

- **Device Types** - Categorize your devices (mobile, desktop, laptop, server, etc.)
- **Device Captions** - Add descriptive names to help identify your devices
- **Last Sync Tracking** - Monitor when each device last connected
- **Default Device Indicators** - Easily identify your primary device

## External GPodder Server

If you already have an existing GPodder server that you wish to continue using, PinePods supports connecting to it as a client.

### Configuration Steps

1. Navigate to **Settings → Podcast Sync Settings**
2. Ensure the "Internal Gpodder API" is disabled
3. In the "GPodder-compatible Server" section, enter:
   - Server URL
   - Username
   - Password
4. Click "Test Connection" to verify your settings
5. Click "Authenticate" to establish the connection

### Notes on External GPodder Sync

While fully supported, external GPodder synchronization requires maintaining a separate server and potentially dealing with additional configuration complexity. For most users, the internal GPodder API will provide a simpler and more integrated experience.

## Nextcloud Sync

PinePods supports synchronization with Nextcloud instances that have the GPodder plugin installed.

### Configuration Steps

1. Navigate to **Settings → Podcast Sync Settings**
2. Ensure the "Internal Gpodder API" is disabled
3. In the "Nextcloud Sync" section, enter your Nextcloud server URL
4. Click "Authenticate" and follow the authentication flow in the new browser tab

### Limitations of Nextcloud Sync

Nextcloud sync provides basic podcast subscription synchronization but lacks some advanced features:

- Limited device management capabilities
- Fewer configuration options
- Potentially slower synchronization
- May take up to 20 minutes to fully synchronize all podcasts

This option is primarily useful for users who are already heavily integrated with Nextcloud and prefer to keep everything within that ecosystem.

## Choosing the Right Sync Option

### Why Choose Internal GPodder API (Recommended)

- **Simplicity**: One server to maintain instead of two
- **Performance**: Golang-based implementation offers superior speed
- **Integration**: Direct access to PinePods database for efficiency
- **Features**: Full device management and manual sync controls
- **Authentication**: Uses existing PinePods credentials
- **Reliability**: Some of the other podcast sync servers aren't particularly reliable

### When to Consider External GPodder

- You already have a well-established GPodder server
- Your current setup includes multiple applications relying on your existing server
- You have specific customizations to your GPodder server that PinePods doesn't replicate

### When to Consider Nextcloud Sync

- You're deeply invested in the Nextcloud ecosystem
- You primarily use Nextcloud's podcast features already
- You prefer centralized management through Nextcloud

### If you notice issues

- Check the PinePods logs for any error messages
- Ensure your PinePods installation is updated to the latest version
- Verify that any external GPodder server or Nextcloud instance is accessible
- Open an issue on the Pinepods Repo. Please include which option you're using, and if using an external option please provide which one. Not all gpodder sync servers are the same.

## FAQ

**Q: Will my existing podcast subscriptions be deleted when enabling podcast sync?**
A: Almost certainly no. There could be a situation where if you have a well established Gpodder Sync server elsewhere it could remove some. I would recommend backing up your podcasts via opml before enabling a Gpodder server.

**Q: Will my existing podcast subscriptions transfer automatically?**
A: Yes, when you enable synchronization, your current PinePods subscriptions will be available to sync to other devices. This includes episode listen times.

**Q: How often does synchronization occur?**
A: Every 15 mins.

**Q: My podcasts don't seem to be syncing over. What should I do?**
A: Sometimes it can take awhile when it's onboarding a lot of podcasts. There can be a lot of data to parse.

**Q: Can I use multiple sync methods simultaneously?**
A: No, you should choose one synchronization method. Enabling the internal GPodder API will disable external sync options.

**Q: What information is synchronized?**
A: Typically, podcast subscriptions and episode play states are synchronized. Exact details may vary by client application as some support more features than others.

**Q: Is my listening data secure?**
A: Yes, as long as your Pinepods server is behind an https connection transmission of the data to any app is secure. Especially with the internal GPodder API which uses your existing PinePods authentication system and doesn't require exposing credentials to third-party services.
