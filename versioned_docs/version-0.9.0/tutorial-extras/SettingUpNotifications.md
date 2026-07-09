# Setting Up Notifications

Pinepods provides comprehensive push notification support to keep you informed about new podcast episodes, system updates, and other important events. The notification system supports multiple platforms and authentication methods to fit your preferred notification workflow.

## Overview

Pinepods supports push notifications through two popular notification platforms:
- **ntfy**: A simple, lightweight notification service (default)
- **Gotify**: A self-hosted notification server for privacy-focused users

Both platforms allow you to receive real-time notifications on your mobile devices, desktop computers, and other connected devices.

## Supported Notification Platforms

### ntfy (Recommended)
- **Public Service**: Uses the free ntfy.sh service by default
- **Self-Hosted Option**: Supports custom ntfy server installations
- **Multi-Device**: Send notifications to multiple devices using the same topic
- **Authentication**: Supports both username/password and access token authentication (Optional)
- **Cross-Platform**: Available on iOS, Android, and desktop

### Gotify
- **Self-Hosted**: Requires your own Gotify server installation
- **Privacy Focused**: Complete control over your notification data
- **Token-Based**: Uses application tokens for secure authentication
- **Web Interface**: Manage notifications through Gotify's web interface

## Accessing Notification Settings

1. Navigate to **Settings** in the main menu
2. Expand the **Notification Settings** section
3. Configure your preferred notification platform and credentials

## Setting Up ntfy Notifications

### Basic ntfy Setup

#### Step 1: Choose Platform
1. In Notification Settings, ensure **ntfy** is selected as the platform
2. Check the **Enable Notifications** checkbox to activate notifications

#### Step 2: Configure ntfy Topic
1. **Topic Name**: Enter a unique topic name for your notifications
   - Use something personal and unique (e.g., `pinepods-johnsmith-2024`)
   - Avoid common words to prevent receiving other users' notifications
   - Topic names are case-sensitive and can include letters, numbers, and hyphens

#### Step 3: Set Server URL
1. **Default Server**: Leave as `https://ntfy.sh` to use the free public service
2. **Custom Server**: Enter your self-hosted ntfy server URL if you have one
3. Ensure the URL includes the protocol (`https://` or `http://`)

### ntfy Authentication (Optional)

ntfy supports two authentication methods - choose one:

#### Option 1: Username and Password
1. Enter your **ntfy username** in the Username field
2. Enter your **ntfy password** in the Password field
3. Leave the Access Token field empty

#### Option 2: Access Token
1. Leave Username and Password fields empty
2. Enter your **ntfy access token** in the Access Token field
3. Access tokens can be generated in your ntfy account settings

**Note**: You can only use one authentication method at a time. The interface will automatically disable the other method when you start entering credentials.

## Setting Up Gotify Notifications

### Prerequisites
- A running Gotify server installation
- Administrative access to create application tokens

### Gotify Setup Process

#### Step 1: Choose Platform
1. In Notification Settings, select **Gotify** as the platform
2. Check the **Enable Notifications** checkbox

#### Step 2: Configure Server
1. **Gotify Server URL**: Enter your Gotify server's complete URL
   - Include the protocol: `https://your-gotify-server.com`
   - Include the port if non-standard: `https://gotify.example.com:8080`

#### Step 3: Application Token
1. **Create Token**: Log into your Gotify server's web interface
2. **Navigate to Apps**: Go to the Applications section
3. **Create Application**: Create a new application for Pinepods
4. **Copy Token**: Copy the generated application token
5. **Enter Token**: Paste the token into the Gotify App Token field in Pinepods

## Testing Your Notification Setup

### Test Notification Feature
Once you've configured your notification settings:

1. **Save Settings**: Click **Save Settings** to apply your configuration
2. **Test Button**: A **Send Test Notification** button will appear
3. **Send Test**: Click the button to send a test notification
4. **Verify Receipt**: Check your device to confirm the test notification was received

## Notification Types

### Episode Notifications
Pinepods can send notifications for:
- **New Episodes**: When new episodes are available for your subscribed podcasts
(More notification options coming in the future)
