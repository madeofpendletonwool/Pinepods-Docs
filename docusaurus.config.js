const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

// Self-hosted Umami analytics (cookieless, privacy-respecting). The tracking
// script is only injected when BOTH env vars are supplied at build time, so
// local dev and CI builds stay analytics-free. Wire these up as Docker build
// args / build-time env once the umami backend (docker-compose.umami.yml) is
// deployed and a "website" has been created in its dashboard:
//   UMAMI_WEBSITE_ID  — the website's UUID from the Umami dashboard
//   UMAMI_SRC         — e.g. https://analytics.pinepods.online/script.js
const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID;
const umamiSrc = process.env.UMAMI_SRC;

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "PinePods Docs",
  tagline: "A Forest of Podcasts, Rooted in the Spirit of Self-Hosting",
  url: "https://pinepods.online",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "madeofpendletonwool", // Usually your GitHub org/user name.
  projectName: "Pinepods-Docs", // Usually your repo name.

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css',
      type: 'text/css',
    },
    {
      href: 'https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/fill/style.css', 
      type: 'text/css',
    },
    {
      href: 'https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/bold/style.css',
      type: 'text/css', 
    },
  ],

  presets: [
    [
      "redocusaurus",
      {
        // Renders the auto-generated PinePods API spec as an interactive reference.
        // The spec is generated from the Rust backend (rust-api/openapi.json) and
        // synced here via scripts/sync-openapi.sh.
        specs: [
          {
            id: "pinepods-api",
            spec: "static/openapi.json",
            route: "/docs/API/reference/",
          },
        ],
        theme: {
          primaryColor: "#2E7D32",
        },
      },
    ],
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/madeofpendletonwool/Pinepods-Docs/blob/main",
          // The live docs/ folder is the "current" (unreleased) version. Released
          // versions are snapshotted into versioned_docs/ via `docs:version X.Y.Z`.
          // The newest entry in versions.json is served as the default at /docs/,
          // so the current version is never the default. When a release is cut,
          // update the `current` label below to the next in-progress version.
          versions: {
            current: {
              label: "0.9.1 (Next 🚧)",
              path: "next",
              banner: "unreleased",
            },
          },
        },
        blog: {
          showReadingTime: true,
          editUrl:
            "https://github.com/madeofpendletonwool/Pinepods-Docs/tree/main",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  // Offline, self-contained search. Builds a search index at `docusaurus build`
  // time and runs entirely in the browser — no external service, no crawler, and
  // no query ever leaves the visitor's machine. Fits the Docker/nginx deploy.
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true, // cache-bust the index across builds
        indexDocs: true,
        indexBlog: true,
        indexPages: false, // skip the src/pages marketing/landing pages
        docsRouteBasePath: "/docs",
        blogRouteBasePath: "/blog",
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      }),
    ],
  ],

  // Emit AI-friendly docs into /build so external LLM tools (Claude, ChatGPT,
  // etc.) can consume the documentation cleanly:
  //   /llms.txt        — llmstxt.org index of the docs
  //   /llms-full.txt   — all docs concatenated into one Markdown file
  //   per-page .md     — clean Markdown for each doc page (generateMarkdownFiles)
  plugins: [
    [
      "docusaurus-plugin-llms",
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        docsDir: "docs",
        includeBlog: true,
        title: "PinePods Documentation",
        description:
          "A Forest of Podcasts, Rooted in the Spirit of Self-Hosting",
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        // Preserve inbound links after restructuring. `to` targets are
        // validated against real routes at build time.
        //
        // Note: the "Firewood (CLI)" -> "Firewood CLI" directory rename only
        // exists in the unreleased `next` version; the currently-served default
        // (0.9.0) still uses the parenthesized path as its live URL, so no
        // redirect is needed until 0.9.1 becomes the default version.
        redirects: [
          // Deleted default-tutorial pages (early template) -> docs home
          {
            from: [
              "/docs/tutorial-basics/create-a-page",
              "/docs/tutorial-basics/create-a-blog-post",
              "/docs/tutorial-basics/create-a-document",
              "/docs/tutorial-basics/congratulations",
              "/docs/tutorial-basics/deploy-your-site",
              "/docs/tutorial-basics/markdown-features",
              "/docs/tutorial-extras/manage-docs-versions",
              "/docs/tutorial-extras/translate-your-site",
              "/docs/tutorial-extras/reverse-proxy",
            ],
            to: "/docs/intro",
          },
        ],
      },
    ],
  ],

  // Inject the Umami tracking script only when configured at build time.
  headTags:
    umamiWebsiteId && umamiSrc
      ? [
          {
            tagName: "script",
            attributes: {
              defer: "true",
              src: umamiSrc,
              "data-website-id": umamiWebsiteId,
            },
          },
        ]
      : [],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Default social/link-preview card. Individual pages can override via
      // `image:` / `description:` front matter.
      image: "img/social-card.jpg",
      metadata: [{ name: "twitter:card", content: "summary_large_image" }],
      navbar: {
        title: "PinePods",
        logo: {
          alt: "PinePods Logo",
          src: "img/pinepods-appicon.png",
        },
        style: "primary",
        items: [
          { type: "docsVersionDropdown", position: "left" },
          { type: "doc", docId: "intro", position: "left", label: "Docs" },
          { to: "/blog", label: "Blog", position: "left" },
          {
            type: "doc",
            docId: "API/api_intro",
            position: "left",
            label: "API",
          },
          { to: "/contact", label: "Contact", position: "left" },
          { to: "/internal-testing", label: "Beta Testing", position: "left" },
          { to: "/feedback", label: "Feedback", position: "left" },
          {
            href: "https://discord.com/invite/bKzHRa4GNc",
            label: "Discord",
            position: "right",
          },
          {
            href: "https://github.com/madeofpendletonwool/PinePods",
            label: "GitHub", 
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              { label: "Docs", to: "/docs/intro" },
              { label: "Beta Testing", to: "/internal-testing" },
              { label: "Feedback", to: "/feedback" },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.com/invite/bKzHRa4GNc",
              },
            ],
          },
          {
            title: "More",
            items: [
              { label: "Blog", to: "/blog" },
              {
                label: "GitHub",
                href: "https://github.com/madeofpendletonwool/PinePods",
              },
              {
                label: "Buy me a coffee",
                href: "https://www.buymeacoffee.com/collinscoffee",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Pinepods, Created by GooseberryDevelopment. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};
