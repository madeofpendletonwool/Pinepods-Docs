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
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            PinePods Tutorial - 5min ⏱️
          </Link>
        </div>

        <div className="hero__explanation">
          <h2>Your Self-Hosted Podcast Command Center</h2>
          
          <p className="lead-paragraph">
            Pinepods is a powerful, self-hosted podcast management system that puts you in control of your podcast experience. Built with Rust for performance and reliability, it's designed to be your personal podcast server that follows you across all your devices.
          </p>

          <div className="key-features">
            <h3>Why Choose Pinepods?</h3>
            <ul>
              <li>🌐 <strong>Access Everywhere:</strong> Your podcasts, progress, and settings sync automatically across all your devices through your personal server</li>
              <li>👥 <strong>Multi-User Support:</strong> Share your server with family or friends while keeping everyone's podcasts and preferences separate</li>
              <li>🔍 <strong>Smart Discovery:</strong> Find new podcasts and follow your favorite hosts with PodPeopleDB integration and comprehensive search across multiple podcast directories</li>
              <li>🔄 <strong>Universal Compatibility:</strong> Use the sleek web interface, native apps, or sync with Nextcloud and gpodder-compatible apps like AntennaPod</li>
              <li>🎨 <strong>Customizable Experience:</strong> Choose from multiple themes and customize your listening experience</li>
              <li>🔐 <strong>Privacy-Focused:</strong> Your data stays on your server, under your control</li>
            </ul>
          </div>

          <div className="getting-started">
            <h3>Ready to Start?</h3>
            <p>
              Try Pinepods instantly at <a href="https://try.pinepods.online">try.pinepods.online</a> or follow our simple setup guide to host your own server. Whether you're a podcast enthusiast or just getting started, Pinepods gives you a modern, powerful platform to manage and enjoy your podcast listening experience.
            </p>
          </div>

          <div className="technical-highlights">
            <h3>Technical Excellence</h3>
            <ul>
              <li>⚡️ Built with Rust for exceptional performance and reliability</li>
              <li>🗄️ Choice of PostgreSQL or MySQL/MariaDB for robust data storage</li>
              <li>🔧 Full Docker support for easy deployment and maintenance</li>
              <li>📱 Progressive Web App (PWA) support for mobile devices</li>
              <li>🔌 API integration with The Podcast Index and iTunes</li>
            </ul>
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
      title={`Hello from ${siteConfig.title}`}
      description="A Forest of Podcasts, Rooted in the Spirit of Self-Hosting <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
