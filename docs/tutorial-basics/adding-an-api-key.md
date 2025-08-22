# API Key Management

Pinepods provides comprehensive API key management functionality that allows users to create, view, and manage API keys for external integrations and programmatic access to their podcast data. This system supports secure authentication for third-party applications and custom integrations.

## Overview

API keys in Pinepods enable secure, programmatic access to your podcast data and functionality. The system provides different levels of access based on user permissions and supports both individual user keys and administrative access patterns.

## Accessing API Key Management

1. Navigate to **Settings** in the main menu
2. Expand the **API Keys** section
3. User access depends on privileges:
   - **Standard Users**: Can view and manage only their own API keys
   - **Administrators**: Can view and manage all API keys across the system

## Creating API Keys

### Step-by-Step API Key Creation

1. **Navigate to API Keys**: Open the API Keys section in settings
2. **Create New Key**: Click the **Create API Key** or **Generate New Key** button
3. **Key Generation**: The system will generate a unique, secure API key
4. **Key Display**: A modal will show your new API key
5. **Save Immediately**: Copy and save the key in a secure location
6. **One-Time Display**: The key is shown only once for security reasons

### API Key Security Features

- **Unique Generation**: Each key is cryptographically unique
- **One-Time Display**: Keys are shown only during creation
- **Secure Storage**: Keys are hashed and stored securely on the server
- **Immediate Access**: Keys are active immediately after creation

### Important Security Notice

  **Critical**: Save your API key immediately when displayed. For security reasons, you can only view the complete key once during creation. If you lose the key, you'll need to create a new one.

## Managing Existing API Keys

### Viewing Your API Keys

The API Keys interface displays:
- **Key Information**: Partial key display (masked for security)
- **Creation Date**: When each key was generated
- **Usage Status**: Whether keys are active or inactive
- **Key ID**: Internal identifier for management purposes

### Administrative View vs User View

**Standard Users See:**
- Only their own API keys
- Basic key information and management options
- Create and delete capabilities for personal keys

**Administrators See:**
- All API keys across the entire system
- User ownership information for each key
- Enhanced management capabilities
- System-wide key oversight

## Deleting API Keys

### Step-by-Step Key Deletion

1. **Select Key**: Click on the API key you want to delete
2. **Confirm Deletion**: A confirmation modal will appear
3. **Warning Review**: Review the permanent deletion warning
4. **Confirm Action**: Click **Delete** to permanently remove the key
5. **Immediate Effect**: The key becomes invalid immediately

### Deletion Considerations

- **Permanent Action**: Deleted keys cannot be recovered
- **Immediate Invalidation**: Applications using the key will lose access instantly
- **No Reversal**: You must create a new key if access is needed again
- **Planning Required**: Ensure dependent applications have alternative access

## API Key Use Cases

### External Integrations

**Podcast Applications**
- Mobile app synchronization
- Desktop client authentication
- Web application access
- Cross-platform data sharing

**Automation Tools**
- Podcast download automation
- Playlist management scripts
- Episode tracking systems
- Custom notification systems

**Development Projects**
- Custom podcast clients
- Integration with other services
- Data analysis tools
- Backup and sync utilities

### Third-Party Services

**Media Centers**
- Plex integration
- Kodi plugin access
- Home automation systems
- Smart speaker integration

**Productivity Tools**
- Calendar integration for episode releases
- Task management system connections
- Note-taking application sync
- Personal dashboard widgets

## Security Best Practices

### API Key Protection

1. **Secure Storage**: Store keys in environment variables or secure credential stores
2. **Limited Exposure**: Never commit keys to version control systems
3. **Restricted Access**: Only provide keys to trusted applications
4. **Regular Rotation**: Periodically create new keys and retire old ones

### Access Management

1. **Principle of Least Privilege**: Create separate keys for different applications
2. **Regular Auditing**: Review active keys and remove unused ones
3. **Monitoring Usage**: Watch for unexpected API usage patterns
4. **Immediate Revocation**: Delete compromised keys immediately

### Development Guidelines

1. **Environment Separation**: Use different keys for development, testing, and production
2. **Secure Transmission**: Always use HTTPS when transmitting API keys
3. **Error Handling**: Implement proper error handling for authentication failures
4. **Documentation**: Document which applications use which keys

## Troubleshooting API Keys

### Key Creation Issues

#### Creation Fails
- **Check Permissions**: Ensure you have rights to create API keys
- **Server Connection**: Verify stable connection to Pinepods server
- **Try Again**: Refresh the page and attempt creation again
- **Contact Admin**: Reach out to administrators if problems persist

#### Modal Doesn't Display Key
- **Browser Issues**: Try a different browser or disable ad blockers
- **JavaScript Errors**: Check browser console for JavaScript errors
- **Network Problems**: Ensure stable internet connection
- **Page Refresh**: Refresh and try creating a new key

### Authentication Problems

#### Key Not Working
- **Correct Key**: Verify you're using the complete, correct API key
- **Key Status**: Check that the key hasn't been deleted
- **Format Issues**: Ensure no extra spaces or characters in the key
- **Server Issues**: Verify Pinepods server is accessible

#### Permission Denied
- **User Access**: Confirm your account has necessary permissions
- **Key Ownership**: Standard users can only use their own keys
- **Admin Rights**: Some operations may require administrative privileges
- **Account Status**: Ensure your user account is active

### Management Issues

#### Cannot Delete Key
- **Selection**: Ensure you've properly selected the key to delete
- **Permissions**: Verify you have rights to delete the specific key
- **Active Usage**: Some systems may prevent deletion of actively used keys
- **Admin Assistance**: Contact administrators for help with problematic keys

#### Keys Not Visible
- **User Context**: Standard users only see their own keys
- **Loading Issues**: Wait for the interface to fully load
- **Refresh Data**: Try refreshing the page or logging out and back in
- **Permission Changes**: Recent permission changes may require re-login

## Integration Examples

### Basic Authentication Header
```
Authorization: Bearer YOUR_API_KEY_HERE
```

### Common API Endpoints
API keys typically provide access to:
- Podcast subscription data
- Episode information and progress
- User preferences and settings
- Playlist and queue management

### Usage Monitoring
- Monitor API response codes for authentication issues
- Watch for rate limiting (if implemented)
- Log successful vs failed authentication attempts
- Track which integrations are actively using keys

## Administrative Considerations

### System-Wide Management
Administrators should:
- Regularly audit active API keys across all users
- Monitor for suspicious usage patterns
- Establish policies for key creation and usage
- Provide guidance to users on security best practices

### Policy Development
Consider implementing:
- Key expiration policies
- Usage monitoring and alerting
- Regular security reviews
- User education on API key security

API key management is a powerful feature that enables extensive customization and integration possibilities while maintaining security through proper access controls and user education.