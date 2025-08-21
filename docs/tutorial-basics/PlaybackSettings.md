# Playback Settings

The Playback Settings section allows users to customize their podcast listening experience by configuring default playback behavior and automatic episode completion preferences.

## Accessing Playback Settings

1. Navigate to **Settings** in the main menu
2. Expand the **Playback Settings** section in the settings accordion
3. All users can access and modify their personal playback preferences

## Available Settings

### Default Playback Speed

Control the default speed at which your podcasts play when you start a new episode.

#### Configuration Options
- **Speed Range**: 0.5x to 3.0x normal speed
- **Increment**: Adjustable in 0.1x increments
- **Default Value**: 1.0x (normal speed)

#### How to Set Default Playback Speed
1. Locate the **Default Playback Speed** field
2. Enter your preferred speed value (e.g., 1.2 for 20% faster)
3. Use the number input field or type directly
4. Click the **Save** button (floppy disk icon) to apply changes
5. Look for the success confirmation message

#### Common Speed Settings
- **0.5x**: Half speed - useful for complex technical content
- **0.8x**: Slower - good for dense educational material
- **1.0x**: Normal speed - standard playback rate
- **1.2x**: 20% faster - popular for general podcast listening
- **1.5x**: 50% faster - efficient for familiar content
- **2.0x**: Double speed - very fast, for experienced listeners
- **3.0x**: Maximum speed - ultra-fast playback

### Auto Complete Episode Threshold

Configure when episodes are automatically marked as "completed" based on how close you are to the end.

#### How Auto Complete Works
The system automatically marks an episode as completed when you reach within a certain number of seconds from the end. This prevents you from having to manually mark episodes as finished when there are just credits or brief outros remaining.

#### Configuration Options
- **Range**: 0 to 3600 seconds (0 to 1 hour)
- **Default**: Varies by installation
- **Increment**: 1-second adjustments

#### Setting Up Auto Complete
1. Find the **Auto Complete Episode Threshold** field
2. Enter the number of seconds from the end when episodes should auto-complete
3. Click the **Save** button to apply the setting
4. The system will confirm when the change is saved

#### Recommended Threshold Values
- **0 seconds**: Disabled - episodes must be manually marked complete
- **30 seconds**: Good for most podcasts with brief outros
- **60 seconds**: Standard setting for podcasts with longer endings
- **120 seconds**: Useful for shows with extended credits or ads
- **300 seconds** (5 minutes): For shows with very long closing segments

## User Experience Features

### Real-Time Feedback
- Changes are saved immediately when you click the Save button
- Success messages appear to confirm your settings were updated
- Error messages display if there are any issues saving settings

### Input Validation
- **Playback Speed**: Automatically constrained to the 0.5x - 3.0x range
- **Auto Complete**: Limited to reasonable values (0-3600 seconds)
- Invalid inputs are automatically corrected to nearest valid values

### Loading States
- Settings show loading indicators while fetching current values
- Save buttons are disabled during save operations to prevent multiple submissions
- Current values are displayed as soon as they're loaded from the server

## How Settings Are Applied

### Immediate Effects
- **Default Playback Speed**: Applied to new episodes you start playing
- **Auto Complete**: Takes effect immediately for currently playing and future episodes

### Persistence
- Settings are saved per-user and persist across browser sessions
- Your preferences are maintained when switching devices (if using the same account)
- Settings sync across all your Pinepods clients

### Episode-Specific Overrides
- You can still adjust playback speed for individual episodes during playback
- The default speed setting only affects the initial speed when starting new episodes
- Episode-specific speed changes don't modify your default setting

## Best Practices

### Finding Your Optimal Playback Speed
1. Start with 1.0x (normal speed) for a few episodes
2. Gradually increase by 0.1x increments until you find a comfortable pace
3. Consider different speeds for different types of content:
   - News/interviews: 1.2x - 1.5x
   - Educational content: 0.8x - 1.2x
   - Entertainment/comedy: 1.0x - 1.3x
   - Technical/complex topics: 0.8x - 1.0x

### Setting Auto Complete Threshold
1. Consider the typical length of outros for your favorite podcasts
2. Start with 60 seconds and adjust based on your experience
3. For podcasts with dynamic ad insertion, consider longer thresholds
4. Set to 0 if you prefer manual control over episode completion

### Managing Multiple Devices
- If you listen on multiple devices, ensure your settings are synchronized
- Your Pinepods account maintains these preferences across all clients
- Changes made on one device will apply to all your other devices

## Troubleshooting

### Settings Not Saving
- **Check Network Connection**: Ensure stable internet connectivity
- **Try Refreshing**: Reload the page and attempt to save again
- **Verify Login**: Make sure you're still logged in to your account
- **Contact Administrator**: If problems persist, report the issue

### Playback Speed Not Applied
- **New Episodes Only**: Default speed only affects newly started episodes
- **Check Episode**: Manually adjust speed if needed during playback
- **Clear Cache**: Try clearing browser cache and refreshing
- **Restart Playback**: Stop and restart the episode to apply default speed

### Auto Complete Not Working
- **Check Threshold Value**: Ensure threshold is greater than 0
- **Episode Length**: Very short episodes might not trigger auto complete
- **Playback Position**: Make sure you're actually reaching the threshold point
- **Time Synchronization**: Check that episode timing is accurate

## Integration with Other Features

### Works With
- **Audio Player**: Settings apply to the main podcast player
- **Mobile Apps**: Settings sync with Pinepods mobile applications
- **Multiple Devices**: Preferences are maintained across all your devices

### Related Settings
- **Theme Options**: Visual preferences for the player interface
- **User Settings**: Account-level preferences and information
- **Download Settings**: Options for offline listening behavior

By configuring your Playback Settings thoughtfully, you can optimize your podcast listening experience for your personal preferences and listening habits.