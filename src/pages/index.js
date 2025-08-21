import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.heroBackground}></div>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroLogo}>
            <img src="/img/pinepods-appicon.png" alt="PinePods" className={styles.logoImage} />
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.brandName}>PinePods</span>
            <span className={styles.taglinePart}>Your Complete Podcast Ecosystem</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Lightning-fast Rust-powered podcast server with seamless sync across all you and your family's devices. 
            Everything you need for podcasts, nothing you don't.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>⚡</span>
              <span className={styles.statLabel}>Rust Performance</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>🔄</span>
              <span className={styles.statLabel}>Universal Sync</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>📱</span>
              <span className={styles.statLabel}>Native Apps</span>
            </div>
          </div>
          <div className={styles.heroButtons}>
            <Link
              className={clsx('button button--primary button--lg', styles.primaryButton)}
              to="/docs/intro">
              Get Started
            </Link>
            <Link
              className={clsx('button button--outline button--lg', styles.secondaryButton)}
              href="https://try.pinepods.online">
              Try Demo
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="PinePods - Your Complete Podcast Ecosystem"
      description="Lightning-fast Rust-powered podcast server with seamless sync across all devices. Self-hosted, open source, and built for performance.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
