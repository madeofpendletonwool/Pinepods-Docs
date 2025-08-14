import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const PerformanceSection = () => (
  <section className={styles.performanceSection}>
    <div className="container">
      <div className={styles.performanceContent}>
        <h2 className={styles.sectionTitle}>⚡ Blazing Fast Performance</h2>
        <p className={styles.sectionSubtitle}>
          Built with Rust for uncompromising speed and efficiency. Your podcast server that never slows down.
        </p>
        <div className={styles.performanceStats}>
          <div className={styles.performanceStat}>
            <span className={styles.statValue}>🚀</span>
            <span className={styles.statLabel}>Rust Backend</span>
            <span className={styles.statDescription}>Lightning-fast processing</span>
          </div>
          <div className={styles.performanceStat}>
            <span className={styles.statValue}>⚡</span>
            <span className={styles.statLabel}>Zero Latency</span>
            <span className={styles.statDescription}>Instant sync across devices</span>
          </div>
          <div className={styles.performanceStat}>
            <span className={styles.statValue}>🔄</span>
            <span className={styles.statLabel}>Real-time</span>
            <span className={styles.statDescription}>Live updates everywhere</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const SyncSection = () => (
  <section className={styles.syncSection}>
    <div className="container">
      <div className={styles.syncContent}>
        <h2 className={styles.sectionTitle}>🔄 Universal Synchronization</h2>
        <p className={styles.sectionSubtitle}>
          Everything syncs. Everywhere. Instantly. Your listening position, settings, themes, subscriptions - it all follows you.
        </p>
        <div className={styles.syncFeatures}>
          <div className={styles.syncFeature}>
            <div className={styles.syncIcon}>🎯</div>
            <h3>Timestamp Sync</h3>
            <p>Pick up exactly where you left off on any device. Down to the second.</p>
          </div>
          <div className={styles.syncFeature}>
            <div className={styles.syncIcon}>🎨</div>
            <h3>Settings & Themes</h3>
            <p>Your preferences, themes, and settings sync seamlessly across all apps.</p>
          </div>
          <div className={styles.syncFeature}>
            <div className={styles.syncIcon}>📚</div>
            <h3>Complete Library</h3>
            <p>Subscriptions, playlists, and episode progress - all synchronized instantly.</p>
          </div>
          <div className={styles.syncFeature}>
            <div className={styles.syncIcon}>🔗</div>
            <h3>gpodder Compatible</h3>
            <p>Built-in gpodder sync server keeps everything in perfect harmony.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AppsSection = () => (
  <section className={styles.appsSection}>
    <div className="container">
      <div className={styles.appsContent}>
        <h2 className={styles.sectionTitle}>📱 Native Apps Everywhere</h2>
        <p className={styles.sectionSubtitle}>
          Native iOS and Android apps that connect directly to your server. The complete podcast ecosystem.
        </p>
        <div className={styles.appsList}>
          <div className={styles.appCard}>
            <div className={styles.appIcon}>📱</div>
            <h3>iOS App</h3>
            <p>Native iOS application with full feature parity</p>
            <div className={styles.appStatus}>Available</div>
          </div>
          <div className={styles.appCard}>
            <div className={styles.appIcon}>🤖</div>
            <h3>Android App</h3>
            <p>Native Android client with offline capabilities</p>
            <div className={styles.appStatus}>Available</div>
          </div>
          <div className={styles.appCard}>
            <div className={styles.appIcon}>🌐</div>
            <h3>Web App</h3>
            <p>PWA that works on any device with a browser</p>
            <div className={styles.appStatus}>Available</div>
          </div>
          <div className={styles.appCard}>
            <div className={styles.appIcon}>🖥️</div>
            <h3>Desktop</h3>
            <p>Desktop applications for Windows, Mac, and Linux</p>
            <div className={styles.appStatus}>Available</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesGrid = () => (
  <section className={styles.featuresGrid}>
    <div className="container">
      <h2 className={styles.sectionTitle}>Everything You Need</h2>
      <div className={styles.gridContainer}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🏠</div>
          <h3>Self-Hosted</h3>
          <p>Complete control over your data. No third-party dependencies.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🔐</div>
          <h3>Privacy First</h3>
          <p>Zero data collection. Your podcasts stay yours.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🐳</div>
          <h3>Docker Ready</h3>
          <p>One-command deployment with Docker Compose.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>👥</div>
          <h3>Multi-User</h3>
          <p>Family-friendly with separate libraries for each user.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🔍</div>
          <h3>Smart Discovery</h3>
          <p>Podcast Index & iTunes integration for finding new content.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>💎</div>
          <h3>Premium Features</h3>
          <p>All the features of paid apps, completely free.</p>
        </div>
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className={styles.ctaSection}>
    <div className="container">
      <div className={styles.ctaContent}>
        <h2>Ready to Own Your Podcast Experience?</h2>
        <p>Join thousands of users who've taken control of their podcast ecosystem</p>
        <div className={styles.ctaButtons}>
          <a href="/docs/intro" className={styles.ctaButton}>
            Start Self-Hosting
          </a>
          <a href="https://try.pinepods.online" className={styles.ctaButtonSecondary}>
            Try Demo
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default function HomepageFeatures() {
  return (
    <>
      <PerformanceSection />
      <SyncSection />
      <AppsSection />
      <FeaturesGrid />
      <CTASection />
    </>
  );
}