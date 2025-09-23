# Firewood Episode Beaming Guide

Complete guide to Firewood's remote control and episode beaming functionality - send episodes from any device to your Firewood players across your network.

## What is Episode Beaming?

Episode beaming is Firewood's signature feature that allows you to remotely control Firewood players from other devices on your network. Think of it as "casting" or "AirPlay" for podcast episodes - you can send episodes from a web browser, mobile app, or any device to play on your Firewood terminal players.

### Key Features

- **Network Discovery**: Automatically finds Firewood players on your local network
- **Episode Streaming**: Send episodes directly to remote Firewood players
- **Remote Control**: Full playback control (play, pause, skip, volume) from any device
- **Multi-Player Support**: Control multiple Firewood instances simultaneously
- **Progress Sync**: Playback position syncs with your PinePods server
- **Resume Capability**: Start episodes at specific positions (resume functionality)

## How It Works

### Architecture Overview

1. **Firewood Player** runs on your computer/server with audio output
2. **Remote Control Server** built into each Firewood instance
3. **mDNS Discovery** automatically advertises players on network
4. **HTTP API** provides remote control interface
5. **Web Integration** (future) will add "beam to Firewood" buttons

### Network Discovery (mDNS)

Firewood automatically advertises itself on your local network using mDNS (Multicast DNS):

- **Service Type**: `_pinepods-remote._tcp.local.`
- **Instance Name**: `Firewood-{8-char-UUID}` (e.g., `Firewood-47A053CD`)
- **Port**: Automatically allocated (starts at 8042, finds available port)
- **Metadata**: Includes Firewood version and connected PinePods server

### Port Management

Firewood uses intelligent port allocation:
- **Default Port**: 8042
- **Fallback Sequence**: 8043, 8044, 8080-8083, 3000-3002, 4000-4002, 9000-9002
- **Final Fallback**: OS-assigned random port
- **Discovery**: Always use mDNS-discovered port, never assume port number

## Remote Control API

Firewood exposes a REST API for complete remote control functionality.

### Base URL Format
```
http://{firewood_ip}:{discovered_port}
```

### API Endpoints

#### Player Information
```bash
GET /
```
Returns basic player information:
```json
{
  "success": true,
  "data": {
    "name": "Firewood-47A053CD",
    "version": "0.1.0",
    "server_url": "http://your-pinepods-server:8032",
    "user_id": 1
  }
}
```

#### Playback Status
```bash
GET /status
```
Returns current playback state:
```json
{
  "success": true,
  "data": {
    "is_playing": true,
    "current_episode": {
      "episode_id": 123,
      "episode_title": "Episode Title",
      "podcast_name": "Podcast Name",
      "episode_artwork": "http://artwork.url",
      "duration": 3600
    },
    "position": 1234,
    "duration": 3600,
    "volume": 0.7
  }
}
```

#### Episode Beaming
```bash
POST /play
```
Send an episode to play:
```json
{
  "episode_id": 123,                    // Optional - for tracking
  "episode_url": "http://audio.url",    // Required - direct audio URL
  "episode_title": "Episode Title",     // Required
  "podcast_name": "Podcast Name",       // Required
  "episode_duration": 3600,             // Required - seconds
  "episode_artwork": "http://art.url",  // Optional
  "start_position": 120                 // Optional - resume position in seconds
}
```

#### Playback Controls
```bash
POST /pause      # Pause playback
POST /resume     # Resume playback
POST /stop       # Stop playback
```

#### Skip Control
```bash
POST /skip
```
```json
{
  "seconds": 15    // Positive = forward, negative = backward
}
```

#### Volume Control
```bash
POST /volume
```
```json
{
  "volume": 0.7    // 0.0 to 1.0
}
```

#### Seek Control
```bash
POST /seek
```
```json
{
  "position": 300  // Seek to position in seconds
}
```

## Using the Test Script

Firewood includes a comprehensive Python test script for discovery and remote control.

### Setup
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Discovery
```bash
# Discover all Firewood players on network
python test_remote_control.py --discover

# Get JSON output for programmatic use
python test_remote_control.py --discover --json
```

### Remote Control
```bash
# Interactive control session
python test_remote_control.py -u http://192.168.1.100:8042 --interactive

# Direct episode beaming
python test_remote_control.py -u http://192.168.1.100:8042 --beam-url http://audio.mp3

# Status check only
python test_remote_control.py -u http://192.168.1.100:8042
```

### Interactive Commands

When in interactive mode, use these commands:

- `s` - Show current playback status
- `p` - Toggle play/pause
- `stop` - Stop playback
- `+15` - Skip forward 15 seconds
- `-15` - Skip backward 15 seconds
- `vol 75` - Set volume to 75%
- `seek 300` - Seek to 5 minutes (300 seconds)
- `beam [URL]` - Beam audio file directly to player
- `play` - Play test episode
- `q` - Quit interactive mode

## Manual Testing with cURL

### Discovery Test
```bash
# Test if Firewood is responding
curl http://192.168.1.100:8042/

# Check current status
curl http://192.168.1.100:8042/status
```

### Episode Beaming Test
```bash
curl -X POST http://192.168.1.100:8042/play \
  -H "Content-Type: application/json" \
  -d '{
    "episode_url": "http://example.com/episode.mp3",
    "episode_title": "Test Episode",
    "podcast_name": "Test Podcast",
    "episode_duration": 1800,
    "start_position": 0
  }'
```

### Control Tests
```bash
# Pause
curl -X POST http://192.168.1.100:8042/pause

# Skip forward 30 seconds
curl -X POST http://192.168.1.100:8042/skip \
  -H "Content-Type: application/json" \
  -d '{"seconds": 30}'

# Set volume to 50%
curl -X POST http://192.168.1.100:8042/volume \
  -H "Content-Type: application/json" \
  -d '{"volume": 0.5}'
```

## Configuration

### Environment Variables

```bash
# Custom port (if not using auto-discovery)
export FIREWOOD_REMOTE_PORT=8080

# Disable remote control entirely
export FIREWOOD_REMOTE_DISABLED=true

# Run Firewood
pinepods_firewood
```

### Network Requirements

- **Same Network**: All devices must be on the same local network
- **mDNS Support**: Network must allow multicast traffic (most home networks do)
- **Firewall**: Allow incoming connections on Firewood ports
- **No VPN Interference**: Some VPNs block local network discovery

## Security Considerations

### Local Network Only
- Beaming only works on local networks (LAN/WiFi)
- mDNS doesn't traverse internet or VPN boundaries
- No external access possible by design

### No Authentication
- Intended for trusted home/office networks
- Any device on network can control Firewood players
- Consider network segmentation for sensitive environments

### CORS Support
- Firewood includes CORS headers for web browser requests
- Enables future web UI integration
- Allows JavaScript-based remote control apps

## Troubleshooting

### Discovery Issues

**No Players Found:**
- Verify Firewood is running and remote control is enabled
- Check devices are on same network/subnet
- Test with direct IP connection: `python test_remote_control.py -u http://IP:8042`
- Check firewall settings (allow port 5353 for mDNS)

**Players Disappear:**
- Normal when Firewood exits (services auto-unregister)
- Network changes can cause temporary disappearance
- Re-run discovery after network changes

### Connection Issues

**Connection Refused:**
- Firewood not running on target device
- Wrong IP address or port
- Firewall blocking connection
- Try different ports: 8042, 8043, 8044

**Timeout Errors:**
- Network congestion or slow connection
- Player busy processing previous request
- Increase timeout in test script

**JSON Parse Errors:**
- Incompatible Firewood version
- Network corruption (rare)
- Try direct cURL test to isolate issue

### Audio Issues

**Episode Won't Play:**
- Invalid audio URL
- Audio format not supported
- Network can't reach audio file
- Check Firewood logs for detailed error

**Playback Stops Unexpectedly:**
- Network interruption to audio source
- Firewood crashed (check logs)
- Audio device issues on Firewood host

## Platform Support

### Firewood Remote Control Server

- **Linux**: Full support
- **macOS Intel**: Full support
- **macOS Apple Silicon**: Currently disabled due to audio library limitations
- **Windows**: Full support (planned)

### Remote Control Clients

- **Any Platform**: Python test script works everywhere
- **Web Browsers**: Ready for integration (CORS enabled)
- **Mobile Apps**: Can use HTTP API directly
- **IoT/Smart Home**: Standard HTTP/JSON integration

## Advanced Features

### Accurate Duration Parsing

Firewood automatically parses accurate episode durations:
1. **HTTP Headers**: Checks for `x-content-duration` header
2. **File Analysis**: Downloads and analyzes audio with Symphonia
3. **Fallback**: Conservative bitrate estimation

This ensures accurate progress tracking and seeking, especially for dynamically-inserted ads.

### Multi-Instance Support

Run multiple Firewood players simultaneously:
- Each gets unique mDNS service name
- Automatic port allocation prevents conflicts
- Control each player independently
- Perfect for multi-room audio setups

### Resume Functionality

Episodes can start at specific positions:
```json
{
  "episode_url": "http://audio.mp3",
  "episode_title": "Episode Title",
  "podcast_name": "Podcast Name",
  "episode_duration": 3600,
  "start_position": 1800  // Resume at 30 minutes
}
```

## Future Web Integration

When implemented in PinePods web UI, you'll have:

### Discovery Integration
- Automatic network scanning for Firewood players
- Player status display in web interface
- Connection health monitoring

### Episode Beaming UI
- "Play on Firewood" buttons on episode pages
- Player selection dropdown/modal
- One-click episode sending

### Remote Control Interface
- Mini player widget when episode is beaming
- Real-time progress sync
- Volume slider and skip controls
- Multi-room control panel

### Smart Features
- Resume position sync between web and Firewood
- Automatic player selection (last used, same room, etc.)
- Queue management across devices

## Best Practices

### Network Setup
- Use reliable WiFi for best experience
- Consider dedicated IoT/media network for multiple players
- Ensure good signal strength to Firewood devices

### Player Management
- Use descriptive hostnames for Firewood devices
- Monitor player health with periodic status checks
- Restart players if they become unresponsive

### Development Integration
- Always use mDNS discovery, never hardcode IPs/ports
- Handle network errors gracefully
- Implement retry logic for transient failures
- Cache discovered players but refresh regularly

---

**Ready to start beaming?** Episode beaming transforms Firewood from a local terminal player into a network-connected audio system that can be controlled from any device. Perfect for home automation, multi-room audio, and seamless podcast listening across your devices!
