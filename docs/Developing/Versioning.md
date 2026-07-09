# Docs Versioning

The documentation site is versioned so that each PinePods release keeps its own
frozen doc set, selectable from the **version dropdown** in the top-left of the
navbar (similar to the Talos Linux docs). This page explains how versioning works
here and how to cut a new version at release time.

## How it works

The site is built with [Docusaurus](https://docusaurus.io/) and uses its built-in
[docs versioning](https://docusaurus.io/docs/versioning):

- The live `docs/` folder is always the **current (unreleased) version**, shown in
  the dropdown as **"Next 🚧"** with an *unreleased* banner. This is where all
  in-progress edits go.
- Cutting a version **snapshots** `docs/` into `versioned_docs/version-X.Y.Z/`,
  snapshots `sidebars.js` into `versioned_sidebars/`, and appends the version to
  `versions.json`.
- The **newest entry in `versions.json` is served as the default** at `/docs/`.
  The current/"Next" version is never in `versions.json`, so it is never the
  default — visitors always land on the latest *released* version.
- The navbar, theme, CSS, and site config are **global** — they are shared across
  every version. Only the Markdown content is frozen per version, so any site
  improvement (new dropdown entries, styling, etc.) applies to all versions at once.

:::note API reference
The interactive API reference at `/docs/API/reference/` is generated from the
OpenAPI spec by a separate plugin and is **not** versioned — it always reflects the
current API. The API *Markdown* pages under `docs/API/` are versioned like the rest
of the docs.
:::

## Cutting a new version at release time

When PinePods ships a new release (e.g. `0.9.1`):

1. Make sure `docs/` reflects the docs for that release.
2. Cut the version:

   ```bash
   npm run docusaurus docs:version 0.9.1
   ```

3. Update the current-version label in `docusaurus.config.js` to the next
   in-progress version, e.g.:

   ```js
   versions: {
     current: {
       label: "0.9.2 (Next 🚧)",
       path: "next",
       banner: "unreleased",
     },
   },
   ```

4. Commit the generated files — `versioned_docs/version-0.9.1/`,
   `versioned_sidebars/version-0.9.1-sidebars.json`, and the updated
   `versions.json` — along with the config change.
5. Rebuild and deploy the Docker image as usual.

After this, `versions.json` becomes `["0.9.1", "0.9.0"]`: `0.9.1` automatically
becomes the default, `0.9.0` drops down the dropdown with an "old version" banner,
and `docs/` continues as the next unreleased set.

:::tip
As the number of versions grows, dev builds can be sped up with
[`onlyIncludeVersions`](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#onlyIncludeVersions)
in the docs plugin config.
:::
