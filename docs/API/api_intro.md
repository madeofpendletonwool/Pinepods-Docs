# API Documentation

There's actually 2 platforms that utilize APIs in Pinepods. I will make documents going over the details on both of them. 

## Search API

The search API is used for finding new podcasts. In order for Pinepods to search the Podcast Index, iTunes, or YouTube, it needs to be pointed at a location where it can receive information about indexed content in a format it can understand. It also lets users search these external providers without holding a private API key themselves. For those reasons, the Pinepods search container exists. It's a small Rust (Actix Web) service: you can request a free API key from the Podcast Index and host the container yourself, or just use the hosted instance at `https://search.pinepods.online/api/search`. iTunes and YouTube searches need no keys at all — YouTube is handled by a bundled `yt-dlp`, so there's no Google API key or quota to manage. See the [Search API](./search_api.md) page for full details.

## Database API

The database API is how the Pinepods clients (web, desktop, and mobile) interact with the database. It is the main **Rust (Axum) API** that runs inside the primary Pinepods container — not a separate Python/FastAPI service. All clients talk to it over the same HTTP API and authenticate with **API keys**: the web UI obtains a key automatically once you sign in, while the desktop and mobile apps require you to enter your server URL and credentials when you first connect. Internally it listens on its own port and is reached through the container's nginx reverse proxy.

The full endpoint reference is **generated directly from the backend source** (OpenAPI 3.1), so it stays in sync with the running code:

- 📖 **[Interactive API Reference](/docs/API/reference/)** — browse every documented endpoint here.
- 🧪 **Live docs on your own server** — visit `/api/docs` on your PinePods instance for an always-current interactive UI, or fetch the raw spec at `/api/openapi.json`.

Continue on into the documentation pages for these APIs to get an understanding of how they work and how to access data over each of them.