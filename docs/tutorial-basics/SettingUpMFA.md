# Multi-Factor Authentication (MFA) Setup

Pinepods provides robust Multi-Factor Authentication using Time-based One-Time Passwords (TOTP) to add an extra layer of security to user accounts. This feature works with popular authenticator apps and significantly enhances account protection.

## Overview

MFA in Pinepods uses the TOTP standard (RFC 6238) with the following specifications:
- **Algorithm**: SHA1
- **Digits**: 6-digit codes
- **Time Window**: 30-second intervals
- **Standard**: Compatible with Google Authenticator, Authy, and other TOTP apps

## Accessing MFA Settings

1. Navigate to **Settings** in the main menu
2. Expand the **MFA Settings** or **Multi-Factor Authentication** section
3. All users can enable MFA for their own accounts

## Setting Up MFA

### Prerequisites

Before setting up MFA, ensure you have:
- **Authenticator App**: Google Authenticator, Authy, Microsoft Authenticator, or similar
- **Device Access**: The device where your authenticator app is installed
- **Account Access**: Ability to log into your Pinepods account

### Step-by-Step MFA Setup

#### Step 1: Initiate MFA Setup
1. In the MFA Settings section, look for the setup button
2. Click **Enable MFA** or **Set Up MFA** (button text varies based on current status)
3. The system will generate a unique secret key for your account

#### Step 2: Scan QR Code
1. A QR code will appear on your screen
2. Open your authenticator app on your mobile device
3. Use the app's "Add Account" or "Scan QR Code" feature
4. Point your device's camera at the QR code displayed in Pinepods
5. The authenticator app will automatically add your Pinepods account

#### Step 3: Verify Setup
1. After scanning, your authenticator app will begin generating 6-digit codes
2. Enter the current 6-digit code from your authenticator app into Pinepods
3. Click **Verify** or **Confirm** to complete the setup
4. If verification succeeds, MFA is now enabled for your account

### Manual Setup Alternative

If you cannot scan the QR code:
1. Look for the **Manual Entry** option or text-based secret
2. In your authenticator app, choose "Enter Key Manually"
3. Add the following information:
   - **Account**: Your Pinepods username or "Pinepods"
   - **Secret Key**: Copy the displayed secret key exactly
   - **Time-based**: Ensure this option is selected (30-second intervals)

## Using MFA After Setup

### Login Process with MFA Enabled

Once MFA is enabled, your login process changes:

1. **Standard Login**: Enter your username and password as usual
2. **MFA Prompt**: After successful password verification, you'll see an MFA code request
3. **Authenticator Code**: Open your authenticator app and find the 6-digit code for Pinepods
4. **Code Entry**: Enter the current code (codes expire every 30 seconds)
5. **Complete Login**: Click submit to complete the authentication process

### MFA Code Timing

- **30-Second Window**: Each code is valid for 30 seconds
- **Auto-Refresh**: Codes automatically change every 30 seconds
- **Timing Indicator**: Most authenticator apps show remaining time for each code
- **Clock Sync**: Ensure your device's clock is accurate for proper code generation

## Recommended Authenticator Apps

### Mobile Apps
- **Google Authenticator** (iOS/Android): Simple, reliable, widely supported
- **Authy** (iOS/Android): Cloud backup, multi-device sync
- **Microsoft Authenticator** (iOS/Android): Integrates with Microsoft accounts
- **1Password** (iOS/Android): Combined with password management
- **Bitwarden Authenticator** (iOS/Android): Open-source with backup features

### Desktop Options
- **Authy Desktop** (Windows/Mac/Linux): Desktop version with cloud sync
- **WinAuth** (Windows): Standalone desktop authenticator
- **Authenticator Browser Extensions**: Various browser-based options

## Managing MFA

### Checking MFA Status
- MFA status is displayed in the settings section
- **Enabled**: Shows current status and management options
- **Disabled**: Shows setup options and instructions

### Disabling MFA
1. Navigate to MFA Settings while logged in
2. Click **Disable MFA** or similar option
3. You may be prompted to enter a current MFA code for verification
4. Confirm the action to remove MFA protection
5. Your authenticator app entry can be manually deleted

### Updating MFA Setup
If you need to change devices or authenticator apps:
1. **Disable Current MFA**: Remove existing MFA setup
2. **Set Up New MFA**: Follow the setup process with your new device/app
3. **Verify Functionality**: Ensure the new setup works before relying on it

## Security Best Practices

### Setup Security
1. **Private Setup**: Set up MFA in a private location away from others
2. **Secure Devices**: Only use trusted devices for authenticator apps
3. **Backup Codes**: Some systems provide backup codes - store these securely
4. **Multiple Apps**: Consider using multiple authenticator apps as backup

### Ongoing Security
1. **Regular Testing**: Periodically verify MFA is working correctly
2. **Device Security**: Keep your authenticator device secure and locked
3. **App Updates**: Keep authenticator apps updated to latest versions
4. **Clock Accuracy**: Ensure device clocks remain accurate

### Account Recovery
1. **Backup Methods**: Ensure you have alternative account recovery methods
2. **Administrator Access**: Know how to contact administrators if locked out
3. **Device Backup**: Consider cloud-based authenticator apps for device replacement scenarios

## Troubleshooting MFA

### Setup Issues

#### QR Code Won't Scan
- **Manual Entry**: Use the manual setup method with the secret key
- **Camera Permissions**: Ensure authenticator app has camera access
- **Lighting**: Try better lighting conditions for QR code scanning
- **Distance**: Adjust distance between camera and screen

#### Verification Fails During Setup
- **Code Timing**: Ensure you're using the current code, not an expired one
- **Clock Sync**: Verify device time is accurate and properly synced
- **Manual Entry**: Double-check manually entered secret key for typos
- **Try Again**: Generate new setup codes if verification continues to fail

### Login Issues

#### MFA Codes Not Accepted
- **Timing**: Use codes quickly before they expire (30-second window)
- **Clock Accuracy**: Ensure device clock is accurate
- **App Selection**: Verify you're using the code from the correct account in your authenticator
- **Network Delays**: Account for any network delays during submission

#### Lost Access to Authenticator
- **Administrator Help**: Contact your Pinepods administrator
- **Account Recovery**: Use alternative recovery methods if available
- **New Device Setup**: May require admin assistance to reset MFA

#### Codes Constantly Invalid
- **Time Synchronization**: Check both device and server time accuracy
- **Authenticator Reset**: Try removing and re-adding the account to your authenticator
- **Multiple Codes**: Don't reuse codes; wait for new ones if previous attempts failed

## Integration with Other Features

### Account Security
- **Password Requirements**: MFA works alongside strong password requirements
- **Session Management**: MFA applies to new login sessions
- **API Access**: May affect API key usage depending on configuration

### Administrative Features
- **User Management**: Administrators can view MFA status for users
- **Policy Enforcement**: Organizations can require MFA for all accounts
- **Audit Logging**: MFA events are typically logged for security auditing

Multi-Factor Authentication significantly enhances your Pinepods account security by requiring both something you know (password) and something you have (authenticator device). This makes unauthorized access extremely difficult even if your password is compromised.