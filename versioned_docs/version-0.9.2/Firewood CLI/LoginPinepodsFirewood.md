# Installing Firewood and Signing In

[Firewood](https://github.com/madeofpendletonwool/pinepods-firewood) is a terminal client for Pinepods: browse your library, play episodes and keep your progress in sync, from a terminal.

## Installing

:::caution
The only published release, 0.1.0, is older than most of what these pages describe, including remote control, headless mode, cover art and the command palette. Until a newer release is out, [build from source](#building-from-source) to get them.
:::

**Install script** (Linux, macOS, and Windows through Git Bash or WSL). It downloads the latest release for your platform and installs it to `/usr/local/bin`, or `~/bin` if that isn't writable:

```bash
curl -sSL https://raw.githubusercontent.com/madeofpendletonwool/pinepods-firewood/main/install.sh | bash
```

**Release downloads** from [GitHub Releases](https://github.com/madeofpendletonwool/pinepods-firewood/releases/latest): `pinepods-firewood-linux-amd64.tar.gz`, `pinepods-firewood-linux-arm64.tar.gz`, `pinepods-firewood-macos-arm64.tar.gz` and a `.deb` for Debian and Ubuntu.

### Building from source

You need a Rust toolchain and, on Linux, the ALSA and OpenSSL development packages:

```bash
# Debian/Ubuntu
sudo apt install pkg-config libasound2-dev libssl-dev
# Fedora
sudo dnf install pkg-config alsa-lib-devel openssl-devel
# Arch
sudo pacman -S pkg-config alsa-lib openssl
# macOS
brew install pkg-config
```

```bash
git clone https://github.com/madeofpendletonwool/pinepods-firewood.git
cd pinepods-firewood
cargo build --release
sudo cp target/release/pinepods_firewood /usr/local/bin/
```

## Signing in

Run `pinepods_firewood`. The first time, it asks for:

1. **Server URL:** the address you open Pinepods at, including `http://` or `https://`.
2. **Username and password.** **F1** shows the password as you type. If you sign in to Pinepods through OIDC/SSO, press **F2** and paste an API key instead; make one in the web app under **Settings → API Keys** ([API Keys](../tutorial-basics/adding-an-api-key.md)).
3. **MFA code**, if your account uses [MFA](../tutorial-basics/SettingUpMFA.md).
4. **Timezone and date/time format**, if your account doesn't have them yet. Type to search the time zones.

Every key you type goes into the fields, so use **Ctrl+C** to quit the sign-in screen.

Firewood remembers the session: the server address is saved in `~/.config/pinepods-firewood` and the API key in your operating system's keychain.

## Troubleshooting

- **Can't sign in:** check the server URL includes `http://` or `https://` and opens in a browser from the same machine.
- **"ALSA lib" errors on Linux:** install the ALSA package listed above.
- **Logs:** a daily log file under `~/.local/share/pinepods-firewood/logs` (Linux) or `~/Library/Application Support/pinepods-firewood/logs` (macOS), kept for a week. `FIREWOOD_LOG=debug` logs more.

Next: [Using Firewood](./UsingPinepodsFirewood.md).
