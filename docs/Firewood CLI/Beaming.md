# Remote Control and Headless Mode

Firewood is a device like any other Pinepods app: your other devices can see what it's playing and control it, and it can control them. See [Playing on Other Devices](../Features/RemoteDevices.md) for how this works across Pinepods.

## Remote control

Firewood keeps a connection to your Pinepods server, and the server passes commands between your devices. Nothing listens on your network.

- Other devices list it as `Firewood · <hostname>`. Change the name under **Name on other devices** in Settings.
- The **Devices** page lists your other players with what they're playing. Control them from there, or press **o** on an episode to play it on one.
- The web and mobile apps can send episodes to Firewood and control it, or take what it's playing with **Play here**.
- `FIREWOOD_REMOTE_DISABLED=1` turns the connection off.

If the Devices page says the server has no now-playing socket, either the server is too old to have it, or a reverse proxy in front of Pinepods isn't passing WebSocket upgrades on `/ws/api/`.

## Headless mode

`pinepods_firewood --headless` runs the player and remote control without the terminal interface. Use it to turn a Raspberry Pi, a speaker box or a spare computer into a player your other apps send episodes to. Progress syncs as usual, and when an episode ends the next one in your queue plays.

It signs in with the session saved by running `pinepods_firewood` once in a terminal, or with these environment variables, which take precedence:

| Variable | |
|---|---|
| `FIREWOOD_SERVER` | The server's URL. |
| `FIREWOOD_API_KEY` | An API key, from **Settings → API Keys** in the web app. |
| `FIREWOOD_API_KEY_FILE` | A file holding the API key, instead of `FIREWOOD_API_KEY`. |

Headless Firewood keeps retrying until the network and the server are up, so it can start before them; a key the server rejects stops it. It logs to stderr as well as the log file, and saves the position and exits on SIGTERM, SIGINT or SIGHUP. Volume, audio output and device name come from the same settings as the terminal interface.

To start it at boot or login, use the systemd user unit in [`pkg/systemd/`](https://github.com/madeofpendletonwool/pinepods-firewood/tree/main/pkg/systemd) or the launchd agent in [`pkg/launchd/`](https://github.com/madeofpendletonwool/pinepods-firewood/tree/main/pkg/launchd); each file explains how to install it. On a machine where a service can't unlock the keyring, give it a key file rather than relying on the saved session.
