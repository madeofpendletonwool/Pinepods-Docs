# AI Features Overview

Pinepods has an **optional** set of AI features that run in a separate, self-hosted
container called **`pinepods-ai`**. Today they cover:

- **Transcription** — turn an episode's audio into a searchable, timecoded transcript
  using [Whisper](https://github.com/openai/whisper) speech-to-text.
- **Ad detection ("ad removal")** — use a language model to find host-read ads and
  sponsor segments in an episode's transcript, then let the player automatically skip
  past them.

Both are modeled on the "optional sidecar" pattern (similar to Immich's machine-learning
container): a stand-alone service that the main Pinepods server talks to over HTTP.

:::note Everything here is optional and off by default
If you don't run the `pinepods-ai` container (and set `PINEPODS_AI_URL`), none of these
features appear — Pinepods works exactly as before. Nothing is ever transcribed or scanned
for ads unless **you opt in**, either per-podcast or per-episode.
:::

## How it fits together

```
┌────────────┐        ┌──────────────────┐        ┌───────────────┐
│  Pinepods  │  HTTP  │   pinepods-ai    │        │  Model files  │
│  server    │ ─────► │  (Whisper + LLM) │ ◄────► │  /models vol  │
└────────────┘        └──────────────────┘        └───────────────┘
       ▲                        │
       │ shared, read-only      │ reads downloaded audio
       └── downloads volume ────┘
```

- The **Pinepods server** decides *what* to process and stores the results (transcripts,
  ad time-ranges) in its own database.
- The **`pinepods-ai` container** is stateless. It loads the models you've chosen, reads
  audio from a shared read-only mount of your downloads directory, and returns results.
- **Models** (Whisper weights, local LLM files) live on a persistent `/models` volume so
  they aren't re-downloaded on every restart.

## What you'll need

- The **`pinepods-ai` container** running and reachable from the main server
  (see [Setup](./Setup.md)).
- For **transcription**: nothing extra — a sensible Whisper model (`base`) is the default
  and downloads automatically on first use.
- For **ad detection**: a language model. You either **pull a small local model** into the
  container, or point it at a **remote OpenAI-compatible endpoint** (for example
  [Ollama](https://ollama.com/)). See [Ad Detection](./AdDetection.md).

## Privacy & data

The AI container is **fully self-hosted** by default — audio and transcripts never leave
your server. The only exception is if *you* deliberately configure a **remote** LLM
endpoint for ad detection that points at an external service; in that case transcript text
is sent to whatever endpoint you configured.

## A note on performance

These features are CPU-heavy. On a typical CPU-only host, transcribing a one-hour episode
can take **many minutes**, and local ad detection adds an LLM pass on top of that. This is
normal. If you have a GPU or an existing [Ollama](https://ollama.com/) server, you can make
things dramatically faster — see [Setup](./Setup.md).

## Next steps

- **[Setup](./Setup.md)** — deploy the container, environment variables, and the AI
  Settings page.
- **[Transcription](./Transcription.md)** — generate and read transcripts.
- **[Ad Detection](./AdDetection.md)** — detect and skip ads.
