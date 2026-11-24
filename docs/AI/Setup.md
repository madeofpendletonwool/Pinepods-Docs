# Setting Up the AI Container

The AI features run in the optional **`pinepods-ai`** container. This page covers deploying
it, the environment variables, and the **AI Settings** page where you choose and manage
models at runtime.

## Which image?

The AI container comes in two flavours. Pick one; everything else on this page is the same.

| Image tag | Use it when | Platforms | Size |
| --- | --- | --- | --- |
| `latest` / `<version>` | No NVIDIA GPU (most setups). Transcription and ad detection run on the CPU. | amd64, arm64 | Regular |
| `latest-cuda` / `<version>-cuda` | You have an NVIDIA GPU and want fast transcription. Adds the CUDA libraries Whisper needs. | amd64 only | Several GB larger |

The CUDA libraries are large, so they live only in the `-cuda` image and the regular image
stays small. See [GPU acceleration](#gpu-acceleration) for the extra settings the `-cuda`
image needs.

## 1. Run the `pinepods-ai` container

The container is disabled by default in every deployment method. You enable it by:

1. Running the `pinepods-ai` service, and
2. Setting **`PINEPODS_AI_URL`** on the **main Pinepods server** so it knows where to reach it.

The container needs **read-only** access to the **same downloads directory** the main
server writes to, mounted at the **same path** (so file paths resolve on both sides).

### Docker Compose

The bundled compose files ship with a commented-out `pinepods-ai` service and the
`PINEPODS_AI_URL` variable. Uncomment both. A minimal example:

```yaml
services:
  pinepods:
    environment:
      # Point the main server at the AI sidecar
      PINEPODS_AI_URL: "http://pinepods-ai:8100"
      # Optional shared secret — must match the sidecar's PINEPODS_AI_TOKEN if set
      # PINEPODS_AI_TOKEN: "a-long-random-string"
    # ...

  pinepods-ai:
    image: madeofpendletonwool/pinepods-ai:latest   # :latest-cuda for an NVIDIA GPU
    environment:
      WHISPER_DEVICE: "cpu"          # "cuda" with the :latest-cuda image
      WHISPER_COMPUTE_TYPE: "int8"   # "float16" on a GPU
      # PINEPODS_AI_IDLE_UNLOAD: "300"   # free models after this many idle seconds (0 = keep)
    volumes:
      # SAME downloads path as the main app, read-only
      - /home/user/pinepods/downloads:/opt/pinepods/downloads:ro
      # Persistent cache for model files (Whisper weights + local LLM GGUFs)
      - pinepods-ai-models:/models
    restart: always

volumes:
  pinepods-ai-models:
```

:::warning Mount the downloads volume at the same path
The main server sends the sidecar an absolute file path (for example
`/opt/pinepods/downloads/...`). The sidecar must see that exact path, so mount the same
volume at the same location. A read-only (`:ro`) mount is recommended.
:::

### Kubernetes (Helm)

The Helm chart has an `ai` section (disabled by default). Enable it in your values:

```yaml
ai:
  enabled: true
  image:
    repository: madeofpendletonwool/pinepods-ai
    tag: latest
  service:
    port: 8100
  whisper:
    device: "cpu"        # "cuda" with the latest-cuda image tag on a GPU node
    computeType: "int8"  # "float16" on a GPU
  idleUnloadSeconds: 300 # free models after this many idle seconds (0 = keep)
  persistence:
    enabled: true
    size: 5Gi          # holds Whisper weights + any local LLM models
```

When `ai.enabled` is true the chart injects `PINEPODS_AI_URL` into the main app
automatically and mounts the shared downloads volume read-only into the sidecar.

Raw Kubernetes manifests are also provided (`pinepods-ai.yml`) for non-Helm installs.

## 2. Environment variables

**On the main Pinepods server:**

| Variable | Purpose |
| --- | --- |
| `PINEPODS_AI_URL` | Base URL of the sidecar, e.g. `http://pinepods-ai:8100`. **Unset = all AI features disabled.** |
| `PINEPODS_AI_TOKEN` | Optional shared secret sent as an `X-AI-Token` header. Set the same value on the sidecar to require it. |

**On the `pinepods-ai` sidecar:**

| Variable | Default | Purpose |
| --- | --- | --- |
| `WHISPER_DEVICE` | `cpu` | `cpu`, or `cuda` with the `-cuda` image. |
| `WHISPER_COMPUTE_TYPE` | `int8` | Compute precision (`int8`, `float16`, …). |
| `WHISPER_BEAM_SIZE` | `5` | Whisper beam size. |
| `PINEPODS_AI_IDLE_UNLOAD` | `300` | Seconds a model may sit unused before its memory (RAM or GPU) is freed. `0` keeps models loaded. |
| `PINEPODS_AI_MAX_TRANSCRIBE_JOBS` | `1` | Transcriptions that run at once; the rest wait their turn. Local ad detection always runs one at a time. |
| `AI_LLM_N_CTX` | `8192` | Local LLM context window. |
| `AI_LLM_MAX_TOKENS` | `1024` | Max tokens the LLM may return per request. |
| `PINEPODS_AI_MODELS_DIR` | `/models` | Where model files are stored (falls back to `HF_HOME`). |
| `PINEPODS_AI_MEDIA_BASE` | `/opt/pinepods/downloads` | The only directory the sidecar is allowed to read audio from. |
| `PINEPODS_AI_TOKEN` | *(empty)* | Shared secret; when set, callers must send a matching `X-AI-Token`. |
| `PINEPODS_AI_PORT` | `8100` | Port the sidecar listens on. |
| `HF_TOKEN` | *(empty)* | Hugging Face token, only needed to pull **gated/private** model files. |

:::tip Models are chosen in the web UI
The transcription and ad-detection models, remote endpoints and API keys are all set from
**Settings → AI** in the web UI (below), with no restart needed. The environment variables only
describe the hardware and limits.
:::

## 3. The AI Settings page

Once the container is reachable, an admin can open **Settings → AI** in the web app. It has
three parts:

### Connection & capabilities

- A connection indicator (**Connected** / **Not connected**).
- Two capability rows:
  - **Transcription** — **Ready** once a Whisper model is set (it is, by default).
  - **Ad removal** — **Not configured** until you choose an ad-detection model (see below).

### Models

- **Transcription model** — pick the Whisper model. `base` is a good default; larger models
  are more accurate but slower and use more memory.
- **Ad-detection model** — choose the backend:
  - **Local (bundled)** — run a small quantized model *inside* the container. Select a model
    you've pulled (see next section).
  - **Remote (OpenAI-compatible)** — an [Ollama](https://ollama.com/) server or any
    OpenAI-style cloud API (URL + model + optional API key). Usually **much faster** than
    local CPU inference.
  - **Remote (Anthropic-compatible)** — an [Anthropic Messages
    API](https://docs.anthropic.com/en/api/messages) endpoint (Anthropic, or a provider that
    speaks that format such as the **[z.ai](https://z.ai/) GLM Coding Plan** — URL
    `https://api.z.ai/api/anthropic`, model `glm-4.6`).

  See [Ad Detection → Choosing the model](./AdDetection.md#choosing-the-model) for a worked
  z.ai example (the Coding Plan and the general API use different backends).

Click **Save** to apply. The API key (for remote endpoints) is stored encrypted and never
shown back.

### Pull a model

To run ad detection **locally**, you first pull a model file:

1. Under **Pull a model**, choose the source:
   - **GGUF (Hugging Face)** — enter the repo and file, e.g.
     - repo: `Qwen/Qwen2.5-3B-Instruct-GGUF`
     - file: `qwen2.5-3b-instruct-q4_k_m.gguf`
   - **Whisper** — pull a specific Whisper size ahead of time.
   - **Ollama** — trigger an `ollama pull` on a remote Ollama server.
2. Click **Pull**. Progress shows in the **AI job queue** on the same page.
3. When it finishes, select the model under **Ad-detection model → Local** and **Save**.

:::note Local models are large
A useful ad-detection model is a **2–4 GB** download and needs a similar amount of RAM to
run. It is not bundled into the image (that would bloat it for transcription-only users), so
you pull it once and it's cached on the `/models` volume.
:::

## GPU acceleration

Transcription is much faster on an NVIDIA GPU. Use the **`latest-cuda`** (or
`<version>-cuda`) image, which adds the CUDA libraries Whisper needs, expose the GPU to the
container, and set `WHISPER_DEVICE: "cuda"` and `WHISPER_COMPUTE_TYPE: "float16"`:

```yaml
  pinepods-ai:
    image: madeofpendletonwool/pinepods-ai:latest-cuda
    environment:
      WHISPER_DEVICE: "cuda"
      WHISPER_COMPUTE_TYPE: "float16"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

The `-cuda` image is amd64 only, and local LLM ad detection in it still runs on the CPU. For
GPU ad detection, point the ad-detection model at a GPU-backed **remote** Ollama endpoint.

Loaded models are freed after `PINEPODS_AI_IDLE_UNLOAD` seconds without use (5 minutes by
default), so the GPU memory is available to other workloads between jobs.

## CPU requirements

Transcription runs on any CPU. Local LLM ad detection on x86-64 needs **AVX2**, which most
Intel and AMD CPUs since 2013–2015 have, but Atom and Celeron/Pentium J and N models do not. On
those, use a remote endpoint for ad detection.

## Next steps

- **[Transcription](./Transcription.md)**
- **[Ad Detection](./AdDetection.md)**
