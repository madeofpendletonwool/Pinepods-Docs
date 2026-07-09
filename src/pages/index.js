import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroOverlay}></div>
      <div className={clsx('container', styles.heroInner)}>
        <img
          src="/img/pinepods-circle.png"
          alt="PinePods"
          className={styles.heroLogo}
        />
        <p className={styles.eyebrow}>A forest of podcasts, rooted in self-hosting</p>
        <h1 className={styles.heroTitle}>
          <span className={styles.brand}>PinePods</span>
          <span className={styles.tagline}>Your complete podcast ecosystem</span>
        </h1>
        <p className={styles.heroSubtitle}>
          A lightning-fast, Rust-powered podcast server with seamless sync across
          all of your &mdash; and your family's &mdash; devices. Everything you
          need for podcasts, nothing you don't.
        </p>

        <div className={styles.heroChips}>
          <span className={styles.chip}>
            <i className="ph-fill ph-lightning"></i> Rust performance
          </span>
          <span className={styles.chip}>
            <i className="ph-fill ph-arrows-clockwise"></i> Universal sync
          </span>
          <span className={styles.chip}>
            <i className="ph-fill ph-devices"></i> Native apps
          </span>
          <span className={styles.chip}>
            <i className="ph-fill ph-house-line"></i> Self-hosted
          </span>
        </div>

        <div className={styles.heroButtons}>
          <Link className={styles.primaryButton} to="/docs/intro">
            <i className="ph-bold ph-rocket-launch"></i> Get started
          </Link>
          <Link className={styles.secondaryButton} href="https://try.pinepods.online">
            <i className="ph-bold ph-play-circle"></i> Try the demo
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title="PinePods — Your Complete Podcast Ecosystem"
      description="A lightning-fast, Rust-powered podcast server with seamless sync across all devices. Self-hosted, open source, and built for performance.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
