# User Management

Admins add, change and remove accounts under **Settings → Admin → User Management**.

## Creating a user

Click **Create New User** and fill in:

| Field | Rule |
|---|---|
| **Username** | Can't be empty. Must be unique. |
| **Full Name** | Display name. |
| **Email** | Must look like an email address. Used for [password resets](../tutorial-extras/PasswordResets.md). |
| **Password** | At least 6 characters. |

Click **Submit**. New users are not admins; make one an admin by editing them afterwards.

Users can also create their own accounts from the sign-in page if you turn on [User Self Service](./UserSelfService.md), and accounts are created automatically on first sign-in through [OIDC](../tutorial-extras/OIDC-setup.md).

## Editing a user

The table lists every user with their **User ID**, **Fullname**, **Email**, **Username** and **Admin Status**. Click a row to open **Edit Existing User**.

Fill in only the fields you want to change and leave the rest blank. **Admin User?** grants or removes admin rights. **Delete User** removes the account.

Pinepods won't delete the last admin or take admin rights away from them, so the server always has one.

Each user changes their own name, email, password and regional settings under [Account Settings](./account-settings.md).
