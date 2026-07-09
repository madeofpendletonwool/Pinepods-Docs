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
