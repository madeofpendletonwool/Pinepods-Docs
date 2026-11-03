# Email and Password Resets

Pinepods sends email for one thing: password reset codes. An admin sets up the mail server once, and then users who forget their password can reset it from the sign-in page.

Email is configured in the app, not with environment variables. The `SMTP_*` and `FROM_EMAIL` variables are not used for this.

## Setting up email (admins)

Go to **Settings → Admin → Email Settings**. **Current Settings** shows what's saved now. Fill in:

| Field | |
|---|---|
| **SMTP Server** | Your provider's SMTP host. |
| **Port** | Usually `587` for StartTLS or `465` for SSL/TLS. |
| **From Email Address** | The address reset emails come from. |
| **Encryption Method** | **None**, **SSL/TLS** or **StartTLS**. |
| **Authentication Required** | Turn on if the server needs a login, then fill in **Username** and **Password**. |

Click **Send Test Email**. It's sent to your own account's email address, so make sure that's set under [Account Settings](../tutorial-basics/account-settings.md). When it arrives, click **Save Settings**.

Common providers:

| Provider | Server | Port |
|---|---|---|
| Gmail | `smtp.gmail.com` | `587` (StartTLS) or `465` (SSL/TLS) |
| Outlook / Hotmail | `smtp.office365.com` | `587` |
| Yahoo | `smtp.mail.yahoo.com` | `587` |

:::tip
Gmail needs an App Password, not your normal password: Google Account → Security → App Passwords. Many other providers work the same way.
:::

## Resetting a password (users)

1. On the sign-in page, click **Forgot Password?**.
2. Enter your username and the email address on your account.
3. If they match, Pinepods emails you a reset code. The page doesn't say whether the account exists.
4. Enter the **Reset Code** and your new password, then click **Reset Password**.
5. Sign in with the new password.

A code is valid for one hour. Request a new one if it has expired. At most three codes are sent to the same address in 10 minutes.

If email isn't set up, or the user has no email address, an admin can set a new password for them under [User Management](../tutorial-basics/user-management.md).
