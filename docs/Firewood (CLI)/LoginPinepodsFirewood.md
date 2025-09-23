# Firewood Setup and Login Guide

A comprehensive guide to getting started with PinePods Firewood - your terminal-based podcast client.

## Prerequisites

**PinePods Server Required**: Firewood is a client application that connects to a PinePods server. You'll need a running PinePods server to use Firewood.

### Setting Up PinePods Server

If you don't have a PinePods server yet, visit **[pinepods.online](https://pinepods.online)** for complete installation instructions. PinePods can be deployed via:

- Docker (recommended)
- Native installation
- Cloud hosting services
- Self-hosted solutions

**Note**: Make sure your PinePods server is accessible from the device where you'll run Firewood.

## Installing Firewood

### Quick Install (Recommended)

**One-liner installer** for Linux/macOS/Windows:
```bash
curl -sSL https://raw.githubusercontent.com/madeofpendletonwool/pinepods-firewood/main/install.sh | bash
```

### Alternative Installation Methods

**Package Managers:**
```bash
# Homebrew (macOS/Linux)
brew install pinepods-firewood

# Cargo (Rust)
cargo install pinepods-firewood

# Arch Linux (AUR)
yay -S pinepods-firewood
```

**Manual Download:**
- Download pre-built binaries from [GitHub Releases](https://github.com/madeofpendletonwool/pinepods-firewood/releases/latest)
- Extract and place in your PATH

For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md).

## First Launch Setup

### 1. Start Firewood

```bash
pinepods_firewood
```

### 2. Server Configuration

When you first launch Firewood, you'll be prompted to configure your connection:

**Server URL**: Enter your PinePods server URL
- Include the protocol: `http://` or `https://`
- Examples:
  - `https://mypinepods.com`
  - `http://192.168.1.100:8080`
  - `http://localhost:8032`

**Port**: If your server runs on a non-standard port, include it in the URL.

### 3. Authentication

**Username and Password**: Enter your PinePods account credentials
- These are the same credentials you use for the PinePods web interface
- Credentials are securely stored locally for future sessions

**Multi-Factor Authentication (MFA)**: If enabled on your account:
- Enter your MFA code when prompted
- Firewood supports TOTP-based MFA (Google Authenticator, Authy, etc.)

### 4. Timezone Selection

**Choose Your Timezone**: Select your local timezone for accurate episode timestamps
- Use arrow keys to navigate the timezone list
- Press Enter to confirm your selection
- This affects how episode publication dates and times are displayed

### 5. Session Persistence

Firewood automatically saves your login session:
- **Automatic Login**: Future launches will skip the login process
- **Secure Storage**: Credentials are encrypted and stored locally
- **Session Refresh**: Tokens are automatically refreshed as needed

## Login Process

### Standard Login Flow

1. **Launch**: Run `pinepods_firewood`
2. **Server URL**: Enter your PinePods server address
3. **Credentials**: Provide username and password
4. **MFA** (if enabled): Enter your authentication code
5. **Timezone**: Select your preferred timezone
6. **Success**: You'll be taken to the Home screen

### Session Management

**Automatic Login**: If you have a saved session:
- Firewood will attempt to use stored credentials
- If successful, you'll go straight to the main interface
- If expired, you'll be prompted to log in again

**Manual Logout**: To clear stored credentials:
- Navigate to Settings (when implemented)
- Or delete the config file: `~/.config/pinepods-firewood/`

### Troubleshooting Login Issues

**Connection Failed:**
- Verify server URL is correct and accessible
- Check if server is running and reachable
- Ensure no firewall is blocking the connection

**Authentication Failed:**
- Double-check username and password
- Verify MFA code is correct and not expired
- Ensure your account is active on the PinePods server

**Session Expired:**
- Simply re-enter your credentials
- Check if your account permissions have changed
- Restart Firewood if issues persist

**Network Issues:**
- Test server connectivity: `curl http://your-server-url/api/health`
- Check DNS resolution
- Verify SSL certificates (for HTTPS connections)

## Security Notes

**Local Storage**:
- Credentials are encrypted using system keychain/credential store
- Config files are stored in: `~/.config/pinepods-firewood/`
- No passwords are stored in plain text

**Network Security**:
- Use HTTPS when possible for encrypted communication
- Firewood respects server SSL certificates
- MFA provides additional account protection

**Permissions**:
- Firewood only requires network access for server communication
- No elevated system permissions needed
- Audio permissions for playback functionality

## Next Steps

Once logged in successfully:

1. **Explore the Interface**: Navigate using Tab or number keys (1-9)
2. **Browse Podcasts**: Check your subscriptions in the Podcasts tab
3. **Recent Episodes**: View latest content in the Episodes tab
4. **Start Listening**: Select an episode and press Enter to play

For detailed usage instructions, see the [User Guide](USER_GUIDE.md).

## Quick Reference

**Navigation:**
- `Tab` - Switch between tabs
- `1-9` - Jump to specific tabs
- `q` - Quit application
- `Ctrl+C` - Force quit

**Help:**
- Run `pinepods_firewood --help` for command-line options
- Check [GitHub Issues](https://github.com/madeofpendletonwool/pinepods-firewood/issues) for support

---

**Ready to start listening?** Follow this guide to get connected to your PinePods server and begin enjoying your podcasts from the terminal!
