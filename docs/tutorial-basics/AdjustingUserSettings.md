# Adjusting User Settings

The User Settings section allows administrators to manage user accounts within their Pinepods instance. This comprehensive interface provides tools for creating, modifying, and managing user accounts, including their permissions and personal information.

## Accessing User Settings

To access User Settings:
1. Navigate to the **Settings** page from the main menu
2. Expand the **User Settings** accordion section
3. Only users with administrative privileges will see this section

## User Management Features

### Creating New Users

Administrators can create new user accounts with the following steps:

1. Click the **Add User** or **Create User** button
2. Fill in the required information:
   - **Username**: Must be at least 3 characters long and unique
   - **Password**: Must be at least 8 characters long for security
   - **Email**: Valid email address for notifications and password resets
   - **Full Name**: Display name for the user
   - **Admin Status**: Toggle to grant or deny administrative privileges

3. Click **Create** to add the new user

### Input Validation

The system enforces several validation rules:
- **Username**: Minimum 3 characters, must be unique across the system
- **Password**: Minimum 8 characters for security compliance
- **Email**: Must be a valid email format (user@domain.com)

Error messages will appear if validation fails, clearly indicating what needs to be corrected.

### Viewing Existing Users

The User Settings interface displays a list of all current users showing:
- Username
- Full name
- Email address
- Administrative status
- User ID (for reference)

### Modifying User Information

For each existing user, administrators can modify:

#### Basic Information
- **Username**: Change the login name (must remain unique)
- **Full Name**: Update the display name
- **Email Address**: Change the contact email

#### Security Settings
- **Password**: Reset or change user passwords
- **Admin Privileges**: Grant or revoke administrative access

#### Account Management
- **Delete User**: Remove user accounts (use with caution)

## Administrative Controls

### Admin Status Management

Administrators can:
- **Grant Admin Rights**: Give users administrative privileges
- **Revoke Admin Rights**: Remove administrative access
- **View Admin Status**: Clearly see which users have administrative privileges

### Security Considerations

- Password changes are encrypted using secure hashing
- Administrative actions are logged for security auditing
- Only existing administrators can modify user permissions
- Users cannot elevate their own privileges
