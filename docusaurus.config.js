const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

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
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/madeofpendletonwool/Pinepods-Docs/blob/main",
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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "PinePods",
        logo: {
          alt: "PinePods Logo",
          src: "img/pinepods-appicon.png",
        },
        style: "primary",
        items: [
          { type: "doc", docId: "intro", position: "left", label: "Tutorial" },
          { to: "/blog", label: "Blog", position: "left" },
          {
            type: "doc",
            docId: "API/api_intro",
            position: "left",
            label: "API",
          },
          { to: "/contact", label: "Contact", position: "left" },
          { to: "/internal-testing", label: "Beta Testing", position: "left" },
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
              { label: "Tutorial", to: "/docs/intro" },
              { label: "Beta Testing", to: "/internal-testing" },
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
