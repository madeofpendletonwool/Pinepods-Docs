# Multi-Factor Authentication (MFA)

MFA adds a one-time code from an authenticator app to your sign-in. Any app that supports TOTP works: Google Authenticator, Authy, Microsoft Authenticator, 1Password, Bitwarden and so on. Each user turns it on for their own account.

## Turning it on

1. Go to **Settings → MFA Settings** and switch on **Enable MFA**.
2. **Setup MFA** shows a QR code. Scan it with your authenticator app, or type the code shown below it into the app by hand.
3. Enter the 6-digit code the app now shows under **Verify Code** and click **Verify**.

MFA is only turned on once a code verifies. The entry appears in your app as **Pinepods**.

Codes are standard TOTP: 6 digits, SHA1, a new code every 30 seconds. A code from the 30 seconds before or after is also accepted, so a phone clock that's slightly off still works.

## Signing in

After your username and password, Pinepods asks for the current code from your app. The web app, the desktop app and the mobile app all ask for it.

## Turning it off

Switch **Enable MFA** off under **Settings → MFA Settings**.
