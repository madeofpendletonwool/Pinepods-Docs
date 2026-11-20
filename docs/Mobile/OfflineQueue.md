# Offline Action Queue (Mobile)

You can listen to downloaded episodes on your phone without a connection. What you do meanwhile isn't lost: listening progress, finishing an episode, saving, queueing and history are stored on the phone and sent to your server once it's reachable again. The app tries on start-up, when the connection comes back, and after each new action.

Listening progress is kept as one entry per episode, with the time you listened. When it is sent later, the server treats it as having happened then, so it never overwrites something newer from another device. See [Listening Progress](../Features/ListeningProgress.md).

## Seeing what's waiting

On the **Downloads** screen, the action queue button shows how many actions are waiting (**Action queue (N pending)**). Tap it to open **Action Queue** and see each one. When everything has gone through it says **Everything is synced**.

To listen offline, download episodes first. See [Downloads](../Features/Downloads.md#device-downloads-mobile).
