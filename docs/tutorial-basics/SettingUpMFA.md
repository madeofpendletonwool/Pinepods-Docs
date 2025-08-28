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
2. Click **Enable MFA**
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
1. Look for the text-based secret
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
