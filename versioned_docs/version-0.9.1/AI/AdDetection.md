# AI Ad Detection

Ad detection (sometimes called "ad removal") uses a language model to find **host-read ads
and sponsor segments** in an episode's transcript, then lets the player **automatically skip
past them** during playback. Nothing is cut from the audio file — detected ads are stored as
**skip ranges**, so it's non-destructive and reversible.

:::note Requires the AI container **and** a language model
Ad detection needs [the AI container](./Setup.md) plus an ad-detection LLM configured in
**Settings → AI**. Unlike transcription (which has a sensible default), ad detection has
**no default model** — you must pick one first. See [Setup → Pull a model](./Setup.md#pull-a-model).
:::

## How it works

```
transcript  ──►  LLM labels ad spans  ──►  mapped to time ranges  ──►  player skips them
```

1. Ad detection reads the episode's **transcript** (so the episode must be transcribed
   first — if it isn't, Pinepods transcribes it automatically as part of the job).
2. The transcript is sent to the configured **LLM**, which labels which parts are ads.
3. Those are mapped back to precise **audio time ranges** using the transcript's timings and
   stored as **ad skip segments**.
4. During playback, clients **seek past** any active ad segment.

Because detection works from the transcript, results are approximate to within a few seconds
(the boundary of a spoken segment) — which is why skipping, rather than cutting, is the right
model, and why you can review and correct results (below).

## Turning it on

### Manually, per episode

On an episode's **Transcript** tab, click **Detect ads with AI**. The job runs (transcribing
first if needed) and detected ads then appear in the tab for review.

### Automatically, per podcast

In a podcast's settings:

1. Enable **Auto-transcribe new episodes** (ad detection needs a transcript).
2. Enable **Auto-detect ads on new episodes** — this option **unlocks only when
   auto-transcribe is on**.
3. Choose how detected ads behave:
   - **Skip detected ads automatically** — ads are skipped as soon as they're found.
   - **Require confirmation first** — ads are found but **not** skipped until you confirm
     them on the episode page.

## Reviewing detected ads

Open the episode's **Transcript** tab. Detected ad ranges are **highlighted** in the
transcript, and a **Detected ads** list shows each range with **Confirm** / **Deny** buttons:

- **Confirm** — keep skipping this ad.
- **Deny** — a false positive; stop skipping it (you'll hear it).

Each row shows whether it's currently **Skipping** or **Kept**.

:::info Reviews are per-user
Detection runs **once per episode** and the ad ranges are shared across everyone subscribed
to that feed. But whether an ad is skipped — including your **Confirm/Deny** choices and the
auto-skip-vs-confirm setting — is **per user**. Your decisions never affect anyone else on
the server.
:::

## Choosing the model

Set this in **Settings → AI → Ad-detection model**:

- **Local (bundled)** — runs entirely on your server. Fully private, but **slow on CPU** and
  needs a 2–4 GB model file and matching RAM. Good default choice for pull:
  `Qwen/Qwen2.5-3B-Instruct-GGUF` → `qwen2.5-3b-instruct-q4_k_m.gguf`.
- **Remote (OpenAI-compatible)** — point at an external endpoint such as
  [Ollama](https://ollama.com/) or an OpenAI-style cloud API. Usually **much faster**.
- **Remote (Anthropic-compatible)** — point at an [Anthropic Messages
  API](https://docs.anthropic.com/en/api/messages) endpoint (Anthropic itself, or providers
  that expose that format).

:::warning Remote endpoints send transcript text out
With either remote option, the episode's **transcript text is sent to that service**. Local
keeps everything on your server.
:::

### Example: z.ai (GLM models)

[z.ai](https://z.ai/) sells GLM access in two forms, and they use **different** endpoints:

| Your z.ai plan | Backend | Endpoint URL | Model |
| --- | --- | --- | --- |
| **GLM Coding Plan** (subscription) | **Remote (Anthropic-compatible)** | `https://api.z.ai/api/anthropic` | `glm-4.6` |
| **General API** (pay-as-you-go balance) | **Remote (OpenAI-compatible)** | `https://api.z.ai/api/paas/v4` | `glm-4.5` |

If you have the **Coding Plan**, you *must* use the Anthropic-compatible backend — the
OpenAI-style `paas/v4` API returns "insufficient balance" because the plan's quota lives on
the Anthropic endpoint. Put your z.ai API key in the **API key** field either way.

Ad detection just classifies transcript text, so a cheaper/faster model tier is usually
plenty — you don't need a provider's largest model.

See [Setup](./Setup.md#3-the-ai-settings-page) for how to pull a local model or configure a
remote endpoint.

## Client support

| Client | Ad skipping |
| --- | --- |
| **Web** | ✅ Supported |
| **Mobile (iOS/Android)** | ⏳ Not yet — planned in a future update |

Detection and review happen on the server and in the web app today. Mobile skipping is on the
roadmap.

## Accuracy expectations

LLM ad detection is good but not perfect — host-read sponsorships blend into normal content,
and boundaries land on spoken-segment edges (a few seconds of precision). That's exactly why
Pinepods gives you **per-user Confirm/Deny** and a **"require confirmation first"** mode:
treat auto-skip as a helpful default you can correct, not a guarantee.

## Troubleshooting

- **"Ad removal: Not configured".** You haven't chosen an ad-detection model yet. Pull a
  local model or configure a remote endpoint in Settings → AI, then Save.
- **The Detect ads button is missing.** The AI container isn't connected (check
  `PINEPODS_AI_URL`).
- **Auto-detect can't be enabled.** Turn on **Auto-transcribe** for that podcast first.
- **It's very slow / high memory.** Local CPU inference on a multi-GB model is demanding.
  Prefer a remote (e.g. GPU-backed Ollama) endpoint for speed.
