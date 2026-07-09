import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './download.module.css';

/*
 * ============================================================================
 *  DOWNLOAD CENTER — how to add a download
 * ============================================================================
 *
 *  1. Drop the file (apk, dmg, AppImage, zip, etc.) into the `downloads`
 *     volume on the server. It becomes available at:
 *         https://pinepods.online/downloads/<filename>
 *
 *  2. Add an entry to the `downloads` array below. The `file` field is just
 *     the filename you uploaded — the page builds the /downloads/ URL for you.
 *
 *  Fields:
 *    platform  - 'android' | 'apple' | 'linux' | 'windows' | 'file'
 *                (controls which icon shows; 'file' is a generic fallback)
 *    name      - Display name, e.g. "PinePods for Android"
 *    version   - Version string, e.g. "0.7.8"
 *    desc      - Short description / notes for this build
 *    file      - Filename in the downloads volume (becomes /downloads/<file>)
 *    size      - Human-readable size, e.g. "42 MB" (optional, display only)
 *    date      - Release date, e.g. "2025-09-19" (optional, display only)
 *    href      - OPTIONAL. Use instead of `file` to point at an external link
 *                (e.g. Play Store / TestFlight) rather than a hosted file.
 *
 * ============================================================================
 */
const downloads = [
  // ---- Example entries — edit or remove these ----
  // {
  //   platform: 'android',
  //   name: 'PinePods for Android',
  //   version: '0.7.8',
  //   desc: 'Latest release build. Sideload APK — enable "Install unknown apps" for your browser.',
  //   file: 'pinepods-0.7.8.apk',
  //   size: '42 MB',
  //   date: '2025-09-19',
  // },
  // {
  //   platform: 'linux',
  //   name: 'PinePods Desktop (Linux)',
  //   version: '0.7.8',
  //   desc: 'AppImage — chmod +x and run.',
  //   file: 'PinePods-0.7.8-x86_64.AppImage',
  //   size: '88 MB',
  //   date: '2025-09-19',
  // },
];

const PLATFORM_ICONS = {
  android: 'ph-fill ph-android-logo',
  apple: 'ph-fill ph-apple-logo',
  linux: 'ph-fill ph-linux-logo',
  windows: 'ph-fill ph-windows-logo',
  file: 'ph-fill ph-file-arrow-down',
};

function DownloadCard({ item }) {
  const icon = PLATFORM_ICONS[item.platform] || PLATFORM_ICONS.file;
  const url = item.href || `/downloads/${item.file}`;
  const external = Boolean(item.href);

  return (
    <div className={styles.card}>
      <div className={styles.cardIcon}>
        <i className={icon}></i>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitleRow}>
          <h3 className={styles.cardTitle}>{item.name}</h3>
          {item.version && <span className={styles.versionBadge}>v{item.version}</span>}
        </div>
        {item.desc && <p className={styles.cardDesc}>{item.desc}</p>}
        <div className={styles.cardMeta}>
          {item.size && (
            <span className={styles.metaItem}>
              <i className="ph ph-hard-drives"></i> {item.size}
            </span>
          )}
          {item.date && (
            <span className={styles.metaItem}>
              <i className="ph ph-calendar-blank"></i> {item.date}
            </span>
          )}
        </div>
      </div>
      <a
        className={styles.downloadButton}
        href={url}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : { download: true })}
      >
        <i className={`ph-bold ${external ? 'ph-arrow-square-out' : 'ph-download-simple'}`}></i>
        {external ? 'Get it' : 'Download'}
      </a>
    </div>
  );
}

export default function DownloadCenter() {
  return (
    <Layout
      title="Download Center"
      description="Official PinePods downloads — APKs, desktop builds, and more, straight from the source.">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <h1>Download Center</h1>
            <p>
              Official PinePods builds, served straight from{' '}
              <strong>pinepods.online</strong> — so you always know they came
              from the source.
            </p>
          </div>

          <div className={styles.trustNote}>
            <i className="ph-fill ph-shield-check"></i>
            <span>
              Every file on this page is hosted on our official domain. The
              only other official source is our{' '}
              <a
                href="https://github.com/madeofpendletonwool/PinePods/releases"
                target="_blank"
                rel="noopener noreferrer">
                GitHub releases
              </a>
              . If a build is offered anywhere else, treat it with caution.
            </span>
          </div>

          {downloads.length > 0 ? (
            <div className={styles.grid}>
              {downloads.map((item, i) => (
                <DownloadCard key={i} item={item} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <i className="ph ph-package"></i>
              <h3>No downloads available yet</h3>
              <p>
                New builds will appear here as they're released. In the
                meantime, you can grab releases on{' '}
                <a
                  href="https://github.com/madeofpendletonwool/PinePods/releases"
                  target="_blank"
                  rel="noopener noreferrer">
                  GitHub
                </a>
                .
              </p>
            </div>
          )}

          <div className={styles.footerNote}>
            <h2>Looking for the mobile beta?</h2>
            <p>
              Want managed updates through the Play Store or TestFlight instead
              of sideloading? Join the{' '}
              <a href="/internal-testing">internal testing program</a>.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
