# User Self Service

With self service on, anyone who can reach your Pinepods sign-in page can create their own account.

Turn it on under **Settings → Admin → User Self Service Settings → Enable User Self Service**. The sign-in page then shows **Create New User**, which opens a form for a username, full name, email and password. The new account is a normal user, not an admin, and can sign in straight away.

With it off, only admins create accounts, under [User Management](./user-management.md).

Before turning it on:

- **Set up [email](../tutorial-extras/PasswordResets.md).** Users who forget their password reset it with a code sent by email; without email, an admin has to reset it for them.
- **Consider turning off server downloads** under **Settings → Admin → Download Settings**, so new users can't fill the server's disk. See [Downloads](../Features/Downloads.md).
