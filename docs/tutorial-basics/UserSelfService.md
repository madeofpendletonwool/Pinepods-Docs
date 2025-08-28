# User Self-Service Settings

The User Self-Service Settings feature in Pinepods allows administrators to enable user self-registration, empowering new users to create their own accounts directly from the login screen without requiring administrator intervention.

## Administrative Configuration

### Enabling User Self-Service Registration

**For Administrators Only**

The User Self-Service Settings control whether users can register their own accounts through the login interface.

#### Accessing Self-Service Controls
1. Navigate to **Settings** in the main menu
2. Expand the **User Settings** section
3. Locate the **User Self Service Settings** section
4. Toggle the **Enable User Self Service** switch

#### How It Works

When enabled, this feature:
- Adds a **"Create New User"** button to the login screen
- Allows new users to register accounts independently
- Provides a modal registration form accessible to anyone
- Validates user input according to system requirements

When disabled:
- Only administrators can create new user accounts
- The registration button is hidden from the login screen
- User creation must be done through the administrative User Settings interface

#### Important Prerequisites

**Highly Recommended Setup Before Enabling:**

1. **Configure Email Settings**: Essential for password reset functionality
   - Set up SMTP server configuration
   - Test email delivery to ensure users can reset forgotten passwords
   - Configure proper email templates and sender information

2. **Disable Server Downloads**: Prevent storage abuse by new users
   - Navigate to Download Settings
   - Disable server-side podcast downloads for security
   - This prevents users from consuming excessive storage space

#### Security Considerations

**Account Management**
- New accounts are created with standard user privileges (non-admin)
- Administrators should regularly review newly created accounts

**Email Dependency**
- Password reset functionality becomes critical with self-service enabled
- Users cannot reset passwords without functional email settings
- Ensure email configuration is tested and reliable
