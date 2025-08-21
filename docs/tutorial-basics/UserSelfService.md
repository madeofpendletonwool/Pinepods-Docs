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

3. **Review Security Policies**: Consider additional security measures
   - Enable Multi-Factor Authentication (MFA) for enhanced security
   - Set up proper backup procedures before opening registration
   - Review user permission defaults

#### Security Considerations

**Storage Management**
- Self-registered users can potentially consume significant storage
- Server downloads should be disabled to prevent abuse
- Monitor disk usage regularly when self-service is enabled

**Account Management**
- New accounts are created with standard user privileges (non-admin)
- Administrators should regularly review newly created accounts
- Consider implementing account approval workflows if needed

**Email Dependency**
- Password reset functionality becomes critical with self-service enabled
- Users cannot reset passwords without functional email settings
- Ensure email configuration is tested and reliable

## User Registration Process

### How Users Sign Up

When self-service registration is enabled, new users can create accounts by:

#### Step 1: Access Registration
1. Navigate to the Pinepods login page
2. Look for the **"Create New User"** link below the login form
3. Click the link to open the registration modal

#### Step 2: Complete Registration Form
The registration form requires:

**Required Information:**
- **Username**: Must be at least 4 characters long and unique
- **Full Name**: Display name for the account
- **Email**: Valid email address for notifications and password resets
- **Password**: Must be at least 6 characters long

#### Step 3: Input Validation
The system validates all inputs in real-time:
- **Username**: Checks length and uniqueness
- **Email**: Validates proper email format
- **Password**: Ensures minimum security requirements
- Error messages appear immediately for invalid inputs

#### Step 4: Account Creation
- Click **Submit** to create the account
- System creates the account with standard user permissions
- Users can immediately log in with their new credentials

### Registration Form Features

**Real-Time Validation**
- Username availability checking
- Email format validation
- Password strength requirements
- Immediate error feedback

**Security Measures**
- Passwords are securely hashed before storage
- Email addresses are validated for proper format
- Usernames must be unique across the system

**User Experience**
- Clean, modal-based registration interface
- Clear error messages and validation feedback
- Responsive design works on all devices

## Best Practices for Administrators

### Before Enabling Self-Service

1. **Test Email Configuration**
   - Send test emails to verify SMTP settings
   - Confirm password reset emails are delivered
   - Test email templates and formatting

2. **Configure Storage Limits**
   - Disable server downloads to prevent abuse
   - Set up monitoring for disk usage
   - Consider implementing storage quotas

3. **Prepare User Documentation**
   - Create user guides for new registrants
   - Document available features and limitations
   - Provide support contact information

### After Enabling Self-Service

1. **Monitor New Registrations**
   - Review newly created accounts regularly
   - Watch for suspicious registration patterns
   - Remove spam or abuse accounts promptly

2. **Maintain System Health**
   - Monitor server resources and storage usage
   - Keep email system functional and reliable
   - Regular backup of user data

3. **User Support**
   - Respond to user registration issues
   - Provide guidance on using Pinepods features
   - Handle password reset requests when email fails

## Troubleshooting

### Registration Button Not Visible
- Verify self-service is enabled in admin settings
- Check if user is already logged in (button only shows when logged out)
- Clear browser cache and refresh the page

### Registration Fails
- **Username Already Exists**: Try a different username
- **Invalid Email**: Check email format (user@domain.com)
- **Password Too Short**: Use at least 6 characters
- **Network Issues**: Check internet connection and try again

### Email Problems
- **No Password Reset Email**: Check spam/junk folders
- **Email Not Delivered**: Contact administrator about email configuration
- **Wrong Email Address**: Administrator must manually update in User Settings

### Account Access Issues
- **Cannot Login After Registration**: Verify username and password are correct
- **Account Locked**: Contact administrator for assistance
- **Forgot Credentials**: Use password reset feature (requires working email)

## Integration with Other Features

**Works With:**
- Email Settings (required for password resets)
- User Settings (for admin account management)
- MFA Settings (for enhanced security)
- Theme Options (users inherit default theme)

**Complements:**
- Password Reset functionality
- User Self Settings (personal account management)
- Administrative user management tools

By enabling User Self-Service Settings, administrators can scale their Pinepods instance more effectively while maintaining security and control over the registration process.