# Server Backup and Restore

Pinepods provides comprehensive server-level backup and restore functionality that allows administrators to create full database backups and restore their entire Pinepods instance. This feature is essential for data protection, server migration, and disaster recovery.

## Overview

The backup and restore system creates complete SQL dumps of your Pinepods database, including:
- All user accounts and authentication data
- Complete podcast subscriptions and metadata
- Episode information and listening history
- User settings and preferences
- API keys and integrations
- Server configuration settings

## Accessing Backup and Restore

**Administrator Access Required**

1. Navigate to **Settings** in the main menu
2. Expand the settings sections to find:
   - **Backup Server Data** section
   - **Restore Server Data** section
3. Only users with administrative privileges can access these features

## Creating Server Backups

### Backup Process

The backup feature generates a complete SQL dump of your Pinepods database that can be used to restore your server or migrate to a new instance.

#### Step-by-Step Backup
1. Locate the **Backup Server Data** section in settings
2. Enter your **database password** in the provided field
3. Click the **Download Backup** button
4. The system will generate a backup file named `server_backup.sql`
5. The file will automatically download to your device

#### What's Included in Backups
- **User Data**: All user accounts, passwords, and preferences
- **Podcast Data**: Subscriptions, episodes, and metadata
- **Listening History**: Episode progress and completion status
- **Settings**: All server and user configuration settings
- **API Keys**: External integrations and authentication keys
- **Database Schema**: Complete table structure and relationships

#### Security Considerations
- **Database Password Required**: You must provide the correct database password
- **Encrypted Storage**: Backup files contain sensitive user data
- **Secure Download**: Files are generated on-demand and not stored on the server
- **Access Control**: Only administrators can create backups

## Restoring Server Data

### Restore Process

The restore functionality allows you to restore a complete Pinepods instance from a previously created backup file.

#### Prerequisites for Restore
- Valid backup file (`.sql` format from Pinepods backup)
- Database password used during backup creation
- Administrative access to the target server
- Understanding that restore overwrites existing data

#### Step-by-Step Restore
1. Locate the **Restore Server Data** section in settings
2. Click **Choose File** to select your backup file
3. Enter the **database password** used when creating the backup
4. Click **Restore Server** to begin the process
5. The system will process the restore and redirect you to sign out
6. Log back in with your restored credentials

#### File Limitations
- **Maximum File Size**: 100MB limit for backup files
- **Supported Format**: Only SQL files created by Pinepods backup
- **File Validation**: System checks file integrity before processing

#### Post-Restore Behavior
- **Automatic Sign-Out**: You'll be logged out after restore begins
- **Complete Replacement**: All existing data is replaced with backup data
- **Service Restart**: Server may require restart to complete restoration
- **Re-Authentication**: You'll need to log in with restored user credentials

## Best Practices

### Regular Backup Schedule
1. **Daily Backups**: For active servers with frequent content changes
2. **Weekly Backups**: For smaller instances with less frequent updates
3. **Pre-Maintenance Backups**: Always backup before server updates or changes
4. **Migration Backups**: Create backup before moving to new hardware

### Backup Storage
1. **Multiple Locations**: Store backups in different physical locations
2. **Cloud Storage**: Use secure cloud storage for off-site backup
3. **Version Control**: Keep multiple backup versions with dates
4. **Regular Testing**: Periodically test backup restoration process

### Security Best Practices
1. **Secure Storage**: Encrypt backup files when storing long-term
2. **Access Control**: Limit who has access to backup files
3. **Password Management**: Use strong, unique database passwords
4. **Regular Rotation**: Change database passwords periodically

## Troubleshooting

### Backup Issues

#### Backup Fails to Generate
- **Check Database Password**: Ensure you're using the correct password
- **Server Resources**: Verify server has sufficient memory and disk space
- **Network Connection**: Ensure stable connection during backup process
- **Administrator Privileges**: Confirm your account has admin access

#### Download Problems
- **Browser Settings**: Check if downloads are blocked
- **File Size**: Large databases may take time to generate
- **Storage Space**: Ensure local device has sufficient storage
- **Network Timeout**: Try again if connection was interrupted

### Restore Issues

#### Restore Process Fails
- **File Corruption**: Verify backup file wasn't corrupted during transfer
- **Wrong Password**: Ensure database password matches backup creation
- **File Format**: Confirm you're using a valid Pinepods backup file
- **Server Permissions**: Check server has write access to database

#### File Upload Problems
- **File Size Limit**: Backup files must be under 100MB
- **File Format**: Only `.sql` files are accepted
- **Network Issues**: Ensure stable connection during upload
- **Browser Compatibility**: Try different browser if upload fails

#### Post-Restore Issues
- **Login Problems**: Use credentials from the backup, not current ones
- **Missing Data**: Verify backup file was complete and recent
- **Service Errors**: Server may need restart after restoration
- **Permission Issues**: Check file and database permissions

## Migration Use Cases

### Server Migration
1. Create backup on source server
2. Install Pinepods on new server
3. Restore backup to new server
4. Update DNS/network configuration
5. Test functionality on new server

### Version Upgrades
1. Backup current server state
2. Perform Pinepods upgrade
3. Test upgraded system functionality
4. Keep backup in case rollback needed

### Disaster Recovery
1. Maintain regular backup schedule
2. Store backups in secure, separate location
3. Test restore process periodically
4. Document recovery procedures for team

## Technical Details

### Backup Format
- **SQL Dump**: Complete database structure and data
- **UTF-8 Encoding**: Ensures proper character handling
- **Compressed Format**: Efficient storage of large datasets
- **Atomic Export**: Consistent snapshot of database state

### Security Measures
- **Password Protection**: Database password required for operations
- **Temporary Files**: No permanent storage of sensitive backup data
- **Access Logging**: Administrator actions are logged
- **Encryption Ready**: Compatible with file-level encryption

The backup and restore system provides enterprise-grade data protection for your Pinepods instance, ensuring your podcast data and user information remain safe and recoverable.