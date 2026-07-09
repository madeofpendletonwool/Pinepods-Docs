# Setting Up the AI Container

The AI features run in the optional **`pinepods-ai`** container. This page covers deploying
it, the environment variables, and the **AI Settings** page where you choose and manage
models at runtime.

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
    image: madeofpendletonwool/pinepods-ai:latest
    environment:
      WHISPER_MODEL: "base"          # tiny|base|small|medium|large-v3
      WHISPER_DEVICE: "cpu"          # "cuda" if you use a GPU-enabled image/node
      WHISPER_COMPUTE_TYPE: "int8"
      # Ad-detection LLM defaults (usually left blank and configured from the UI):
      # AI_LLM_MODEL: ""             # local GGUF filename under /models
      # AI_LLM_URL: "http://ollama:11434/v1"
      # AI_LLM_API_KEY: ""
      # AI_LLM_MODEL_NAME: "qwen2.5:3b"
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
    model: "base"
    device: "cpu"
    computeType: "int8"
  # Ad-detection LLM defaults (optional; usually set from the UI):
  llm:
    model: ""          # local GGUF filename under /models
    url: ""            # e.g. http://ollama:11434/v1
    modelName: ""      # e.g. qwen2.5:3b
    apiKey: ""
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
| `WHISPER_MODEL` | `base` | Default transcription model (`tiny`/`base`/`small`/`medium`/`large-v3`, …). Also configurable from the UI. |
| `WHISPER_DEVICE` | `cpu` | `cpu`, or `cuda` for GPU images. |
| `WHISPER_COMPUTE_TYPE` | `int8` | Compute precision (`int8`, `float16`, …). |
| `WHISPER_BEAM_SIZE` | `5` | Whisper beam size. |
| `AI_LLM_MODEL` | *(empty)* | Default **local** LLM (GGUF filename under `/models`) for ad detection. |
| `AI_LLM_URL` | *(empty)* | Default **remote** OpenAI-compatible endpoint for ad detection. |
| `AI_LLM_MODEL_NAME` | *(empty)* | Default remote model id (e.g. `qwen2.5:3b`). |
| `AI_LLM_API_KEY` | *(empty)* | API key for the remote endpoint, if required. |
| `AI_LLM_N_CTX` | `8192` | Local LLM context window. |
| `AI_LLM_MAX_TOKENS` | `1024` | Max tokens the LLM may return per request. |
| `PINEPODS_AI_MODELS_DIR` | `/models` | Where model files are stored (falls back to `HF_HOME`). |
| `PINEPODS_AI_MEDIA_BASE` | `/opt/pinepods/downloads` | The only directory the sidecar is allowed to read audio from. |
| `PINEPODS_AI_TOKEN` | *(empty)* | Shared secret; when set, callers must send a matching `X-AI-Token`. |
| `PINEPODS_AI_PORT` | `8100` | Port the sidecar listens on. |
| `HF_TOKEN` | *(empty)* | Hugging Face token, only needed to pull **gated/private** model files. |

:::tip Model choices are best set at runtime
The `AI_LLM_*` and `WHISPER_MODEL` variables are just **initial defaults**. Day to day, you
pick and change models from **Settings → AI** in the web UI (below) — no restart needed.
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

Transcription and local LLM inference are much faster on a GPU. To use one, run a
CUDA-enabled build of the sidecar on a GPU node and set `WHISPER_DEVICE: "cuda"` (and an
appropriate `WHISPER_COMPUTE_TYPE`, e.g. `float16`). For ad detection specifically, pointing
at a GPU-backed **remote** Ollama endpoint is often the simplest path.

## Next steps

- **[Transcription](./Transcription.md)**
- **[Ad Detection](./AdDetection.md)**
