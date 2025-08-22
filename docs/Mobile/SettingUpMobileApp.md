# Setting Up the Pinepods Mobile App

The Pinepods mobile app provides full access to your podcast library on iOS and Android devices, offering seamless synchronization with your Pinepods server and optimized mobile listening experience. This guide covers app installation, server connection, and mobile-specific features.

## Overview

The Pinepods mobile app is a Flutter-based application that connects to your Pinepods server, providing:
- **Full Library Access**: Complete access to your podcast subscriptions and episodes
- **Cross-Platform Sync**: Seamless synchronization with web and desktop clients
- **Offline Playback**: Download episodes for offline listening
- **Mobile Optimization**: Touch-friendly interface designed for mobile devices
- **Background Playback**: Continue listening while using other apps

## App Installation

### iOS Installation

#### App Store Download
1. **Open App Store**: Launch the App Store on your iOS device
2. **Search for Pinepods**: Use the search function to find "Pinepods"
3. **Select Official App**: Choose the official Pinepods application
4. **Install**: Tap "Get" or "Install" to download the app
5. **Wait for Installation**: Allow the app to download and install completely

#### System Requirements
- **iOS Version**: iOS 12.0 or later
- **Device Compatibility**: iPhone, iPad, and iPod touch
- **Storage Space**: Minimum 100MB free space for app installation
- **Network Connection**: Internet access for initial setup and synchronization

### Android Installation

#### Google Play Store Download
1. **Open Play Store**: Launch Google Play Store on your Android device
2. **Search Application**: Search for "Pinepods" in the store
3. **Official App**: Select the official Pinepods application
4. **Install**: Tap "Install" to begin the download process
5. **Complete Installation**: Wait for the app to finish installing

#### System Requirements
- **Android Version**: Android 6.0 (API level 23) or higher
- **Storage Space**: Minimum 100MB available storage
- **RAM**: At least 2GB RAM recommended for optimal performance
- **Network Access**: Internet connectivity for server communication

### Alternative Installation Methods

#### Direct APK (Android)
For Android users who prefer direct installation:
1. **Download APK**: Obtain the official APK from the Pinepods website or GitHub releases
2. **Enable Unknown Sources**: Allow installation from unknown sources in Android settings
3. **Install APK**: Use a file manager to install the downloaded APK file
4. **Security**: Only download APK files from official Pinepods sources

## Initial App Configuration

### First Launch Setup

#### App Permissions
Upon first launch, Pinepods may request several permissions:
- **Network Access**: Required for connecting to your Pinepods server
- **Storage Access**: Needed for downloading and caching episodes
- **Notification Access**: For new episode alerts and playback notifications
- **Background App Refresh**: Enables background synchronization (iOS)
- **Battery Optimization**: Exclude from battery optimization for consistent playback (Android)

#### Permission Configuration
1. **Review Requests**: Carefully review each permission request
2. **Grant Access**: Allow necessary permissions for full functionality
3. **Later Configuration**: Most permissions can be adjusted later in device settings
4. **Essential Permissions**: Network and storage access are required for basic functionality

### Server Connection Setup

#### Connection Information Required
Before connecting, gather the following information:
- **Server URL**: Complete URL of your Pinepods server (e.g., `https://pinepods.example.com`)
- **Username**: Your Pinepods account username
- **Password**: Your account password
- **Protocol**: Ensure you use the correct protocol (HTTP or HTTPS)

#### Step-by-Step Connection Process

##### Step 1: Enter Server Details
1. **Launch App**: Open the Pinepods mobile app
2. **Server URL Field**: Enter your complete Pinepods server URL
3. **Protocol Verification**: Ensure the URL includes `http://` or `https://`
4. **Port Numbers**: Include port numbers if your server uses non-standard ports

##### Step 2: Authenticate
1. **Username Entry**: Enter your Pinepods username
2. **Password Entry**: Input your account password
3. **Credential Verification**: Double-check your login information
4. **Connection Test**: The app will test the connection to your server

##### Step 3: Connection Verification
1. **Server Response**: App verifies it can communicate with your server
2. **Authentication Check**: Credentials are validated against your Pinepods account
3. **Success Confirmation**: Successful connection displays confirmation message
4. **Error Handling**: Connection errors provide specific troubleshooting information

## Mobile-Specific Features

### Optimized Mobile Interface

#### Touch-Friendly Design
- **Large Touch Targets**: Buttons and controls sized for easy finger navigation
- **Gesture Support**: Swipe gestures for common actions like play/pause and skip
- **Responsive Layout**: Interface adapts to different screen sizes and orientations
- **Accessibility**: VoiceOver (iOS) and TalkBack (Android) support for accessibility

#### Mobile Navigation
- **Bottom Navigation**: Primary navigation tabs at the bottom for easy thumb access
- **Pull-to-Refresh**: Swipe down to refresh episode feeds and synchronize data
- **Search Integration**: Quick search accessible from main navigation
- **Context Menus**: Long-press actions for episode and podcast management

### Offline Functionality

#### Episode Downloads
1. **Download Options**: Download episodes for offline listening
2. **Quality Settings**: Choose audio quality to balance file size and sound quality
3. **Storage Management**: Monitor and manage downloaded episode storage usage
4. **Auto-Download**: Configure automatic downloads for new episodes (optional)

#### Offline Playback
- **No Network Required**: Play downloaded episodes without internet connection
- **Progress Sync**: Listening progress syncs when connection is restored
- **Queue Management**: Manage playback queue even when offline
- **Background Play**: Continue listening with screen off or while using other apps

### Background Playback

#### Continuous Listening
- **Lock Screen Controls**: Control playback from device lock screen
- **Notification Controls**: Play/pause and skip controls in notification bar
- **App Switching**: Continue listening while switching between apps
- **Phone Calls**: Automatic pause/resume during phone calls

#### Power Management
- **Battery Optimization**: Efficient playback to preserve battery life
- **Sleep Timer**: Automatic playback stopping after specified time
- **Wake Lock**: Prevent device sleep during active playback
- **Background Refresh**: Smart synchronization to balance features and battery usage

## Synchronization and Data Management

### Cross-Device Synchronization

#### Automatic Sync Features
- **Listening Progress**: Episode playback position syncs across all devices
- **Queue Management**: Playback queue synchronizes between web and mobile
- **Subscription Updates**: New podcast subscriptions appear on all connected devices
- **Episode States**: Completed, saved, and queued episode states sync automatically

#### Manual Sync Options
- **Pull-to-Refresh**: Manually trigger synchronization by pulling down on episode lists
- **Settings Sync**: Force sync through app settings if automatic sync fails
- **Logout/Login**: Complete re-synchronization by logging out and back in
- **Network Reset**: Reset network connections if sync issues persist

### Storage Management

#### Local Storage Options
- **Download Location**: Episodes stored in app-specific storage area
- **Storage Limits**: Set maximum storage usage for downloaded episodes
- **Auto-Cleanup**: Automatic removal of old downloaded episodes
- **Manual Management**: View and delete individual downloaded episodes

#### Cache Management
- **Image Caching**: Podcast artwork cached for faster loading
- **Episode Metadata**: Episode information cached for offline browsing
- **Cache Clearing**: Options to clear cached data to free up space
- **Smart Caching**: Intelligent caching based on usage patterns

## Troubleshooting Mobile App Issues

### Connection Problems

#### Server Connection Failures
- **URL Verification**: Double-check server URL formatting and spelling
- **Network Connectivity**: Ensure device has active internet connection
- **Firewall Issues**: Verify corporate or public WiFi doesn't block access
- **Server Status**: Confirm your Pinepods server is online and accessible

#### Authentication Issues
- **Credential Accuracy**: Verify username and password are correct
- **Account Status**: Ensure your account is active and not disabled
- **Case Sensitivity**: Check for proper capitalization in username and password
- **MFA Considerations**: Account for multi-factor authentication if enabled

### Performance Issues

#### Slow App Performance
- **Device Resources**: Close other apps to free up RAM and processing power
- **Storage Space**: Ensure sufficient device storage is available
- **Network Speed**: Verify internet connection speed for streaming and sync
- **App Restart**: Force close and restart the app to clear temporary issues

#### Playback Problems
- **Audio Quality**: Adjust streaming quality if experiencing buffering
- **Network Stability**: Use WiFi instead of cellular for better stability
- **Downloaded Episodes**: Download episodes for reliable offline playback
- **Background Apps**: Limit other audio apps that might conflict with playback

### Sync and Data Issues

#### Sync Failures
- **Manual Refresh**: Try manual sync through pull-to-refresh or settings
- **Network Reset**: Reset network settings or switch between WiFi and cellular
- **Server Connectivity**: Verify the mobile app can reach your Pinepods server
- **Account Verification**: Ensure your account credentials haven't changed

#### Missing Data
- **Sync Timing**: Allow time for initial synchronization to complete
- **Selective Sync**: Check if any sync filters or limitations are configured
- **Server Issues**: Verify your Pinepods server is functioning correctly
- **Fresh Login**: Log out and log back in to force complete data refresh

## Advanced Mobile Configuration

### Notification Settings

#### Episode Notifications
- **New Episodes**: Receive notifications when new episodes are available
- **Download Complete**: Alerts when episode downloads finish
- **Sync Updates**: Notifications for successful synchronization
- **Custom Frequency**: Configure notification frequency and timing

#### System Integration
- **Lock Screen**: Control playback from device lock screen
- **Control Center**: Access playback controls from system control center
- **Siri Integration**: Voice control for playback on supported devices
- **CarPlay/Android Auto**: Integration with vehicle entertainment systems

### Privacy and Security

#### Data Protection
- **Local Encryption**: Downloaded episodes and cached data are stored securely
- **Credential Storage**: Login credentials stored using device keychain/keystore
- **Network Security**: All server communication uses secure protocols
- **Privacy Settings**: Control what data is shared and synchronized

#### Account Security
- **Session Management**: Secure session handling for persistent login
- **Logout Security**: Complete data clearing when logging out
- **Device Management**: Track which devices are connected to your account
- **Security Updates**: Keep the app updated for latest security features

## Best Practices for Mobile Usage

### Optimal Configuration
1. **Download Strategy**: Download frequently-listened podcasts for offline access
2. **Quality Settings**: Balance audio quality with storage space and data usage
3. **Sync Frequency**: Configure synchronization to match your usage patterns
4. **Battery Management**: Optimize settings for your device's battery life
5. **Storage Monitoring**: Regularly review and manage downloaded episode storage

### Efficient Usage
1. **WiFi Downloads**: Use WiFi for downloading episodes to save cellular data
2. **Queue Management**: Maintain a manageable playback queue for smooth operation
3. **Regular Updates**: Keep the app updated for latest features and bug fixes
4. **Backup Strategy**: Understand that mobile app data syncs with your server
5. **Network Awareness**: Be mindful of data usage when streaming over cellular

### Troubleshooting Preparation
1. **Server Information**: Keep your server connection details easily accessible
2. **Account Recovery**: Ensure you have password recovery options configured
3. **Support Resources**: Know how to contact your Pinepods administrator
4. **Alternative Access**: Maintain access to the web interface as backup
5. **Update Management**: Stay current with both app and device system updates

The Pinepods mobile app provides a comprehensive, portable podcasting experience that maintains full feature parity with the web interface while offering mobile-specific optimizations for on-the-go listening and offline access.