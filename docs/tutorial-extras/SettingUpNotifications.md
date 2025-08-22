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
- **Authentication**: Supports both username/password and access token authentication
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

### Setting Up ntfy Mobile App

#### iOS Setup
1. Download the **ntfy** app from the App Store
2. Open the app and tap **"Subscribe to topic"**
3. Enter your topic name (same as configured in Pinepods)
4. If using authentication, tap the settings icon and enter your credentials
5. Tap **Subscribe** to start receiving notifications

#### Android Setup
1. Download the **ntfy** app from Google Play Store
2. Tap the **"+"** button to add a new subscription
3. Enter your topic name and server URL (if using custom server)
4. Configure authentication if required
5. Tap **Subscribe** to enable notifications

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

### Gotify Client Setup

#### Mobile Applications
- **Android**: Install Gotify app from F-Droid or GitHub releases
- **iOS**: Use compatible third-party clients (limited availability)

#### Desktop Notifications
- **Web Interface**: Access notifications through your Gotify server's web interface
- **Desktop Clients**: Use third-party Gotify desktop clients

## Testing Your Notification Setup

### Test Notification Feature
Once you've configured your notification settings:

1. **Save Settings**: Click **Save Settings** to apply your configuration
2. **Test Button**: A **Send Test Notification** button will appear
3. **Send Test**: Click the button to send a test notification
4. **Verify Receipt**: Check your device to confirm the test notification was received

### Troubleshooting Test Notifications

#### ntfy Test Issues
- **Topic Subscription**: Ensure your mobile app is subscribed to the correct topic
- **Server Accessibility**: Verify your ntfy server is reachable
- **Authentication**: Check username/password or access token validity
- **Network Connectivity**: Ensure both Pinepods server and your device have internet access

#### Gotify Test Issues
- **Token Validity**: Verify the application token is correct and active
- **Server Connectivity**: Ensure Pinepods can reach your Gotify server
- **Firewall Rules**: Check that necessary ports are open
- **SSL Certificates**: Verify SSL certificates are valid if using HTTPS

## Notification Types

### Episode Notifications
Pinepods can send notifications for:
- **New Episodes**: When new episodes are available for your subscribed podcasts
- **Download Completion**: When episodes finish downloading
- **Sync Updates**: When podcast feeds are refreshed

### System Notifications
- **Server Updates**: Important server maintenance or update notifications
- **Account Security**: Login alerts and security-related events
- **Error Alerts**: Critical system errors that require attention

## Security and Privacy

### ntfy Security
- **Topic Privacy**: Choose unique, non-guessable topic names
- **Authentication**: Use username/password or access tokens for sensitive notifications
- **Server Choice**: Consider self-hosting ntfy for maximum privacy
- **Message Encryption**: ntfy supports end-to-end encryption for sensitive content

### Gotify Security
- **Self-Hosted**: Complete control over notification data and storage
- **Token Security**: Keep application tokens secure and rotate them regularly
- **Network Security**: Use HTTPS and proper firewall configurations
- **Access Control**: Limit Gotify server access to authorized users only

### Best Practices
1. **Unique Topics**: Use unique, personal topic names for ntfy
2. **Secure Tokens**: Store Gotify tokens securely and rotate them periodically
3. **Regular Updates**: Keep notification apps and servers updated
4. **Monitor Access**: Regularly review notification delivery and access logs

## Troubleshooting Common Issues

### Notifications Not Received

#### Check Configuration
- **Platform Selection**: Verify correct notification platform is selected
- **Enable Status**: Ensure notifications are enabled in settings
- **Credentials**: Verify all authentication credentials are correct
- **Topic/Token**: Double-check topic names and application tokens

#### Network Issues
- **Server Connectivity**: Test if Pinepods server can reach notification services
- **Device Connectivity**: Ensure notification devices have internet access
- **Firewall Rules**: Check for blocking firewall rules or proxy issues
- **DNS Resolution**: Verify domain names resolve correctly

### Authentication Failures

#### ntfy Authentication
- **Credential Validity**: Verify username/password or access token is current
- **Account Status**: Ensure ntfy account is active and in good standing
- **Server Compatibility**: Check if authentication method is supported by your ntfy server
- **Mixed Methods**: Ensure you're not mixing username/password with access tokens

#### Gotify Authentication
- **Token Status**: Verify application token is active in Gotify server
- **Server Access**: Ensure Gotify server is accessible from Pinepods
- **Application Settings**: Check that the Gotify application has proper permissions
- **Server Version**: Verify Gotify server version compatibility

### Delivery Delays

#### Common Causes
- **Network Latency**: High latency between servers can cause delays
- **Rate Limiting**: Notification services may rate limit high-volume senders
- **Server Load**: High server load can delay notification processing
- **Client Issues**: Notification client apps may have delivery delays

#### Solutions
- **Network Optimization**: Improve network connectivity and routing
- **Batch Settings**: Adjust notification batching and frequency settings
- **Server Resources**: Increase server resources if experiencing high load
- **Client Updates**: Update notification client applications

## Advanced Configuration

### Custom ntfy Servers
For enhanced privacy and control:
1. **Self-Host ntfy**: Install ntfy on your own server
2. **Server Configuration**: Configure authentication, rate limits, and retention
3. **SSL Setup**: Implement proper SSL certificates for secure communication
4. **Monitoring**: Set up monitoring for your ntfy server availability

### Gotify Server Optimization
- **Performance Tuning**: Optimize Gotify server for your notification volume
- **Database Management**: Regular maintenance of notification history database
- **Backup Strategy**: Implement backup procedures for notification settings and history
- **High Availability**: Consider redundant Gotify server setup for critical environments

### Integration with Other Services
- **Webhook Integration**: Use notification webhooks for custom integrations
- **API Access**: Leverage notification platform APIs for advanced automation
- **Monitoring Integration**: Connect notifications with system monitoring tools
- **Custom Clients**: Develop custom notification clients for specific workflows

Push notifications enhance your Pinepods experience by keeping you informed about new content and system events, ensuring you never miss important podcast episodes or updates.