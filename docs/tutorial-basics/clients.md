# Using Clients in Pinepods

[![Discord](https://img.shields.io/badge/discord-join%20chat-5B5EA6)](https://discord.gg/bKzHRa4GNc)
[![Chat on Matrix](https://matrix.to/img/matrix-badge.svg)](https://matrix.to/#/#pinepods:matrix.org)
[![Docker Container Build](https://github.com/madeofpendletonwool/PinePods/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/madeofpendletonwool/PinePods/actions)
[![GitHub Release](https://img.shields.io/github/v/release/madeofpendletonwool/pinepods)](https://github.com/madeofpendletonwool/PinePods/releases)

*Client* in Pinepods refers to an external app that connects to your Pinepods server. The server being hosted via Docker and the client installed generally as an app on your device locally. In fact when you setup Pinepods via docker it technically comes pre-setup with a client. Which is the web version. This page is details on installing clients besides the web version should you choose to. (The mobile apps are HIGHLY recommended if you listen to podcasts on the go)

There are Pinepods apps for Linux (deb, rpm, AppImage, Flatpak, AUR), Windows, macOS, Android and iOS, plus Firewood for the terminal. Mobile setup is covered in [Setting Up the Mobile App](../Mobile/SettingUpMobileApp.md).

### Desktop apps :computer:

The desktop apps for Linux, Windows and macOS are on the [releases page](https://github.com/madeofpendletonwool/PinePods/releases/latest). For 0.9.0 these are:

| Platform | Files |
|---|---|
| **Linux** | `Pinepods_<version>_amd64.deb` / `_arm64.deb` (Debian, Ubuntu, Mint, Pop!_OS), `Pinepods-<version>-1.x86_64.rpm` / `.aarch64.rpm` (Fedora, openSUSE), `Pinepods_<version>_amd64.AppImage` / `_aarch64.AppImage` (any distribution) |
| **Windows** | `Pinepods_<version>_x64-setup.exe` or `Pinepods_<version>_x64_en-US.msi`; both install the app, use whichever your system prefers |
| **macOS** | `Pinepods_<version>_aarch64.dmg`, for Apple Silicon Macs. Open it and drag Pinepods to Applications |

Linux also has:

- **Flatpak** ([Flathub](https://flathub.org/apps/com.gooseberrydevelopment.pinepods)): `flatpak install flathub com.gooseberrydevelopment.pinepods`
- **AUR** ([pinepods](https://aur.archlinux.org/packages/pinepods)): `yay -S pinepods` or `paru -S pinepods`

For an AppImage, make it executable first: `chmod +x Pinepods_*.AppImage`.

When the app starts, enter your **Server URL** (the address you open Pinepods at in a browser), your username and your password. The app stays signed in after that.

#### Signing in with OIDC

If your server has [OIDC providers](../tutorial-extras/OIDC-setup.md), their buttons appear under the sign-in form once you've typed the server URL. Clicking one opens the provider's sign-in page in your normal web browser (providers such as Google refuse to sign in inside an app window). When you finish there, the browser asks to open Pinepods; allow it and the app signs you in. While you're in the browser the app shows a **Cancel sign-in** link if you change your mind.

No provider setup is needed beyond what the web app uses: the provider still returns to your server's `/api/auth/callback`, and the server hands the sign-in back to the app through a `pinepods://` link. Opening that link is set up when you install the app:

- **macOS**: when Pinepods is in Applications (or anywhere, as an app bundle).
- **Windows**: by the installer (`.exe` or `.msi`), and again by the app each time it starts.
- **Linux**: by the `.deb` and `.rpm` packages; an AppImage registers itself when it first runs.

If the browser says it can't open the link, sign in with a username and password instead, and attach the app's log (below) when reporting it.

The desktop app can also save episodes to your computer for offline listening; see [Downloads](../Features/Downloads.md#desktop-app).

Other things the desktop app does:

- **Keeps running in the tray**: closing the window hides it and playback carries on. The tray icon (menu bar on macOS) has **Show Pinepods**, **Play** / **Pause**, **Back 15 seconds**, **Forward 15 seconds**, **Mini player** and **Quit Pinepods**, and its tooltip shows what's playing. On macOS, clicking the Dock icon brings the window back. Turn this off under **Settings → Desktop app → Window and startup** to have closing the window quit the app.
- **Starts with your computer** if you turn on **Start with your computer** in the same place. It starts in the tray, without a window.
- **Mini player**: a small window with the player that stays on top of other windows, with the next few episodes in your queue. Open it from the tray or from **Settings → Desktop app**.
- **Media keys and system controls**: play/pause and skip keys, the macOS Now Playing widget, the Windows media overlay and the Linux media controls (MPRIS) all control the player.
- **Podcast links**: clicking a `podcast://`, `itpc://` or `pinepods-subscribe://` link on a website opens the podcast in Pinepods, ready to subscribe. The installer makes Pinepods the handler for these links; if you use another podcast app for `podcast://` links, your system's default-apps settings decide which one opens.
- **Drop an OPML file** on the window to import the subscriptions in it. The import page opens with the podcasts listed for you to confirm.
- **Notifications** for new episodes and finished downloads, off until you turn them on under **Settings → Desktop app → Notifications**. New episodes are checked every 15 minutes while the app is running.
- **Updates itself** on macOS, Windows and with the AppImage: when a new version is out, a prompt offers **Install and restart**. **Settings → Desktop app → Updates** turns the check off or checks right away. The `.deb`, `.rpm`, Flatpak and AUR packages are updated by your package manager instead.
- **Keeps your login in the system keychain** (macOS Keychain, Windows Credential Manager, or the Secret Service, such as GNOME Keyring or KWallet, on Linux). Where none is available it falls back to a file only your user can read. Logins saved by earlier versions move into the keychain automatically. Set `PINEPODS_CREDENTIALS=file` to always use the file, for example for a portable setup.
- **One window**: opening Pinepods again brings the running app forward instead of starting a second copy.
- **Window size and position** are remembered between launches.

#### Desktop app log

When reporting a problem with the desktop app, attach its log, `Pinepods.log`:

| System | Log folder |
|---|---|
| Linux | `~/.local/share/com.gooseberrydevelopment.pinepods/logs` |
| macOS | `~/Library/Logs/com.gooseberrydevelopment.pinepods` |
| Windows | `%LOCALAPPDATA%\com.gooseberrydevelopment.pinepods\logs` |

### Android Install :iphone:

The native Android app is available now, with Android Auto support!

- ▶️ [Google Play Store](https://play.google.com/store/apps/details?id=com.gooseberrydevelopment.pinepods) — the easiest way to install and stay updated
- 📱 [IzzyOnDroid](https://apt.izzysoft.de/fdroid/index/apk/com.gooseberrydevelopment.pinepods) — install and update through the IzzyOnDroid F-Droid repo
- 🔄 [Obtainium](https://github.com/madeofpendletonwool/PinePods/releases) — track GitHub Releases for automatic updates
- 📦 Direct APK from [GitHub Releases](https://github.com/madeofpendletonwool/PinePods/releases): `pinepods-arm64-<version>.apk` for most phones, `pinepods-armeabi-…` for older 32-bit ones, `pinepods-x86_64-…` for emulators and x86 devices

### iOS Install :iphone:

The native iOS app is on the [App Store](https://apps.apple.com/us/app/pinepods/id6751441116), with CarPlay support!

Search for "Pinepods" in the App Store or use the link above to install.

### Firewood (terminal) :computer:

[Firewood](https://github.com/madeofpendletonwool/pinepods-firewood) is a Pinepods client for the terminal, and can also run headless as a player your other apps send episodes to. See [Installing Firewood and Signing In](../Firewood%20CLI/LoginPinepodsFirewood.md).

#### Troubleshooting

**Getting Help:**
- 📚 Check our **Troubleshooting** section in the docs sidebar
- 💬 Join our [Discord community](https://discord.com/invite/bKzHRa4GNc)
- 🐛 Report issues on [GitHub](https://github.com/madeofpendletonwool/PinePods/issues)
