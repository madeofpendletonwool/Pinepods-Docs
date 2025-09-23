# Firewood User Guide

Complete guide to using PinePods Firewood - your feature-rich terminal podcast client.

## Interface Overview

Firewood provides a tabbed interface with multiple sections for managing and listening to your podcasts. Each tab offers specific functionality for different aspects of podcast management.

### Main Navigation

**Tab Switching:**
- `Tab` - Navigate between tabs sequentially
- `1-9` - Jump directly to specific tabs by number
- `Arrow Keys` / `hjkl` - Navigate within lists and content
- `Enter` - Select/activate items
- `q` / `Ctrl+C` - Quit application

**Global Controls:**
- `Space` - Global play/pause toggle (works from any tab)
- `r` - Refresh current page/content
- `Esc` - Return to previous screen or cancel actions

## Tab-by-Tab Guide

### 🏠 Home Tab (1)
*Status: Implemented*

Your dashboard for quick access to recent content and recommendations.

**Features:**
- **Recent Episodes**: Latest episodes from your subscribed podcasts
- **Continue Listening**: Resume episodes you've started but haven't finished
- **Quick Access**: Jump to saved content and downloads
- **Activity Overview**: See your listening progress and statistics

**Navigation:**
- Use arrow keys to browse through recent episodes
- Press `Enter` to start playing an episode
- Episodes show title, podcast name, and publication date

### 🎙️ Podcasts Tab (2)
*Status: Implemented*

Browse your podcast subscriptions with a dual-panel interface.

**Layout:**
- **Left Panel**: List of subscribed podcasts
- **Right Panel**: Episodes from the selected podcast

**Navigation:**
- `Tab` - Switch between left and right panels
- `↑/↓` or `j/k` - Navigate podcast list
- `Enter` - Select podcast (loads episodes in right panel)
- In episodes panel: `↑/↓` to browse, `Enter` to play

**Features:**
- View all your podcast subscriptions organized alphabetically
- See episode counts and latest episode information
- Quick access to specific podcast episodes
- Podcast artwork and descriptions (when available)

### 📻 Episodes Tab (3)
*Status: Implemented*

Comprehensive episode management with filtering and search capabilities.

**Content Views:**
- **All Episodes**: Complete feed of recent episodes from all subscriptions
- **In Progress**: Episodes you've started but haven't finished
- **Completed**: Episodes you've finished listening to

**Features:**
- **Auto-loading**: Episodes load automatically as you scroll
- **Real-time Search**: Filter episodes by title or podcast name
- **Status Tracking**: Visual indicators for play status and progress
- **Batch Actions**: Mark multiple episodes as played/unplayed

**Navigation:**
- `↑/↓` - Browse episode list
- `Enter` - Play selected episode
- `Space` - Quick play/pause
- `/` - Activate search mode
- `Esc` - Clear search filter

### 🎵 Player Tab (4)
*Status: Implemented*

Full-screen audio player with comprehensive playback controls.

**Player Interface:**
- **Episode Information**: Title, podcast name, description
- **Artwork Display**: Episode or podcast cover art
- **Progress Bar**: Visual playback progress with time indicators
- **Control Buttons**: Play, pause, skip forward/backward, volume

**Playback Controls:**
- `Space` / `Enter` - Play/pause toggle
- `→` / `l` - Skip forward 15 seconds
- `←` / `h` - Skip backward 15 seconds
- `↑` / `k` - Increase volume
- `↓` / `j` - Decrease volume
- `0-9` - Seek to percentage (0% to 90%)
- `m` - Mute/unmute audio

**Advanced Features:**
- **Progress Sync**: Automatically syncs listening progress with PinePods server
- **Resume Playback**: Pick up where you left off on any device
- **Smart Skip**: Respects podcast chapter markers when available
- **Background Play**: Continues playing while you browse other tabs

### 📝 Queue Tab (5)
*Status: Planned*

Manage your episode queue and listening order.

**Planned Features:**
- **Queue Management**: Add, remove, and reorder episodes
- **Auto-queue**: Automatically add next episodes from subscriptions
- **Drag-and-drop**: Reorder episodes with intuitive controls
- **Queue Actions**: Clear queue, shuffle, repeat modes
- **Smart Queue**: Recommendations based on listening history

### ⭐ Saved Tab (6)
*Status: Planned*

Access your bookmarked and favorite episodes.

**Planned Features:**
- **Bookmarks**: Episodes you've marked for later
- **Favorites**: Your starred episodes and podcasts
- **Collections**: Custom groups of related episodes
- **Quick Access**: Fast filtering and search within saved content
- **Sync**: Saved items sync across all your devices

### 📥 Downloads Tab (7)
*Status: Planned*

Manage offline episode downloads for listening without internet.

**Planned Features:**
- **Download Management**: Queue, pause, cancel downloads
- **Offline Library**: Browse downloaded episodes
- **Storage Monitoring**: Track disk usage and manage space
- **Auto-download**: Set rules for automatic episode downloads
- **Quality Settings**: Choose download quality and format

### 🔍 Search Tab (8)
*Status: Planned*

Discover new content and find specific episodes or podcasts.

**Planned Features:**
- **Global Search**: Find episodes across all your subscriptions
- **Podcast Discovery**: Browse and subscribe to new podcasts
- **Advanced Filters**: Filter by date, duration, podcast, etc.
- **Search History**: Quick access to previous searches
- **Trending**: See popular and recommended content

### ⚙️ Settings Tab (9)
*Status: Planned*

Configure Firewood to match your preferences and setup.

**Planned Features:**
- **Audio Settings**: Output device, volume levels, equalizer
- **Remote Control**: Configure network settings and port
- **Appearance**: Themes, colors, and layout customization
- **Keyboard Shortcuts**: Customize key bindings
- **Sync Settings**: Server connection and sync preferences
- **Advanced Options**: Debug settings and performance tuning

## Micro-Player Controls

Firewood includes an always-visible micro-player at the bottom of every screen, providing quick access to playback controls without switching to the Player tab.

**Micro-Player Features:**
- **Track Info**: Current episode title and podcast name
- **Playback Status**: Play/pause indicator and progress
- **Quick Controls**: Play/pause, skip buttons
- **Time Display**: Current position and total duration
- **Volume Indicator**: Current volume level

**Universal Controls:**
- `Space` - Play/pause from any screen
- `→` / `Ctrl+→` - Skip forward 15 seconds
- `←` / `Ctrl+←` - Skip backward 15 seconds
- `↑` / `Ctrl+↑` - Volume up
- `↓` / `Ctrl+↓` - Volume down

## Remote Control Features

Firewood can be controlled remotely from other devices on your network, making it perfect for integration with smart home systems or remote control from phones/tablets.

### Network Discovery

**Automatic Discovery:**
- Firewood advertises itself via mDNS as `_pinepods-remote._tcp.local.`
- Other devices can automatically find and connect to your Firewood instance
- No manual IP configuration needed on the same network

**Manual Connection:**
- Connect directly using IP:PORT (default port 8042)
- Supports custom port configuration via environment variables

### Remote Control API

**HTTP Endpoints:**
- `GET /status` - Get current playback status
- `POST /play` - Play specific episode
- `POST /pause` - Pause playback
- `POST /resume` - Resume playback
- `POST /stop` - Stop playback
- `POST /skip` - Skip forward/backward by seconds
- `POST /seek` - Seek to specific position
- `POST /volume` - Set volume level

**Web Integration:**
When implemented in PinePods web UI, you'll be able to:
- "Beam" episodes directly to Firewood players
- Control multiple Firewood instances from one interface
- See all available players on your network
- Sync playback across devices

### Remote Control Setup

**Configuration:**
```bash
# Custom port (default: 8042)
export FIREWOOD_REMOTE_PORT=8080

# Disable remote control
export FIREWOOD_REMOTE_DISABLED=true

# Run Firewood
pinepods_firewood
```

**Testing Remote Control:**
Use the included Python test script:
```bash
# Discover Firewood players
python test_remote_control.py --discover

# Interactive control
python test_remote_control.py -u http://IP:PORT --interactive
```

## Audio and Playback

### Supported Formats

Firewood supports all major podcast audio formats:
- **MP3** - Most common podcast format
- **AAC/M4A** - Apple's audio format
- **OGG/Vorbis** - Open source format
- **FLAC** - Lossless audio format
- **WAV** - Uncompressed audio

### Playback Features

**Streaming:**
- Direct streaming from PinePods server
- No local storage required for streaming
- Automatic quality adjustment based on connection

**Progress Tracking:**
- Syncs listening position with PinePods server
- Resume playback across devices
- Marks episodes as played automatically

**Audio Controls:**
- Variable speed playback (planned)
- Sleep timer (planned)
- Chapter navigation (planned)
- Noise reduction (planned)

## Keyboard Shortcuts Reference

### Global Shortcuts
| Key | Action |
|-----|--------|
| `Tab` | Switch tabs |
| `1-9` | Jump to tab |
| `Space` | Play/pause |
| `q` | Quit |
| `Ctrl+C` | Force quit |
| `r` | Refresh |

### Navigation
| Key | Action |
|-----|--------|
| `↑/↓` or `k/j` | Navigate up/down |
| `←/→` or `h/l` | Navigate left/right |
| `Enter` | Select/activate |
| `Esc` | Back/cancel |

### Player Controls
| Key | Action |
|-----|--------|
| `Space` | Play/pause |
| `→` | Skip forward 15s |
| `←` | Skip backward 15s |
| `↑` | Volume up |
| `↓` | Volume down |
| `m` | Mute/unmute |
| `0-9` | Seek to percentage |

### List Management
| Key | Action |
|-----|--------|
| `/` | Search/filter |
| `Esc` | Clear search |
| `Page Up/Down` | Scroll pages |
| `Home/End` | Go to top/bottom |

## Tips and Best Practices

### Efficient Navigation
- **Use Number Keys**: Quickly jump between tabs with 1-9
- **Master the Micro-Player**: Control playback without leaving your current tab
- **Search Everything**: Use `/` to quickly filter long lists
- **Keyboard First**: Learn the shortcuts for faster navigation

### Managing Large Libraries
- **Use Filters**: Episode tab filters help manage large subscription lists
- **Save Important Episodes**: Use the Saved tab for episodes you want to return to
- **Queue Management**: Build listening queues for organized podcast sessions
- **Regular Cleanup**: Mark episodes as played to keep lists manageable

### Remote Control Tips
- **Multiple Instances**: Run Firewood on multiple devices for whole-home audio
- **Port Management**: Use custom ports if you have conflicts
- **Network Setup**: Ensure devices are on same network for auto-discovery
- **Firewall**: Allow mDNS (port 5353) for automatic discovery

### Performance Optimization
- **Refresh Wisely**: Use `r` to refresh content when needed
- **Background Updates**: Let Firewood handle automatic syncing
- **Network Patience**: Allow time for episode lists to load on slower connections

## Troubleshooting

### Common Issues

**Audio Not Playing:**
- Check system audio settings and volume
- Verify ALSA libraries are installed (Linux)
- Test with different episodes to isolate the issue

**Connection Problems:**
- Verify PinePods server is running and accessible
- Check network connectivity and firewall settings
- Try manual server URL entry

**Performance Issues:**
- Close other resource-intensive applications
- Check available system memory
- Update to latest Firewood version

**Remote Control Not Working:**
- Ensure devices are on same network
- Check if port is blocked by firewall
- Try manual IP:PORT connection

### Getting Help

- **GitHub Issues**: [Report bugs and request features](https://github.com/madeofpendletonwool/pinepods-firewood/issues)
- **Documentation**: Check README.md and other docs in the repository
- **Community**: Join discussions in GitHub Discussions
- **Logs**: Enable debug logging with `RUST_LOG=debug pinepods_firewood`

---

**Enjoy your podcast listening experience with Firewood!** This terminal-based client brings the power and convenience of PinePods directly to your command line, with all the features you need for managing and enjoying your favorite shows.
