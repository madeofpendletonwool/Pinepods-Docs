# Signing In and the Home Page

## The first admin account

If you set `USERNAME`, `PASSWORD`, `FULLNAME` and `EMAIL` when you started the server, that's your admin account; sign in with it. If you didn't, the first time you open Pinepods it asks you to create the admin account. See [Admin User Info](../intro.md#admin-user-info).

## Signing in

Enter your username and password. Depending on how the server is set up, the sign-in page can also show:

- a button for each [OIDC/SSO provider](../tutorial-extras/OIDC-setup.md);
- **Forgot Password?**, which emails you a reset code ([Password Resets](../tutorial-extras/PasswordResets.md));
- **Create New User**, if an admin turned on [User Self Service](./UserSelfService.md).

If you turned on [MFA](./SettingUpMFA.md), Pinepods asks for the code from your authenticator app next.

The first time you sign in, Pinepods asks for your language, timezone, date format and time format. You can change them later under [Account Settings](./account-settings.md).

After signing in you land on your start page, Home unless you picked another one under [Display Settings](./display-settings.md).

In the desktop and mobile apps, you also enter your server's address: the same URL you open Pinepods at in a browser.

## The Home page

![The PinePods home dashboard](/img/screenshots/homepage.png)

- **Continue Listening:** episodes you've started.
- **This Week:** how much you've listened and completed this week.
- **Up Next:** the start of your [queue](../Features/Queue.md).
- **Top Podcasts:** the podcasts you listen to most.
- **Smart Playlists:** your [playlists](../Features/smart-playlists.md).
- **Recent Episodes:** the newest episodes from your podcasts.
- **Quick Links** to Saved, Downloads, History, Feed and Podcasts.

Until you subscribe to something, Home shows a welcome page with ways to get started instead.
