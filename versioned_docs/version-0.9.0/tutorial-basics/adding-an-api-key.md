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

### Third-Party Services (In the future I hope these exist)

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
