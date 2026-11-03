# Developing

Thanks for considering contributing to Pinepods! This page covers how the code is laid out and how to run it while you work on it. For how the pieces fit together at runtime, see [Container Fundamentals](./Container-Fundamentals.md).

- [The code](#the-code)
- [Setting up the dev environment](#setting-up-the-dev-environment)
- [Tests and checks](#tests-and-checks)
- [Git strategy](#git-strategy)
- [Resources for beginners](#resources-for-beginners)

## The code

Everything is in the [PinePods repository](https://github.com/madeofpendletonwool/PinePods):

| Directory | What it is |
|---|---|
| `web/` | The web app: Rust and [Yew](https://yew.rs), compiled to WebAssembly with [Trunk](https://trunkrs.dev). The same code builds the desktop app with Tauri. User-visible strings live in `web/src/translations/`. |
| `rust-api/` | The server: a Rust ([Axum](https://docs.rs/axum)) API. It includes the gpodder sync server, feed refreshes and the background scheduler. Routes are in `src/lib.rs`, handlers in `src/handlers/`, background services in `src/services/`. |
| `database_functions/`, `startup/` | Database migrations (Python, compiled into the image as `pinepods-db-setup`) and the container's startup scripts, nginx config and Horust services. |
| `mobile/` | The Android and iOS apps, in Flutter. |
| `pinepods-ai/` | The optional AI container for transcripts and ad detection. See [AI Setup](../AI/Setup.md). |
| `deployment/` | Docker Compose files and the Helm chart. |

## Setting up the Dev Environment

### Prerequisites

- **[Rust](https://www.rust-lang.org/tools/install)** with the WebAssembly target: `rustup target add wasm32-unknown-unknown`
- **[Trunk](https://trunkrs.dev/)** to build and serve the web app
- **[Docker](https://docs.docker.com/get-docker/)** for the server and its database
- **[Git](https://git-scm.com/downloads)**
- **[Flutter](https://docs.flutter.dev/get-started/install)**, only if you work on the mobile apps

### Running the server

Build the image from the repository root and run it with one of the [compose files](https://github.com/madeofpendletonwool/PinePods/tree/main/deployment/docker/compose-files):

```bash
git clone https://github.com/madeofpendletonwool/PinePods.git
cd PinePods
docker build -f dockerfile -t madeofpendletonwool/pinepods:latest .
```

The server is then at `http://localhost:8040` with the compose files' defaults.

### Running the web app

```bash
cd web
RUSTFLAGS="--cfg=web_sys_unstable_apis --cfg getrandom_backend=\"wasm_js\"" trunk serve --features server_build --release
```

It's served at [localhost:8080](http://localhost:8080/) and rebuilds when you save a file. Click **Connect to Different Server** on the sign-in page and enter your server's address (`http://localhost:8040`):

![Connect Different Server Button](/img/diff-serv.png)

Always build with `--features server_build`, as the container does; without it Trunk builds the desktop (Tauri) variant. A plain `cargo check` also misses code behind that feature, so check with `cargo check --target wasm32-unknown-unknown --features server_build`.

### The mobile apps

```bash
cd mobile
flutter pub get
flutter run
```

Sign in to your development server from the app, using your computer's LAN address rather than `localhost`.

## Tests and checks

These run in CI on every pull request:

- **Server integration tests** boot the real API against a fresh Postgres or MariaDB database for each test: `bash rust-api/scripts/integration-tests.sh` (add `--db postgres` or `--db mariadb` for one database, and `-- <name>` to filter). They need Docker. See `rust-api/tests/README.md`.
- **API spec:** `rust-api/openapi.json` is generated from the code. After changing an endpoint, regenerate it with `cd rust-api && cargo run -- --dump-openapi openapi.json`; CI fails if it's out of date. The [API reference](/docs/API/reference/) on this site is built from it.
- **Translations:** web UI text goes through `i18n.t("…")` with the English string in `web/src/translations/en.json`. CI flags new hard-coded strings and keys missing from `en.json`; other languages fall back to English.
- **Mobile:** `cd mobile && flutter test`.

---

## Git Strategy

### Git Flow

Like most Git repos, we are following the [Github Flow](https://guides.github.com/introduction/flow) standard.

1. Create a fork
2. Make any changes you want 🧑‍💻
3. Add, commit and push your changes to your branch/ fork
4. Head over to GitHub and create a Pull Request
5. Hit submit
6. Follow up with any reviews on your code
7. Merge 🎉

Please limit PRs to one feature/bug fix per PR. This will make it less complicated to merge your code if there's a problem with one thing but not the other.

### Git Branch Naming

The format of your branch name should be something similar to: `[TYPE]/[PR] [TITLE]`
For example, `FEATURE/Awesome feature` or `FIX/login server error`

### PR Guidelines

Once you've made your changes, and pushed them to your fork or branch, you're ready to open a pull request!

For a pull request to be merged, it must:

- Must be backwards compatible
- The build and tests (run by GH actions) must pass
- There must not be any merge conflicts

When you submit your PR, include some required info. Including:

- A brief description of your changes
- The issue or discussion number (if applicable)
- For UI related updates include a screenshot
- If any dependencies were added, explain why it was needed, state the cost associated, and confirm it does not introduce any security issues
- Finally hit submit!

---

## Resources for Beginners

New to Rust web development? Glad you're here! The following articles should point you in the right direction for getting up to speed with the technologies used in this project:

- [Open Source for Beginners](https://opensource.guide/how-to-contribute/)
- [Tutorial for Yew](https://yew.rs/docs/tutorial)
- [The Rust Book](https://doc.rust-lang.org/book/)
- [Axum (backend web framework)](https://docs.rs/axum/latest/axum/)
- [Complete beginners guide to Docker](https://docker-curriculum.com/)
- [Docker Classroom - Interactive Tutorials](https://training.play-with-docker.com/)
- [Git cheat sheet](http://git-cheatsheet.com/)

As well as Rust, Yew, Git and Docker- you'll also need an IDE (e.g. [VS Code](https://code.visualstudio.com/) or [Vim](https://www.vim.org/)) and a terminal (Windows users may find [WSL](https://docs.microsoft.com/en-us/windows/wsl/) more convenient).

---
