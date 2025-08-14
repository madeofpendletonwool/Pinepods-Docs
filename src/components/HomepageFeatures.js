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
          <h2 className={styles.sectionTitle}><i className="ph-fill ph-lightning"></i> Built with Rust Throughout</h2>
          <p className={styles.sectionSubtitle}>
            Full-stack Rust power: Lightning-fast backend + WebAssembly frontend. The complete performance package.
          </p>
          <div className={styles.performanceStats}>
            <div className={styles.performanceStat}>
              <i className={`ph-fill ph-lightning ${styles.statIcon}`}></i>
              <span className={styles.statLabel}>Rust Backend</span>
              <span className={styles.statDescription}>Zero-overhead server processing</span>
            </div>
            <div className={styles.performanceStat}>
              <i className={`ph-fill ph-globe-hemisphere-west ${styles.statIcon}`}></i>
              <span className={styles.statLabel}>WASM Frontend</span>
              <span className={styles.statDescription}>Native-speed web experience</span>
            </div>
            <div className={styles.performanceStat}>
              <i className={`ph-fill ph-rocket-launch ${styles.statIcon}`}></i>
              <span className={styles.statLabel}>Sub-second Response</span>
              <span className={styles.statDescription}>Instant everything, everywhere</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhatIsSection = () => {
  const animRef = useScrollAnimation();
  const [activeCategory, setActiveCategory] = React.useState('podcasts');

  const categories = {
    podcasts: {
      title: 'Podcasts',
      icon: 'ph-microphone',
      description: 'Subscribe to your favorite podcasts and discover new ones with our integrated search powered by Podcast Index and iTunes. Your library syncs across all devices instantly.',
      features: ['Smart discovery', 'Instant sync', 'Offline support', 'Episode management']
    },
    youtube: {
      title: 'YouTube Channels',
      icon: 'ph-youtube-logo',
      description: 'Transform YouTube channels into audio podcasts. Subscribe to channels and automatically get audio-only downloads of new videos as podcast episodes.',
      features: ['Auto audio extraction', 'Channel subscriptions', 'Background downloads', 'Metadata preservation']
    },
    sync: {
      title: 'Universal Sync',
      icon: 'ph-arrows-clockwise',
      description: 'Everything syncs everywhere. Your listening position, settings, themes, playlists, and subscriptions follow you across web, mobile, desktop, and terminal clients.',
      features: ['Real-time sync', 'Cross-platform', 'Offline resilience', 'Conflict resolution']
    },
    selfhosted: {
      title: 'Self-Hosted',
      icon: 'ph-house',
      description: 'Complete control over your data with zero dependencies on third parties. Deploy on anything from a Raspberry Pi to enterprise Kubernetes clusters.',
      features: ['Full ownership', 'Privacy first', 'No vendor lock-in', 'Custom RSS feeds']
    }
  };

  return (
    <section className={styles.whatIsSection} ref={animRef}>
      <div className="container">
        <div className={styles.whatIsContent}>
          <h2 className={styles.sectionTitle}>What is PinePods?</h2>
          <div className={styles.categoryNav}>
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                className={`${styles.categoryButton} ${activeCategory === key ? styles.active : ''}`}
                onClick={() => setActiveCategory(key)}
              >
                <i className={`${category.icon} ${styles.categoryIcon}`}></i>
                <span>{category.title}</span>
              </button>
            ))}
          </div>
          <div className={styles.categoryContent}>
            <div className={styles.categoryDescription}>
              <h3>{categories[activeCategory].title}</h3>
              <p>{categories[activeCategory].description}</p>
              <div className={styles.categoryFeatures}>
                {categories[activeCategory].features.map((feature, index) => (
                  <div key={index} className={styles.feature}>
                    <i className="ph-fill ph-check-circle"></i>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
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
          <h2 className={styles.sectionTitle}><i className="ph-fill ph-arrows-clockwise"></i> Universal Synchronization</h2>
          <p className={styles.sectionSubtitle}>
            Everything syncs. Everywhere. Instantly. Your listening position, settings, themes, subscriptions - it all follows you.
          </p>
          <div className={styles.syncFeatures}>
            <div className={styles.syncFeature}>
              <i className={`ph-fill ph-crosshair ${styles.syncIcon}`}></i>
              <h3>Timestamp Sync</h3>
              <p>Pick up exactly where you left off on any device. Down to the second.</p>
            </div>
            <div className={styles.syncFeature}>
              <i className={`ph-fill ph-palette ${styles.syncIcon}`}></i>
              <h3>Settings & Themes</h3>
              <p>Your preferences, themes, and settings sync seamlessly across all apps.</p>
            </div>
            <div className={styles.syncFeature}>
              <i className={`ph-fill ph-playlist ${styles.syncIcon}`}></i>
              <h3>Smart Playlists</h3>
              <p>Intelligent playlists that sync across devices with custom rules and filters.</p>
            </div>
            <div className={styles.syncFeature}>
              <i className={`ph-fill ph-link ${styles.syncIcon}`}></i>
              <h3>The Best gpodder Support in podcasts</h3>
              <p>Pinepods has it's own gpodder server that's a switch flip in settings to start using, it also supports external gpodder servers like opodsync or Podfetch, and it supports Nextcloud gpodder sync - your choice.</p>
            </div>
            <div className={styles.syncFeature}>
              <i className={`ph-fill ph-youtube-logo ${styles.syncIcon}`}></i>
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
          <h2 className={styles.sectionTitle}><i className="ph-fill ph-devices"></i> Apps for Every Platform</h2>
          <p className={styles.sectionSubtitle}>
            Native apps, CLI tools, and web clients. Access your podcasts however you want, wherever you are.
          </p>
          <div className={styles.appsList}>
            <div className={styles.appCard}>
              <i className={`ph-fill ph-device-mobile ${styles.appIcon}`}></i>
              <h3>iOS App</h3>
              <p>Native iOS application with full feature parity and offline support</p>
              <div className={styles.appStatus}>Available</div>
            </div>
            <div className={styles.appCard}>
              <i className={`ph-fill ph-android-logo ${styles.appIcon}`}></i>
              <h3>Android App</h3>
              <p>Native Android client with background playback and notifications</p>
              <div className={styles.appStatus}>Available</div>
            </div>
            <div className={styles.appCard}>
              <i className={`ph-fill ph-globe-hemisphere-west ${styles.appIcon}`}></i>
              <h3>Web App (WASM)</h3>
              <p>Rust-powered WebAssembly frontend for lightning-fast web experience</p>
              <div className={styles.appStatus}>Available</div>
            </div>
            <div className={styles.appCard}>
              <i className={`ph-fill ph-desktop ${styles.appIcon}`}></i>
              <h3>Desktop Apps</h3>
              <p>Cross-platform desktop applications for Windows, Mac, and Linux</p>
              <div className={styles.appStatus}>Available</div>
            </div>
            <div className={styles.appCard}>
              <i className={`ph-fill ph-terminal ${styles.appIcon}`}></i>
              <h3>CLI TUI Client</h3>
              <p>pinepods-firewood: Beautiful terminal interface for power users</p>
              <div className={styles.appStatus}>Available</div>
            </div>
          </div>
          
          <div className={styles.anyDeviceSection}>
            <h3>Want PinePods on Another Device?</h3>
            <p>
              Have a Smart TV, car system, or other device you'd like to see PinePods on? 
              Let us know on <a href="https://discord.com/invite/bKzHRa4GNc">Discord</a> or 
              <a href="https://github.com/madeofpendletonwool/PinePods/issues"> GitHub</a>! 
              We're always looking to expand platform support.
            </p>
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
          <h2 className={styles.sectionTitle}><i className="ph-fill ph-rocket-launch"></i> Deploy Anywhere</h2>
          <p className={styles.sectionSubtitle}>
            From Raspberry Pi to enterprise Kubernetes clusters. If it runs Linux, it runs PinePods.
          </p>
          <div className={styles.deploymentOptions}>
            <div className={styles.deploymentCard}>
              <i className={`ph-fill ph-container ${styles.deploymentIcon}`}></i>
              <h3>Docker Compose</h3>
              <p>One-command deployment with our ready-to-go Docker Compose setup</p>
            </div>
            <div className={styles.deploymentCard}>
              <i className={`ph-fill ph-circles-three ${styles.deploymentIcon}`}></i>
              <h3>Kubernetes + Helm</h3>
              <p>Production-ready Helm charts for scalable Kubernetes deployments</p>
            </div>
            <div className={styles.deploymentCard}>
              <i className={`ph-fill ph-cpu ${styles.deploymentIcon}`}></i>
              <h3>Raspberry Pi & SoCs</h3>
              <p>Perfect for single-board computers and ARM-based systems</p>
            </div>
            <div className={styles.deploymentCard}>
              <i className={`ph-fill ph-server ${styles.deploymentIcon}`}></i>
              <h3>Rack Mount Servers</h3>
              <p>Enterprise-grade deployment on dedicated server hardware</p>
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
        <h2 className={styles.sectionTitle}><i className="ph-fill ph-crown-simple"></i> All the Paid Features, at Zero Cost</h2>
        <div className={styles.gridContainer}>
          <div className={styles.featureCard}>
            <i className={`ph-fill ph-broadcast ${styles.featureIcon}`}></i>
            <h3>Custom RSS Feeds</h3>
            <p>Expose your curated feeds for other podcast apps and feed readers to consume.</p>
          </div>
          <div className={styles.featureCard}>
            <i className={`ph-fill ph-bell ${styles.featureIcon}`}></i>
            <h3>Smart Notifications</h3>
            <p>Episode release notifications via ntfy and gotify. Never miss your favorite shows.</p>
          </div>
          <div className={styles.featureCard}>
            <i className={`ph-fill ph-download ${styles.featureIcon}`}></i>
            <h3>OPML Import/Export</h3>
            <p>Easy migration from other apps with full OPML support for seamless transitions.</p>
          </div>
          <div className={styles.featureCard}>
            <i className={`ph-fill ph-sliders ${styles.featureIcon}`}></i>
            <h3>Advanced Playback</h3>
            <p>Start/end cutoff times, speed controls, and custom playback settings per podcast.</p>
          </div>
          <div className={styles.featureCard}>
            <i className={`ph-fill ph-shield-check ${styles.featureIcon}`}></i>
            <h3>MFA & OIDC</h3>
            <p>Enterprise security with multi-factor authentication and OpenID Connect integration.</p>
          </div>
          <div className={styles.featureCard}>
            <i className={`ph-fill ph-archive ${styles.featureIcon}`}></i>
            <h3>Archival Support</h3>
            <p>Fantastic archival capabilities to preserve your podcast history forever.</p>
          </div>
          <div className={styles.featureCard}>
            <i className={`ph-fill ph-house ${styles.featureIcon}`}></i>
            <h3>Self-Hosted</h3>
            <p>Complete control over your data. No third-party dependencies.</p>
          </div>
          <div className={styles.featureCard}>
            <i className={`ph-fill ph-users-three ${styles.featureIcon}`}></i>
            <h3>Multi-User</h3>
            <p>Family-friendly with separate libraries for each user.</p>
          </div>
          <div className={styles.featureCard}>
            <i className={`ph-fill ph-magnifying-glass ${styles.featureIcon}`}></i>
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
          <h2 className={styles.sectionTitle}><i className="ph-fill ph-image"></i> Don't Take My Word For It</h2>
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
      <WhatIsSection />
      <SyncSection />
      <DeploymentSection />
      <AppsSection />
      <FeaturesGrid />
      <ScreenshotsSection />
      <CTASection />
    </>
  );
}