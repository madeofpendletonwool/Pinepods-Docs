# Listening Progress

Pinepods remembers where you are in every episode and how long you have listened. Every app signed in to your account (web, desktop, mobile) shares it: stop on one, pick up on another.

## Where an episode resumes

An episode starts from the place you most recently left it, on whichever device that was. That includes going backwards: if you rewind, scrub back or start an episode over, that is where the next device resumes too.

When two devices disagree, the one you used most recently wins. The server works that out from how long ago each device saw its position, not from the devices' clocks, so a phone or computer with the wrong time doesn't matter.

An episode left at its very end starts again from the beginning.

## When progress is saved

While an episode plays, its position is saved every 30 seconds. It is also saved straight away when you:

- pause, from the app or from anywhere else (headphones, the lock screen, a car, an incoming call),
- skip or seek,
- reach the end,
- switch to another episode,
- close the tab or the app.

Nothing is sent while playback is paused.

If the server can't be reached, progress is kept on the device and sent when it can be. Listening done offline hours ago doesn't overwrite something you have done on another device since: it is recorded as of the time you listened. On mobile you can see what is waiting in the [action queue](../Mobile/OfflineQueue.md).

## Finished episodes

An episode is marked completed when it plays to the end, or within your **auto complete** time of the end if you set one. You can also mark it by hand.

Playing a completed episode again keeps it marked completed while its position follows the replay, so you can stop and resume partway through. Mark it as not completed to reset it.

## Listening time

**Time Listened** and the listening figures on the [statistics page](Statistics.md) count time audio was actually playing. Paused time, skipping ahead and marking an episode as played add nothing, and rewinding takes nothing away.

Statistics from before this was introduced were estimated from episode positions and are kept as they were.

## Older apps

Apps released before this change (0.9.2 and earlier) keep working with a newer server:

- Their progress still moves forward as before, and a rewind on one is kept as long as no other device has saved a position in between.
- A paused old app no longer adds listening time or overwrites a newer position.
- An old app that comes back online with a position saved while it was offline can still move an episode forward past a rewind made elsewhere in the meantime. Updating the app fixes this.

Newer apps also work with an older server, using the earlier behaviour.

## Other podcast apps

With [Podcast Sync](../tutorial-extras/gpodder-sync.md) on, positions reach AntennaPod, gPodder and Nextcloud the same way, rewinds included.
