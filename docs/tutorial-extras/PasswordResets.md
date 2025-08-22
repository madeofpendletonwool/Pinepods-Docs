# Password Reset System

Pinepods provides a comprehensive password reset system that allows users to securely reset their passwords when they cannot access their accounts. This system consists of two main components: email configuration by administrators and the password reset process available to users on the login page.

## Overview

The password reset system works through a secure two-step verification process:
1. **Request Reset**: User provides username and email to request a password reset
2. **Verify and Reset**: User enters the reset code from email along with their new password

This system requires administrators to configure email settings for sending reset codes to users.

## Administrator Setup: Email Configuration

Before users can reset their passwords, administrators must configure the email settings that will be used to send password reset codes.

### Accessing Email Settings

1. Log in with an administrator account
2. Navigate to **Settings** in the main menu
3. Expand the **Email Settings** section
4. Configure the SMTP settings for password reset emails

### Required Email Configuration

#### Basic SMTP Settings
- **SMTP Server**: Your email provider's SMTP server (e.g., `smtp.gmail.com`)
- **Port**: SMTP port number (typically `587` for StartTLS or `465` for SSL/TLS)
- **From Email**: The email address that password reset emails will be sent from
- **Encryption**: Choose from `None`, `SSL/TLS`, or `StartTLS` (StartTLS recommended)

#### Authentication Settings
- **Authentication Required**: Enable if your SMTP server requires authentication
- **Username**: SMTP account username (usually the full email address)
- **Password**: SMTP account password or app-specific password

### Common Email Provider Settings

#### Gmail Configuration
- **Server**: `smtp.gmail.com`
- **Port**: `587` (StartTLS) or `465` (SSL/TLS)
- **Encryption**: StartTLS or SSL/TLS
- **Authentication**: Required
- **Username**: Your full Gmail address
- **Password**: App-specific password (not your regular Gmail password)

**Note**: Gmail requires generating an App Password for SMTP access. Regular Gmail passwords will not work.

#### Outlook/Hotmail Configuration
- **Server**: `smtp-mail.outlook.com`
- **Port**: `587`
- **Encryption**: StartTLS
- **Authentication**: Required
- **Username**: Your full Outlook email address
- **Password**: Your Outlook account password

#### Yahoo Configuration
- **Server**: `smtp.mail.yahoo.com`
- **Port**: `587`
- **Encryption**: StartTLS
- **Authentication**: Required
- **Username**: Your full Yahoo email address
- **Password**: Yahoo app password

### Testing Email Configuration

Before saving email settings, administrators should test the configuration:

1. Fill in all required SMTP settings
2. Click **Test Email Settings**
3. The system will send a test email to your account email address
4. Check your inbox for the test email
5. If successful, click **Save Settings** to apply the configuration
6. If the test fails, review and correct the settings before trying again

### Security Considerations

- **App Passwords**: Many email providers require app-specific passwords for SMTP access
- **Secure Storage**: Email passwords are securely stored and encrypted in the database
- **From Address**: Use a dedicated email address for system notifications
- **Rate Limiting**: Consider email provider sending limits for high-volume installations

## User Password Reset Process

Once email settings are configured, users can reset their passwords through the login page.

### Initiating a Password Reset

#### Step 1: Access Reset Option
1. Navigate to the Pinepods login page
2. Click the **"Forgot Password?"** link below the password field
3. A password reset modal will appear

#### Step 2: Provide Account Information
1. Enter your **username** in the username field
2. Enter the **email address** associated with your account
3. Click **Submit** to request the reset code
4. The system will send a password reset code to your email address

### Completing the Password Reset

#### Step 3: Check Your Email
1. Check your email inbox for a message from Pinepods
2. Look for an email containing your password reset code
3. Copy or note the reset code from the email
4. Return to the Pinepods interface

#### Step 4: Enter New Password and Code
1. In the password reset interface, you'll see fields for:
   - **Reset Code**: Enter the code from your email
   - **New Password**: Enter your desired new password
2. Fill in both fields accurately
3. Click **Submit** to complete the password reset

#### Step 5: Login with New Password
1. After successful reset, you'll be returned to the login page
2. Log in using your username and new password
3. Your account is now accessible with the new password

### Password Reset Validation

The system validates several aspects during password reset:

#### Account Verification
- **Username Match**: The provided username must exist in the system
- **Email Match**: The email must be associated with the provided username
- **Account Status**: The user account must be active and not disabled

#### Reset Code Verification
- **Code Accuracy**: The reset code must match exactly (case-sensitive)
- **Time Limits**: Reset codes expire after a certain period for security
- **Single Use**: Each reset code can only be used once

#### Password Requirements
- New passwords must meet the system's password complexity requirements
- Passwords are encrypted and securely stored
- Previous password is completely replaced (no password history restrictions)

## Troubleshooting Password Resets

### User Issues

#### Reset Code Not Received
- **Check Spam Folder**: Reset emails may be filtered into spam/junk folders
- **Verify Email Address**: Ensure you're using the correct email associated with your account
- **Wait Time**: Allow a few minutes for email delivery
- **Contact Administrator**: If emails aren't being received, email configuration may need attention

#### Invalid Reset Code Error
- **Code Accuracy**: Ensure the reset code is entered exactly as received (check for extra spaces)
- **Code Expiration**: Reset codes expire for security - request a new one if needed
- **Single Use**: Each code can only be used once - request a new code for additional attempts
- **Case Sensitivity**: Reset codes are case-sensitive

#### Username/Email Not Found
- **Spelling**: Double-check username and email spelling
- **Account Existence**: Verify your account exists in this Pinepods instance
- **Email Association**: Confirm the email address is associated with your username
- **Contact Administrator**: Admin may need to verify or update your account information

### Administrator Issues

#### Reset Emails Not Sending
- **SMTP Configuration**: Verify all email settings are correct
- **Test Email Function**: Use the test email feature to diagnose issues
- **Authentication**: Ensure SMTP credentials are valid and current
- **Provider Restrictions**: Check if email provider has new security requirements

#### Email Delivery Problems
- **Spam Filtering**: Reset emails may be blocked by spam filters
- **Rate Limiting**: Email providers may limit sending frequency
- **From Address**: Ensure the "from" email address is properly configured
- **DNS/Network**: Verify server can reach external SMTP servers

#### User Account Issues
- **Email Verification**: Confirm user email addresses are correct in the database
- **Account Status**: Verify user accounts are active and not disabled
- **Permission Issues**: Ensure password reset functionality is enabled system-wide

## Security Features

### Reset Code Security
- **Cryptographically Secure**: Reset codes are generated using secure random methods
- **Time Expiration**: Codes automatically expire after a set period
- **Single Use**: Each code becomes invalid after successful use
- **No Reuse**: Previous reset codes cannot be reused

### Account Protection
- **Email Verification**: Requires access to account email address
- **Username Verification**: Must provide correct username for the account
- **Audit Logging**: Password reset attempts are logged for security monitoring
- **Rate Limiting**: Prevents abuse through multiple rapid reset requests

### Communication Security
- **Encrypted Transmission**: Reset codes sent via encrypted email (when supported)
- **Secure Storage**: All password data is encrypted in the database
- **No Plain Text**: Passwords are never stored or transmitted in plain text
- **Clean Codes**: Reset codes are automatically cleaned up after use or expiration

## Best Practices

### For Administrators
1. **Regular Testing**: Periodically test the password reset system
2. **Monitor Logs**: Watch for failed reset attempts or abuse patterns
3. **Email Security**: Use dedicated email accounts for system notifications
4. **Update Credentials**: Keep SMTP credentials current and secure
5. **User Communication**: Inform users about the password reset process

### For Users
1. **Secure Email**: Ensure your account email is secure and accessible
2. **Quick Action**: Use reset codes promptly to avoid expiration
3. **Strong Passwords**: Choose strong, unique passwords when resetting
4. **Secure Environment**: Reset passwords from secure, trusted devices
5. **Report Issues**: Contact administrators if experiencing persistent problems

The password reset system provides a secure, user-friendly way to regain account access while maintaining strong security standards through email verification and time-limited reset codes.