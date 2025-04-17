# Pinepods GPodder API Sync Guide

## Introduction

Pinepods offers powerful podcast synchronization capabilities through the GPodder API, allowing you to keep your podcast subscriptions in sync across multiple devices and applications. This guide explains the different sync options available, how to set them up, and tips for getting the most out of podcast synchronization.

## Sync Options Overview

Pinepods offers three different methods for podcast synchronization:

1. **Internal GPodder API** (Recommended) - Uses Pinepods' built-in GPodder API server
2. **External GPodder-compatible Server** - Connects to an external GPodder API server
3. **Nextcloud Sync** - Connects to a Nextcloud instance with the GPodder integration

Each option has its own advantages and use cases, which are detailed below.

## Internal GPodder API (Recommended)

The internal GPodder API is the recommended option for most users. It provides a seamless experience without requiring any external services and allows you to sign into apps other than Pinepods to sync from directly using your Pinepods account and Pinepods url!

### Advantages

- No external dependencies or services needed
- Fast and reliable synchronization - The Gpodder API is built in Go for speed
- Fully integrated with Pinepods
- Compatible with any GPodder client (including AntennaPod, gPodder, and other apps)
- All features implemented from the Gpodder API spec
- Automatic device management

### Setting Up Internal GPodder API

1. Go to **Settings** > **Podcast Sync**
2. In the **Internal GPodder API** section, toggle the switch to **Enabled**
3. The synchronization is now active, and you'll see "Internal GPodder API enabled" as your current sync server

### Connecting Clients to Internal GPodder API

When setting up your podcast app to sync with Pinepods' internal GPodder API:

1. Use the following server URL: `https://[your-pinepods-server]`
2. Simply use your Pinepods username and password to sign in

### Advanced Options

Once you've enabled the internal GPodder API, you can access advanced options:

1. Click on the **Show Extra Options** button that appears below the sync section
2. Here you can:
   - View and manage all your connected devices
   - Create new devices
   - Set a default device for synchronization
   - Manually sync from or push to GPodder
   - See the sync status of each device

### Managing Devices

#### Creating a New Device

1. In the advanced options, find the **Add New Device** section
2. Enter a device name (required)
3. Select a device type (desktop, laptop, mobile, server, or other)
4. Optionally add a caption to identify the device more easily
5. Click **Add Device**

#### Setting a Default Device

1. Select a device from the dropdown menu
2. Click the **Set as default** button
3. The default device will be automatically selected for background sync operations

#### Syncing with a Device

1. Select a device from the dropdown menu
2. Click **Sync from GPodder** to pull changes from that device
3. Click **Push to GPodder** to push your current Pinepods subscriptions to that device

#### Syncing from a different device

So for example AntennaPods created a specific AntennaPods device and you want to use a different one in Pinepods. You can then sync **from** the Antennapods device **into** your Pinepods device. Follow these steps:

1. Ensure the device you want to sync **into** is your default
2. Change the devices dropdown to the device you want to sync **from**
3. Click the Sync button

Everything from your previous device will sync into the new one. 

## External GPodder-compatible Server

If you already have a GPodder server setup, you can connect Pinepods to it.

### Advantages

- Works with existing GPodder infrastructure
- Allows synchronization with other applications already using your GPodder server
- Good for integrating Pinepods into an existing podcast ecosystem

### Setting Up External GPodder Sync

1. Ensure the **Internal GPodder API** is disabled (toggle switch set to off)
2. In the **GPodder-compatible Server** section, enter:
   - Server URL (e.g., `https://mygpodder.example.com`)
   - Username 
   - Password
3. Click **Test Connection** to verify your credentials
4. Click **Authenticate** to complete the setup

All the Advanced Option documentation above applies here as well.

## Nextcloud Sync

For Nextcloud users, Pinepods supports synchronization through Nextcloud's GPodder integration. Note that there are some limitations with Nextcloud sync as it doesn't fully support all Gpodder APIs. Such as devices. I don't recommend Nextcloud sync but if you already have a Nextcloud server and just want to sync podcasts between devices it'll work.

### Advantages

- Integration with your existing Nextcloud environment
- Works well if you're already using Nextcloud for other services
- Simple authentication flow

### Setting Up Nextcloud Sync

1. Ensure the **Internal GPodder API** is disabled (toggle switch set to off)
2. In the **Nextcloud Sync** section, enter your Nextcloud server URL
3. Click **Authenticate**
4. A new browser tab will open to authenticate with your Nextcloud instance
5. Follow the prompts to authorize Pinepods
6. Return to Pinepods, which will display "Nextcloud server has been authenticated successfully" when complete

## Troubleshooting and Tips

### Compatibility Notes

Gpodder sync apps that I know work:

- Pinepods' Gpodder API
- Nextcloud Sync
- Podfetch
- oPodsync (There's some limitations in opodsync once the DB gets too big. Not recommended.)

### Reporting Issues

If you encounter problems with specific GPodder servers or clients:

1. Test with the internal GPodder API first to isolate the issue
2. Check if the issue persists with different clients
3. Open an issue on the [Pinepods GitHub repository](https://github.com/madeofpendletonwool/PinePods/issues) with:
   - The sync method you're using
   - The client application and version
   - Server details (if using external sync)
   - Steps to reproduce the issue
   - Error messages or logs if available

## Frequently Asked Questions

**Q: Which sync option should I choose?**  
A: For most users, the internal GPodder API is recommended for its simplicity and reliability. Use external options only if you have specific requirements or existing infrastructure.

**Q: Can I switch between sync methods?**  
A: Yes, but you'll need to disable the current method before enabling another. Your podcast subscriptions will remain intact as they will just sync into the new one.

**Q: How often does synchronization happen?**  
A: Pinepods syncs automatically every 15 mins, but you can also trigger manual syncs through the advanced options.

**Q: Will enabling sync affect my existing podcasts?**  
A: No, enabling sync will not modify your existing podcast subscriptions. It will only start tracking changes from that point forward.

**Q: Do I need to create a device manually?**  
A: For the internal GPodder API, Pinepods will create a default device automatically. You only need to create additional devices if you want to manage sync more granularly.

**Q: Can I use multiple sync methods simultaneously?**  
A: No, only one sync method can be active at a time.