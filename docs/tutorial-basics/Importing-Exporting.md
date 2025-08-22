# OPML Import and Export

Pinepods provides comprehensive OPML (Outline Processor Markup Language) import and export functionality, allowing users to transfer their podcast subscriptions to and from other podcast applications. This feature is essential for migrating between podcast apps, creating backups, and sharing subscription lists.

## Overview

OPML is the standard format used by podcast applications to exchange subscription data. Pinepods supports both importing OPML files from other podcast clients and exporting your current subscriptions to OPML format for use elsewhere.

## Accessing Import/Export Features

1. Navigate to **Settings** in the main menu
2. Look for the **Import Options** and **Export Options** sections
3. All users can import and export their personal podcast subscriptions

## Exporting Your Podcasts

### OPML Export Process

The export feature creates an OPML file containing all your current podcast subscriptions.

#### Step-by-Step Export
1. Locate the **Export Options** section in settings
2. Click the **Download/Export OPML** button
3. The system will generate your OPML file automatically
4. A file named `podcasts.opml` will be downloaded to your device
5. The file contains all your current podcast subscriptions with feed URLs

#### What's Included in Exports
- **Podcast Titles**: Names of all subscribed podcasts
- **Feed URLs**: RSS feed addresses for each podcast
- **Subscription Data**: Current subscription information
- **Standard Format**: Compatible with most podcast applications

#### Export Use Cases
- **App Migration**: Moving to a different podcast application
- **Backup Creation**: Preserving your subscription list
- **Device Transfer**: Setting up podcasts on a new device
- **Sharing**: Providing your subscription list to friends or colleagues
- **Cross-Platform**: Using subscriptions on multiple podcast apps

### Alternative Export Options

The export documentation mentions additional options for specific use cases:
- **AntennaPod**: Nextcloud sync options may be more suitable
- **Full Server Backup**: Administrators can use server-wide backup instead
- **Nextcloud Integration**: Available through separate Nextcloud options

## Importing Podcasts

### OPML Import Process

The import feature allows you to add podcasts from OPML files created by other podcast applications or exported from Pinepods.

#### Step-by-Step Import
1. Locate the **Import Options** section in settings
2. Click **Choose File** or browse button to select your OPML file
3. The system will parse the OPML file and display found podcasts
4. Review the list of podcasts to be imported
5. Select/deselect individual podcasts as desired (all are selected by default)
6. Click **Confirm Import** to begin the import process
7. Monitor the progress bar as podcasts are added to your library

#### Import Process Features
- **File Validation**: System checks OPML file format and content
- **Selective Import**: Choose which podcasts to import from the file
- **Progress Tracking**: Real-time progress updates during import
- **Duplicate Handling**: System manages already-subscribed podcasts
- **Batch Processing**: Efficiently imports multiple podcasts simultaneously

### Import Progress Monitoring

During import, you'll see:
- **Progress Bar**: Visual indicator of import completion
- **Current Podcast**: Name of the podcast currently being processed  
- **Total Count**: Number of podcasts being imported
- **Status Updates**: Real-time feedback on the import process

## Supported OPML Sources

### Compatible Applications
The OPML format is widely supported, allowing import from:

**Popular Podcast Apps:**
- Apple Podcasts
- Spotify (where supported)
- Google Podcasts
- Overcast
- Pocket Casts
- Castro
- AntennaPod
- Podcast Addict
- Stitcher

**Other Sources:**
- RSS feed readers (Feedly, Inoreader)
- Other Pinepods instances
- Custom OPML files
- Podcast recommendation services

### OPML File Requirements
- **Valid XML**: Must be properly formatted OPML XML
- **Podcast Entries**: Should contain podcast feed URLs
- **Standard Structure**: Follows OPML specification for podcast data
- **UTF-8 Encoding**: Properly encoded text for international characters

## Best Practices

### Before Exporting
1. **Update Subscriptions**: Ensure your podcast list is current
2. **Clean Up**: Remove unwanted subscriptions before exporting
3. **Check Connectivity**: Verify stable internet connection
4. **Storage Space**: Ensure adequate device storage for OPML file

### Before Importing
1. **File Verification**: Confirm OPML file is from a trusted source
2. **Backup Current**: Export your current subscriptions first
3. **Review Content**: Check the source application's export was successful
4. **Network Connection**: Ensure stable internet for feed validation

### During Import
1. **Selective Import**: Only import podcasts you want to follow
2. **Monitor Progress**: Watch for any error messages during import
3. **Patience Required**: Large imports may take several minutes
4. **Stay Connected**: Maintain internet connection throughout the process

## Troubleshooting

### Export Issues

#### Export Fails to Generate
- **Check Subscriptions**: Ensure you have podcasts subscribed
- **Browser Settings**: Check if downloads are blocked in your browser
- **Network Issues**: Verify stable internet connection
- **Try Again**: Refresh the page and attempt export again

#### Empty OPML File
- **No Subscriptions**: Verify you have active podcast subscriptions
- **Permission Issues**: Check browser download permissions
- **File Corruption**: Try exporting again if file appears corrupted

### Import Issues

#### File Not Recognized
- **File Format**: Ensure file has `.opml` extension
- **Valid XML**: Check that OPML file is properly formatted XML
- **File Encoding**: Confirm file uses UTF-8 encoding
- **Source Application**: Verify the source app exported correctly

#### Import Process Fails
- **Network Issues**: Check internet connection stability
- **Server Load**: Try importing during off-peak hours
- **File Size**: Very large OPML files may timeout
- **Feed Accessibility**: Some feeds in the OPML may be unavailable

#### Partial Import Success
- **Individual Feed Issues**: Some feeds may be temporarily unavailable
- **Duplicate Detection**: Already-subscribed podcasts are skipped
- **Network Timeouts**: Some feeds may fail due to slow response times
- **Manual Addition**: Failed podcasts can be added individually using Custom Feeds

### Progress Monitoring Issues

#### Progress Bar Stuck
- **Wait Patiently**: Large imports take time to process
- **Network Delays**: Feed validation may be slow
- **Server Processing**: Background processing continues even if UI seems stuck
- **Check Results**: Navigate to your podcast library to see completed imports

## Migration Strategies

### Moving from Other Podcast Apps
1. **Export from Source**: Use source app's export feature
2. **Backup Current**: Export existing Pinepods subscriptions
3. **Test Import**: Try importing a small OPML file first
4. **Full Import**: Import complete subscription list
5. **Verify Results**: Check that all desired podcasts were added

### Setting Up Multiple Devices
1. **Export from Primary**: Create OPML from your main device
2. **Import to Secondary**: Use OPML to set up other devices
3. **Regular Sync**: Consider using RSS feed sync for ongoing synchronization
4. **Update Process**: Export/import when making major subscription changes

### Backup Strategy
1. **Regular Exports**: Create periodic OPML backups
2. **Version Control**: Keep dated backups of subscription changes
3. **Cloud Storage**: Store OPML files in cloud services for safety
4. **Test Restore**: Periodically verify import process works correctly

OPML import and export functionality ensures your podcast subscriptions remain portable and protected, giving you full control over your podcast library regardless of which application or device you choose to use.