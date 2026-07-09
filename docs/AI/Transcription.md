# AI Transcription

With the [AI container](./Setup.md) running, Pinepods can generate a **timecoded transcript**
for any episode using Whisper speech-to-text. This is separate from **built-in** transcripts
that some podcasts publish in their feed — both show up in the same place.

:::note Requires the AI container
Transcription needs `pinepods-ai` running and `PINEPODS_AI_URL` set. Without it, the
transcription controls are hidden. See [Setup](./Setup.md).
:::

## Ways to transcribe

### Manually, per episode

On an episode's page, open the **Transcript** tab and click **Generate with AI**. A job is
queued and you'll see live progress (transcribing a long episode takes a while on CPU). When
it's done, the transcript appears in the tab.

- You don't need to have downloaded the episode first — the server fetches the audio
  temporarily, transcribes it, and cleans up.
- You can **Regenerate** at any time to replace an existing AI transcript.

### Automatically, per podcast

In a podcast's settings, turn on **Auto-transcribe new episodes**. From then on, new
episodes for that podcast are transcribed automatically as they arrive.

- This is **opt-in per podcast** — there is no "transcribe everything" switch.
- It only affects **new** episodes going forward, not your back catalog.

## Reading the transcript

The **Transcript** tab shows the transcript as **timecoded segments**. Each line is
timestamped, and **clicking a timestamp jumps the player** to that point — handy for
skimming or finding a specific moment.

If an episode has both a **built-in** (feed-provided) transcript and an **AI-generated** one,
a small source selector lets you switch between them.

## How it works (and what's shared)

- Transcripts are **content-level**: a given episode is transcribed **once**, and the result
  is shared across everyone subscribed to that feed on your server. It isn't redone per user.
- The transcript is stored in the Pinepods database, so it's instantly available on later
  visits without re-running Whisper.
- Both the full text and per-segment timings are stored, which is what powers the timecoded
  view — and what [ad detection](./AdDetection.md) uses to map detected ads back to precise
  time ranges.

## Choosing a model

The Whisper model is set in **Settings → AI → Models**. Trade-offs:

| Model | Speed | Accuracy | Notes |
| --- | --- | --- | --- |
| `tiny` / `base` | Fastest | Lower | `base` is the default; great for most uses |
| `small` / `medium` | Slower | Higher | Noticeably better on tricky audio |
| `large-v3` | Slowest | Best | Heavy; best with a GPU |

The first time a model is used it downloads automatically and is cached on the `/models`
volume.

## Tips & troubleshooting

- **It's slow.** That's expected on CPU. A one-hour episode can take many minutes. Use a
  smaller model, or a GPU-enabled setup, if speed matters.
- **The button is missing.** The AI container isn't connected — check `PINEPODS_AI_URL` and
  that the sidecar is healthy (Settings → AI shows the connection status).
- **Nothing transcribes automatically.** Auto-transcribe is off by default; enable it per
  podcast.
