# Using Clients in Pinepods

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

```bash
# Download the latest DEB package
wget https://github.com/madeofpendletonwool/PinePods/releases/latest/download/pinepods_amd64.deb

# Install the package
sudo dpkg -i pinepods_amd64.deb

# Fix any dependency issues (if needed)
sudo apt-get install -f

# Run Pinepods
pinepods
```

**Fedora, CentOS, RHEL & openSUSE**

Download and install the RPM package:

```bash
# Fedora/CentOS/RHEL
wget https://github.com/madeofpendletonwool/PinePods/releases/latest/download/pinepods.rpm
sudo dnf install ./pinepods.rpm

# openSUSE
wget https://github.com/madeofpendletonwool/PinePods/releases/latest/download/pinepods.rpm  
sudo zypper install ./pinepods.rpm

# Run Pinepods
pinepods
```

**Linux Mint**

Linux Mint supports both DEB packages and Flatpak:

```bash
# Option 1: DEB package (recommended for Mint)
wget https://github.com/madeofpendletonwool/PinePods/releases/latest/download/pinepods_amd64.deb
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

```bash
# DEB package (native integration)
wget https://github.com/madeofpendletonwool/PinePods/releases/latest/download/pinepods_amd64.deb
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

```bash
# Download the AppImage
wget https://github.com/madeofpendletonwool/PinePods/releases/latest/download/pinepods.appimage

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

#### Troubleshooting

**Common Issues:**

- **"Command not found"**: Try running with the full path or restart your terminal
- **Permission denied**: Ensure the AppImage is executable (`chmod +x pinepods.appimage`)
- **Missing dependencies**: Use your package manager to install any missing libraries
- **Flatpak issues**: Ensure Flathub is added as a remote repository

**Getting Help:**
- 📚 Check our [Troubleshooting](/docs/Troubleshooting) section
- 💬 Join our [Discord community](https://discord.com/invite/bKzHRa4GNc)
- 🐛 Report issues on [GitHub](https://github.com/madeofpendletonwool/PinePods/issues)

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

The dmg file will prompt you to install the Pinepods client into your applications fileter while the _mac file will just run a portable version of the app. 

Once started you'll be able to sign in with your username and password. The server name is simply the url you browse to to access the server.

### Android Install :iphone:

The Android client is currently in **internal testing**! 

📱 [Join the Beta Testing Program](/internal-testing) to get early access to the native Android app.

In the meantime, the web app works great for phones. Otherwise, if you sync using Nextcloud you can use the AntennaPods app and your podcasts will sync between AntennaPod and Pinepods.

### iOS Install :iphone:

The iOS client is currently in **internal testing**!

🍎 [Join the Beta Testing Program](/internal-testing) to get early access to the native iOS app via TestFlight.

The web app works great for phones and can be added to your home screen for a native-like experience.

### Firewood (CLI TUI player)

Pinepods also includes a terminal-based client called Firewood. See the **Firewood** section in the documentation sidebar for detailed installation and usage instructions.