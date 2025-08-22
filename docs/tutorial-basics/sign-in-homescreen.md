# Sign into Pinepods

Pinepods provides a comprehensive sign-in experience that includes user authentication, customizable landing pages, and seamless integration with your preferred podcast listening workflow. The system supports multiple authentication methods and personalized start page preferences.

## Overview

The Pinepods sign-in system consists of several key components:
- **User Authentication**: Secure login with username and password
- **Multi-Factor Authentication**: Optional TOTP-based security enhancement
- **Password Reset**: Self-service password recovery via email
- **Start Page Configuration**: Customizable landing page after login
- **Session Management**: Persistent login sessions across devices

## Accessing the Login Page

### Login Interface
The Pinepods login page provides access to your podcast library and personal settings:

1. **Server Connection**: Navigate to your Pinepods server URL
2. **Login Form**: Enter your credentials in the provided fields
3. **Authentication Options**: Access additional security and recovery features
4. **Direct Access**: Bookmark the login page for quick access

### Login Page Components
- **Username Field**: Enter your Pinepods username
- **Password Field**: Enter your account password
- **Sign In Button**: Submit credentials for authentication
- **Forgot Password Link**: Access password recovery options
- **Create New User**: Self-registration option (if enabled by administrators)

## Standard Login Process

### Basic Authentication

#### Step 1: Enter Credentials
1. **Username**: Type your assigned or chosen username
2. **Password**: Enter your account password
3. **Verify Input**: Ensure credentials are entered correctly
4. **Submit**: Click the "Sign In" button to authenticate

#### Step 2: System Verification
1. **Credential Check**: Pinepods verifies your username and password
2. **Account Status**: System confirms your account is active
3. **Authentication Success**: Successful login proceeds to your start page
4. **Error Handling**: Invalid credentials display appropriate error messages

#### Step 3: Post-Login Actions
1. **Session Creation**: Pinepods establishes your user session
2. **Preferences Loading**: System loads your personal settings and preferences
3. **Start Page Navigation**: Automatic redirect to your configured start page
4. **Data Synchronization**: Recent activity and subscriptions are updated

## Multi-Factor Authentication (MFA)

### MFA-Enhanced Login Process
If you've enabled MFA on your account, the login process includes an additional security step:

#### Standard Login First
1. **Username and Password**: Complete the normal credential entry
2. **Initial Verification**: Pinepods validates your basic credentials
3. **MFA Prompt**: System requests your authenticator code

#### MFA Code Entry
1. **Authenticator App**: Open your TOTP authenticator app (Google Authenticator, Authy, etc.)
2. **Locate Code**: Find the 6-digit code for your Pinepods account
3. **Enter Code**: Input the current code in the MFA prompt
4. **Time Sensitivity**: Codes expire every 30 seconds, so enter promptly
5. **Complete Login**: Successful MFA verification completes the login process

### MFA Troubleshooting
- **Expired Codes**: Wait for a new code if the current one has expired
- **Time Sync**: Ensure your device's clock is accurate for proper code generation
- **Code Accuracy**: Double-check that you're entering the code correctly
- **App Issues**: Verify you're using the code from the correct account in your authenticator

## Password Recovery

### Forgot Password Process
If you've forgotten your password, Pinepods provides a self-service recovery option:

#### Initiating Password Reset
1. **Forgot Password Link**: Click "Forgot Password?" on the login page
2. **Account Information**: Enter your username and associated email address
3. **Reset Request**: Submit the password reset request
4. **Email Verification**: Check your email for the reset code

#### Completing Password Reset
1. **Email Code**: Locate the password reset code in your email
2. **Return to Interface**: The reset modal will appear after submitting the request
3. **New Password**: Enter your desired new password
4. **Reset Code**: Input the code from your email
5. **Submit Changes**: Complete the password reset process
6. **Login**: Use your new password to log into Pinepods

### Password Reset Requirements
- **Valid Email**: Your account must have a valid email address configured
- **Email Configuration**: Administrators must have configured email settings on the server
- **Code Expiration**: Reset codes expire after a certain time for security
- **Single Use**: Each reset code can only be used once

## User Self-Registration

### Self-Service Account Creation
If enabled by administrators, new users can create their own accounts:

#### Account Creation Process
1. **Create New User**: Click the "Create New User" button (if visible)
2. **User Information**: Provide required account details:
   - **Username**: Choose a unique username for your account
   - **Password**: Create a secure password
   - **Email Address**: Provide a valid email for account recovery
   - **Full Name**: Enter your display name
3. **Account Validation**: System verifies the provided information
4. **Account Creation**: Successful validation creates your new account
5. **Automatic Login**: You're automatically logged in after account creation

#### Self-Registration Requirements
- **Administrator Permission**: Feature must be enabled by server administrators
- **Unique Username**: Chosen username must not already exist
- **Valid Email**: Email address must be properly formatted and accessible
- **Password Security**: Password must meet any configured security requirements

## Start Page Configuration

### Customizing Your Landing Page
Pinepods allows you to configure which page you see immediately after logging in:

#### Available Start Page Options
- **Home**: Dashboard view with recent activity and quick access features
- **Feed**: Your personalized episode feed with latest content
- **Podcasts**: Library view of all your subscribed podcasts
- **Queue**: Your listening queue with planned episodes
- **Saved**: Collection of bookmarked episodes
- **Downloads**: Episodes downloaded to the server

#### Setting Your Start Page
1. **Navigate to Settings**: Access your user settings after logging in
2. **Start Page Options**: Find the start page configuration section
3. **Select Preference**: Choose your preferred landing page
4. **Save Settings**: Apply your start page preference
5. **Next Login**: Your choice takes effect on subsequent logins

### Start Page Benefits
- **Workflow Optimization**: Start with the page most relevant to your listening habits
- **Quick Access**: Immediate access to your most-used features
- **Personalization**: Customize Pinepods to match your podcast consumption patterns
- **Efficiency**: Reduce clicks and navigation to reach your primary content

## Session Management

### Login Session Features
- **Persistent Sessions**: Stay logged in across browser sessions
- **Multiple Devices**: Use the same account on different devices simultaneously
- **Session Security**: Automatic logout after extended inactivity (if configured)
- **Cross-Platform**: Sessions work across web, mobile, and desktop clients

### Security Considerations
- **Shared Devices**: Always log out when using public or shared computers
- **Session Monitoring**: Administrators may monitor login sessions for security
- **Device Management**: Keep track of which devices have access to your account
- **Regular Password Updates**: Periodically update your password for security

## Troubleshooting Login Issues

### Common Login Problems

#### Invalid Credentials
- **Username Verification**: Confirm your username is spelled correctly
- **Password Check**: Verify your password, including capitalization
- **Account Status**: Ensure your account hasn't been disabled
- **Contact Administrator**: Reach out for help if credentials are definitely correct

#### Account Lockout
- **Multiple Failed Attempts**: Too many incorrect login attempts may lock your account
- **Wait Period**: Some systems implement temporary lockouts for security
- **Administrator Assistance**: Contact your Pinepods administrator for account unlocking
- **Password Reset**: Try the password reset process if you're unsure of your credentials

#### Email Issues (Password Reset)
- **Email Configuration**: Verify your account has the correct email address
- **Spam Folder**: Check spam/junk folders for password reset emails
- **Email Delivery**: Allow time for email delivery
- **Administrator Help**: Contact administrators if email issues persist

#### MFA Problems
- **Clock Synchronization**: Ensure your device's time is accurate
- **Code Generation**: Verify your authenticator app is generating codes
- **Setup Verification**: Confirm MFA was set up correctly
- **Recovery Options**: Contact administrators if locked out due to MFA issues

### Browser and Technical Issues

#### Browser Compatibility
- **Supported Browsers**: Use current versions of major browsers (Chrome, Firefox, Safari, Edge)
- **JavaScript**: Ensure JavaScript is enabled in your browser
- **Cookies**: Enable cookies for the Pinepods domain
- **Cache Issues**: Clear browser cache if experiencing persistent problems

#### Network Connectivity
- **Server Access**: Verify you can reach the Pinepods server
- **Firewall Issues**: Check for corporate or network firewalls blocking access
- **VPN Considerations**: Some VPNs may affect connectivity
- **SSL/HTTPS**: Ensure proper SSL certificate configuration

## Best Practices

### Account Security
1. **Strong Passwords**: Use complex, unique passwords for your Pinepods account
2. **Enable MFA**: Add multi-factor authentication for enhanced security
3. **Regular Updates**: Periodically update your password
4. **Secure Access**: Only log in from trusted devices and networks
5. **Logout Practice**: Always log out from shared or public computers

### Efficient Usage
1. **Start Page Optimization**: Configure your start page for optimal workflow
2. **Browser Bookmarks**: Bookmark your Pinepods server for quick access
3. **Credential Management**: Use a password manager for secure credential storage
4. **Regular Access**: Log in regularly to stay current with new episodes and updates
5. **Mobile Integration**: Use the mobile app for on-the-go access

### Troubleshooting Preparation
1. **Contact Information**: Know how to reach your Pinepods administrator
2. **Email Access**: Ensure you have access to your account's email address
3. **MFA Backup**: Keep backup authenticator methods or recovery codes
4. **Documentation**: Familiarize yourself with your organization's Pinepods policies
5. **Alternative Access**: Know if alternative access methods are available

The Pinepods sign-in system is designed to provide secure, efficient access to your podcast library while offering the flexibility to customize your login experience and landing page preferences to match your listening workflow.