import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

// Hook for scroll-triggered animations
const useScrollAnimation = () => {
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animate);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return ref;
};

const PerformanceSection = () => {
  const animRef = useScrollAnimation();
  
  return (
    <section className={styles.performanceSection} ref={animRef}>
      <div className="container">
        <div className={styles.performanceContent}>
          <h2 className={styles.sectionTitle}>⚡ Built with Rust Throughout</h2>
          <p className={styles.sectionSubtitle}>
            Full-stack Rust power: Lightning-fast backend + WebAssembly frontend. The complete performance package.
          </p>
          <div className={styles.performanceStats}>
            <div className={styles.performanceStat}>
              <span className={styles.statValue}>🦀</span>
              <span className={styles.statLabel}>Rust Backend</span>
              <span className={styles.statDescription}>Zero-overhead server processing</span>
            </div>
            <div className={styles.performanceStat}>
              <span className={styles.statValue}>🕸️</span>
              <span className={styles.statLabel}>WASM Frontend</span>
              <span className={styles.statDescription}>Native-speed web experience</span>
            </div>
            <div className={styles.performanceStat}>
              <span className={styles.statValue}>⚡</span>
              <span className={styles.statLabel}>Sub-second Response</span>
              <span className={styles.statDescription}>Instant everything, everywhere</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SyncSection = () => {
  const animRef = useScrollAnimation();
  
  return (
    <section className={styles.syncSection} ref={animRef}>
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
              <h3>Smart Playlists</h3>
              <p>Intelligent playlists that sync across devices with custom rules and filters.</p>
            </div>
            <div className={styles.syncFeature}>
              <div className={styles.syncIcon}>🔗</div>
              <h3>Triple gpodder Support</h3>
              <p>Internal server, external gpodder, and Nextcloud gpodder - your choice.</p>
            </div>
            <div className={styles.syncFeature}>
              <div className={styles.syncIcon}>📺</div>
              <h3>YouTube Channels</h3>
              <p>Subscribe to YouTube channels and get audio-only downloads as podcasts.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AppsSection = () => {
  const animRef = useScrollAnimation();
  
  return (
    <section className={styles.appsSection} ref={animRef}>
      <div className="container">
        <div className={styles.appsContent}>
          <h2 className={styles.sectionTitle}>📱 Apps for Every Platform</h2>
          <p className={styles.sectionSubtitle}>
            Native apps, CLI tools, and web clients. Access your podcasts however you want, wherever you are.
          </p>
          <div className={styles.appsList}>
            <div className={styles.appCard}>
              <div className={styles.appIcon}>📱</div>
              <h3>iOS App</h3>
              <p>Native iOS application with full feature parity and offline support</p>
              <div className={styles.appStatus}>Available</div>
            </div>
            <div className={styles.appCard}>
              <div className={styles.appIcon}>🤖</div>
              <h3>Android App</h3>
              <p>Native Android client with background playback and notifications</p>
              <div className={styles.appStatus}>Available</div>
            </div>
            <div className={styles.appCard}>
              <div className={styles.appIcon}>🌐</div>
              <h3>Web App (WASM)</h3>
              <p>Rust-powered WebAssembly frontend for lightning-fast web experience</p>
              <div className={styles.appStatus}>Available</div>
            </div>
            <div className={styles.appCard}>
              <div className={styles.appIcon}>🖥️</div>
              <h3>Desktop Apps</h3>
              <p>Cross-platform desktop applications for Windows, Mac, and Linux</p>
              <div className={styles.appStatus}>Available</div>
            </div>
            <div className={styles.appCard}>
              <div className={styles.appIcon}>⌨️</div>
              <h3>CLI TUI Client</h3>
              <p>pinepods-firewood: Beautiful terminal interface for power users</p>
              <div className={styles.appStatus}>Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DeploymentSection = () => {
  const animRef = useScrollAnimation();
  
  return (
    <section className={styles.deploymentSection} ref={animRef}>
      <div className="container">
        <div className={styles.deploymentContent}>
          <h2 className={styles.sectionTitle}>🚀 Deploy Anywhere</h2>
          <p className={styles.sectionSubtitle}>
            From simple Docker containers to enterprise Kubernetes clusters. Scale however you need.
          </p>
          <div className={styles.deploymentOptions}>
            <div className={styles.deploymentCard}>
              <div className={styles.deploymentIcon}>🐳</div>
              <h3>Docker Compose</h3>
              <p>One-command deployment with our ready-to-go Docker Compose setup</p>
            </div>
            <div className={styles.deploymentCard}>
              <div className={styles.deploymentIcon}>☸️</div>
              <h3>Kubernetes + Helm</h3>
              <p>Production-ready Helm charts for scalable Kubernetes deployments</p>
            </div>
            <div className={styles.deploymentCard}>
              <div className={styles.deploymentIcon}>🏠</div>
              <h3>Self-Hosted</h3>
              <p>Run on your own hardware with complete control and privacy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesGrid = () => {
  const animRef = useScrollAnimation();
  
  return (
    <section className={styles.featuresGrid} ref={animRef}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Enterprise-Grade Features</h2>
        <div className={styles.gridContainer}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📡</div>
            <h3>Custom RSS Feeds</h3>
            <p>Expose your curated feeds for other podcast apps and feed readers to consume.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔔</div>
            <h3>Smart Notifications</h3>
            <p>Episode release notifications via ntfy and gotify. Never miss your favorite shows.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📥</div>
            <h3>OPML Import/Export</h3>
            <p>Easy migration from other apps with full OPML support for seamless transitions.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚙️</div>
            <h3>Advanced Playback</h3>
            <p>Start/end cutoff times, speed controls, and custom playback settings per podcast.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>MFA & OIDC</h3>
            <p>Enterprise security with multi-factor authentication and OpenID Connect integration.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🗄️</div>
            <h3>Archival Support</h3>
            <p>Fantastic archival capabilities to preserve your podcast history forever.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏠</div>
            <h3>Self-Hosted</h3>
            <p>Complete control over your data. No third-party dependencies.</p>
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
        </div>
      </div>
    </section>
  );
};

const ScreenshotsSection = () => {
  const animRef = useScrollAnimation();
  
  return (
    <section className={styles.screenshotsSection} ref={animRef}>
      <div className="container">
        <div className={styles.screenshotsContent}>
          <h2 className={styles.sectionTitle}>Don't Take My Word For It</h2>
          <p className={styles.sectionSubtitle}>
            See PinePods in action across all platforms. Beautiful, consistent, and powerful everywhere.
          </p>
          <div className={styles.screenshotGrid}>
            <div className={styles.screenshotCard}>
              <img 
                src="/img/screenshots/web-interface.png" 
                alt="PinePods Web Interface" 
                className={styles.screenshotImage}
              />
              <div className={styles.screenshotInfo}>
                <h3>Web Interface (WASM)</h3>
                <p>Lightning-fast Rust WebAssembly frontend</p>
              </div>
            </div>
            <div className={styles.screenshotCard}>
              <img 
                src="/img/screenshots/android-app.png" 
                alt="PinePods Android App" 
                className={styles.screenshotImage}
              />
              <div className={styles.screenshotInfo}>
                <h3>Android App</h3>
                <p>Native Android experience with offline support</p>
              </div>
            </div>
            <div className={styles.screenshotCard}>
              <img 
                src="/img/screenshots/ios-app.png" 
                alt="PinePods iOS App" 
                className={styles.screenshotImage}
              />
              <div className={styles.screenshotInfo}>
                <h3>iOS App</h3>
                <p>Beautiful native iOS interface</p>
              </div>
            </div>
            <div className={styles.screenshotCard}>
              <img 
                src="/img/screenshots/desktop-app.png" 
                alt="PinePods Desktop App" 
                className={styles.screenshotImage}
              />
              <div className={styles.screenshotInfo}>
                <h3>Desktop App</h3>
                <p>Cross-platform desktop application</p>
              </div>
            </div>
            <div className={styles.screenshotCard}>
              <img 
                src="/img/screenshots/cli-tui.png" 
                alt="PinePods CLI TUI - Firewood" 
                className={styles.screenshotImage}
              />
              <div className={styles.screenshotInfo}>
                <h3>CLI TUI (Firewood)</h3>
                <p>Beautiful terminal interface for power users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const animRef = useScrollAnimation();
  
  return (
    <section className={styles.ctaSection} ref={animRef}>
      <div className="container">
        <div className={styles.ctaContent}>
          <h2>Ready to Own Your Podcast Experience?</h2>
          <p>Join thousands of users who've taken control of their podcast ecosystem with the most feature-complete self-hosted solution available.</p>
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
};

export default function HomepageFeatures() {
  return (
    <>
      <PerformanceSection />
      <SyncSection />
      <DeploymentSection />
      <AppsSection />
      <FeaturesGrid />
      <ScreenshotsSection />
      <CTASection />
    </>
  );
}