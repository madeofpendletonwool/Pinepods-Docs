# Using Clients in Pinepods

[![Discord](https://img.shields.io/badge/discord-join%20chat-5B5EA6)](https://discord.gg/bKzHRa4GNc)
[![Chat on Matrix](https://matrix.to/img/matrix-badge.svg)](https://matrix.to/#/#pinepods:matrix.org)
[![Docker Container Build](https://github.com/madeofpendletonwool/PinePods/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/madeofpendletonwool/PinePods/actions)
[![GitHub Release](https://img.shields.io/github/v/release/madeofpendletonwool/pinepods)](https://github.com/madeofpendletonwool/PinePods/releases)

*Client* in Pinepods refers to an external app that connects to your Pinepods server. The server being hosted via Docker and the client installed generally as an app on your device locally. In fact when you setup Pinepods via docker it technically comes pre-setup with a client. Which is the web version. This page is details on installing clients besides the web version should you choose to. (The mobile apps are HIGHLY recommended if you listen to podcasts on the go)

There's client versions of Pinepods for Linux (Deb, Appimage, Flatpak, AUR, and RPM), Mac, Windows, Android, and iOS. Scroll down for install instructions.

### Linux Client Install :computer:

The Pinepods Linux client is available through multiple distribution methods. Choose the method that works best for your Linux distribution.

#### Quick Install (Recommended)

**Flatpak - Universal Linux Package**

Flatpak works on all major Linux distributions and provides automatic updates.

```bash
# Install Flatpak if not already available
sudo apt install flatpak                    # Debian/Ubuntu
sudo dnf install flatpak                    # Fedora
sudo pacman -S flatpak                      # Arch Linux
sudo zypper install flatpak                 # openSUSE

# Add Flathub repository (if not already added)
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

# Install Pinepods
flatpak install flathub com.gooseberrydevelopment.pinepods

# Run Pinepods
flatpak run com.gooseberrydevelopment.pinepods
```

🔗 **Available at:** https://flathub.org/apps/com.gooseberrydevelopment.pinepods

---

#### Distribution-Specific Installation

**Arch Linux & Arch-based Distros**

Install from the AUR (Arch User Repository):

```bash
# Using yay
yay -S pinepods

# Using paru
paru -S pinepods

# Using makepkg (manual)
git clone https://aur.archlinux.org/pinepods.git
cd pinepods
makepkg -si
```

🔗 **AUR Package:** https://aur.archlinux.org/packages/pinepods

**Debian & Ubuntu**

Download and install the DEB package:

Download the latest deb [here](https://github.com/madeofpendletonwool/PinePods/releases)

```bash

# Install the package
sudo dpkg -i pinepods_amd64.deb

# Fix any dependency issues (if needed)
sudo apt-get install -f

# Run Pinepods
pinepods
```

**Fedora, CentOS, RHEL & openSUSE**

Download and install the RPM package:

Download the latest rpm [here](https://github.com/madeofpendletonwool/PinePods/releases)


```bash
sudo dnf install ./pinepods.rpm

# openSUSE
wget https://github.com/madeofpendletonwool/PinePods/releases/latest/download/pinepods.rpm
sudo zypper install ./pinepods.rpm

# Run Pinepods
pinepods
```

**Linux Mint**

Linux Mint supports both DEB packages and Flatpak:

Download the latest deb [here](https://github.com/madeofpendletonwool/PinePods/releases)


```bash
# Option 1: DEB package (recommended for Mint)
sudo dpkg -i pinepods_amd64.deb
sudo apt-get install -f

# Option 2: Flatpak
flatpak install flathub com.gooseberrydevelopment.pinepods
```

**Elementary OS**

Elementary OS has excellent Flatpak integration:

```bash
# Install via AppCenter (search for "Pinepods") or terminal:
flatpak install flathub com.gooseberrydevelopment.pinepods
```

**Pop!_OS**

Pop!_OS supports both DEB and Flatpak:

Download the latest deb [here](https://github.com/madeofpendletonwool/PinePods/releases)


```bash
sudo dpkg -i pinepods_amd64.deb

# Or via Pop!_Shop (search for "Pinepods")
flatpak install flathub com.gooseberrydevelopment.pinepods
```

**Manjaro Linux**

Manjaro supports AUR packages by default:

```bash
# Using pamac (Manjaro's package manager)
pamac install pinepods

# Or using yay
yay -S pinepods
```

---

#### Universal Methods

**AppImage - Portable Application**

Perfect for any Linux distribution or when you don't have admin privileges:

Download the latest appimage [here](https://github.com/madeofpendletonwool/PinePods/releases)


```bash

# Make it executable
chmod +x pinepods.appimage

# Run it
./pinepods.appimage

# Optional: Integrate with system (creates desktop entry)
./pinepods.appimage --appimage-extract-and-run --appimage-integrate
```

**Manual Download Options**

Visit the releases page for all available formats:
🔗 **GitHub Releases:** https://github.com/madeofpendletonwool/PinePods/releases

---

#### Post-Installation Setup

Once installed through any method:

1. **Launch Pinepods** from your application menu or terminal
2. **Enter your server details:**
   - **Server URL:** The web address where your Pinepods server is hosted (e.g., `https://pinepods.example.com`)
   - **Username:** Your Pinepods username
   - **Password:** Your Pinepods password
3. **Sign in** and start enjoying your podcasts!

### Windows Client Install :computer:

Any of the client additions are super easy to get going. First head over to the releases page on Github

https://github.com/madeofpendletonwool/PinePods/releases

There's a exe and msi windows install file.

The exe will actually start an install window and allow you to properly install the program to your computer.

The msi will simply run a portable version of the app.

Either one does the same thing ultimately and will work just fine.

Once started you'll be able to sign in with your username and password. The server name is simply the url you browse to to access the server.

### Mac Client Install :computer:

Any of the client additions are super easy to get going. First head over to the releases page on Github

https://github.com/madeofpendletonwool/PinePods/releases

There's a dmg and pinepods_mac file.

Simply extract, and then go into Contents/MacOS. From there you can run the app.

The dmg file will prompt you to install the Pinepods client into your applications folder while the _mac file will just run a portable version of the app.

Once started you'll be able to sign in with your username and password. The server name is simply the url you browse to to access the server.

### Android Install :iphone:

<a href="https://apt.izzysoft.de/fdroid/index/apk/com.gooseberrydevelopment.pinepods">
  <img src="https://gitlab.com/IzzyOnDroid/repo/-/raw/master/assets/IzzyOnDroid.png" alt="Get it on IzzyOnDroid" width="200" />
</a>

<a href="https://apps.obtainium.imranr.dev/redirect?r=obtainium://app/%7B%22id%22%3A%22com.gooseberrydevelopment.pinepods%22%2C%22url%22%3A%22https%3A//github.com/madeofpendletonwool/PinePods%22%2C%22author%22%3A%22madeofpendletonwool%22%2C%22name%22%3A%22PinePods%22%2C%22installerUrl%22%3A%22https%3A//github.com/madeofpendletonwool/PinePods/releases/latest%22%7D">
  <img src="https://github.com/madeofpendletonwool/PinePods/raw/main/images/badge_obtainium.png" alt="Get it on Obtainium" width="200" />
</a>

The Android app is now available! You can download it from IzzyOnDroid F-Droid repository or use Obtainium for automatic updates from GitHub releases.

**Installation Options:**

1. **IzzyOnDroid F-Droid Repository (Recommended)**
   - Add the IzzyOnDroid repository to F-Droid if you haven't already
   - Search for "PinePods" and install

2. **Obtainium** 
   - Click the badge above to add PinePods to Obtainium
   - Obtainium will automatically check for and install updates

3. **Direct APK Download**
   - Download the latest APK from [GitHub Releases](https://github.com/madeofpendletonwool/PinePods/releases)
   - Enable "Install from unknown sources" in your device settings
   - Install the APK

The web app also works great for phones. If you sync using Nextcloud you can use the AntennaPods app and your podcasts will sync between AntennaPod and Pinepods.

### iOS Install :iphone:

<a href="https://apps.apple.com/us/app/pinepods/id6751441116">
  <img src="https://github.com/madeofpendletonwool/PinePods/raw/main/images/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg" alt="Download on the App Store" width="200" />
</a>

The iOS app is now available on the App Store! 

**Installation:**

1. **App Store (Recommended)**
   - Search for "PinePods" in the App Store
   - Or click the badge above to go directly to the app page
   - Install and enjoy!

The web app also works great for phones and can be added to your home screen for a native-like experience.

### Firewood (CLI TUI player)

**Pinepods Firewood** is now available! It's a beautiful terminal-based client for power users who prefer command-line interfaces.

**Installation:**

1. **Download from GitHub**
   - Visit the [Pinepods Firewood repository](https://github.com/madeofpendletonwool/pinepods-firewood)
   - Download the latest release for your platform
   - Follow the installation instructions in the repository

2. **Features:**
   - Beautiful terminal user interface (TUI)
   - Full podcast management capabilities
   - Lightweight and fast
   - Perfect for remote servers and headless systems

See the **Firewood** section in the documentation sidebar for detailed installation and usage instructions.


#### Troubleshooting

**Getting Help:**
- 📚 Check our **Troubleshooting** section in the docs sidebar
- 💬 Join our [Discord community](https://discord.com/invite/bKzHRa4GNc)
- 🐛 Report issues on [GitHub](https://github.com/madeofpendletonwool/PinePods/issues)
