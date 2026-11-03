# Setting Up the Mobile App

The Pinepods apps for Android and iOS connect to your own Pinepods server. Your podcasts, progress, queue and settings live on the server, so they're the same as in the web app.

## Installing

- **iOS:** [App Store](https://apps.apple.com/us/app/pinepods/id6751441116).
- **Android:** [Google Play Store](https://play.google.com/store/apps/details?id=com.gooseberrydevelopment.pinepods), [IzzyOnDroid](https://apt.izzysoft.de/fdroid/index/apk/com.gooseberrydevelopment.pinepods), or [Obtainium](https://github.com/madeofpendletonwool/PinePods/releases) to install releases straight from GitHub.

## Signing in

1. Enter the **Server URL**: the address you open Pinepods at in a browser, starting with `http://` or `https://`.
2. Enter your **Username** and **Password** and tap **Connect to PinePods**. If you use [MFA](../tutorial-basics/SettingUpMFA.md), enter the 6-digit **MFA Code** next.

If your server has [OIDC/SSO](../tutorial-extras/OIDC-setup.md) set up, its buttons appear under **Or continue with**.

### Private certificates

If your server uses a self-signed or private certificate, or requires client certificates (mTLS), open **Advanced: Certificates** on the sign-in screen before connecting:

- import your **server CA** so the app trusts the server's certificate;
- import a **client certificate** (a `.p12` or `.pfx` file) and its **Certificate password** for mTLS.

The same options are in the app's **Settings → Certificates** later.

## App settings

The app's own **Settings** hold choices that apply to this device:

| Group | Settings |
|---|---|
| **Personalisation** | Theme (shared with your account, see [Themes](../tutorial-basics/Theming.md)), **Show my Gravatar**, **Artwork colours** and the card style. |
| **Navigation** | **Reorganize Bottom Bar** to choose and order the bottom navigation items. |
| **Playback** | **Full screen player mode on episode start**, **Fast-forward interval** (10–60 s) and **Rewind interval** (5–45 s), **Search provider**. |
| **Download Management** | WiFi-only, server-copy downloads, queue auto-download, mirroring and cleanup. See [Downloads](../Features/Downloads.md#device-downloads-mobile). |
| **Server Downloads** | Your defaults for cleaning up server downloads. |
| **Debug** | **App Logs** with debug logs and device information, useful for bug reports. |
| **Certificates** | Server CA and client certificate, as above. |

More mobile pages: [CarPlay](./CarPlay.md), [Android Auto](./AndroidAuto.md), [Offline Action Queue](./OfflineQueue.md).
