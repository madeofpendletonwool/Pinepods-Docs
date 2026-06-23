# Database API Reference

:::tip This page has moved
The PinePods Database API reference is now **generated automatically from the backend
source code**, so it always matches the running server instead of drifting out of date.

👉 **[Open the interactive API Reference »](/docs/API/reference/)**
:::

## What changed

This page used to be a large, hand-maintained list of endpoints. The PinePods API has
grown to hundreds of endpoints, and keeping a hand-written page accurate became
impossible. Instead, the backend now emits a standard **OpenAPI 3.1** specification
straight from the code ([`utoipa`](https://docs.rs/utoipa)), and this site renders it.

- **Interactive reference:** [/docs/API/reference/](/docs/API/reference/)
- **Raw OpenAPI spec:** [`/openapi.json`](/openapi.json) (also served by any running
  PinePods server at `/api/openapi.json`)
- **Live docs on your own server:** browse to `/api/docs` on your PinePods instance for
  an always-up-to-date interactive UI.

## Authentication (quick reference)

Most endpoints require an API key tied to a user account, sent in the **`Api-Key`**
header. Admin-only endpoints additionally require an admin (or web) key. See the
[API introduction](./api_intro.md) for how keys are issued to the web, desktop, and
mobile clients.

> **Note:** the reference is rolling out across the API module-by-module, so some
> endpoints may not appear yet. The spec is regenerated on every change and verified in
> CI, so what *is* listed is guaranteed accurate.
