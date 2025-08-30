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
- Literally everything

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
- **Supported Format**: Only SQL files created by Pinepods backup
- **File Validation**: System checks file integrity before processing

#### Post-Restore Behavior
- **Automatic Sign-Out**: You'll be logged out after restore begins
- **Complete Replacement**: All existing data is replaced with backup data
- **Service Restart**: Server may require restart to complete restoration
- **Re-Authentication**: You'll need to log in with restored user credentials
