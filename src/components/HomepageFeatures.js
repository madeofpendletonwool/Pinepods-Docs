import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Own Everything, Run Everywhere',
    Svg: require('../../static/img/os.svg').default,
    description: (
      <>
        Every aspect of PinePods is fully open sourced and the code is available on Github. There's zero data collection and you can self-host every aspect of the application. Run anywhere you can run a browser. There's a client on linux, mac, and windows. A mobile client is in the works.
      </>
    ),
  },
  {
    title: 'Zero Cost, Full Functionality',
    Svg: require('../../static/img/opensource.svg').default,
    description: (
      <>
        Get all the features of the paid podcast apps. PinePods will never cost a dime and survives solely on donations. Rest easy knowing you'll always be able to sync your saved podcasts and user settings between devices.
      </>
    ),
  },
  {
    title: 'Powered by Python and Rust',
    imageSrc: require('../../static/img/pythonlogo.png').default,
    description: (
      <>
        Created with a Python Backend and a Rust frontend for speed and performance where it counts. The UI is made with the Yew web framework, the API is FastAPI.
      </>
    ),
  },
];

function Feature({ Svg, title, description, imageSrc }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {Svg && <Svg className={styles.featureSvg} alt={title} />}
        {imageSrc && <img src={imageSrc} className={styles.featureSvg} alt={title} />}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}


export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        {/* Detailed Introduction Section */}
        <div className="text--center padding-horiz--md">
          <div className={styles.keyFeatures}>
            <h2>Self-Hosted Podcast Management</h2>
            <p>
              Pinepods is a powerful, self-hosted podcast management system that puts you in control. Built with Rust for performance and reliability, it's designed to be your personal podcast server that follows you across all your devices.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className="row">
              <div className="col col--6">
                <h3>Core Features</h3>
                <div className={styles.featureList}>
                  <p>🌐 Access your podcasts everywhere</p>
                  <p>👥 Multi-user support</p>
                  <p>🔍 Smart podcast discovery</p>
                  <p>🔄 Nextcloud & gpodder sync</p>
                  <p>🎨 Multiple themes</p>
                  <p>🔐 Privacy-focused</p>
                </div>
              </div>
              <div className="col col--6">
                <h3>Technical Stack</h3>
                <div className={styles.featureList}>
                  <p>⚡️ Rust & Python powered</p>
                  <p>🗄️ PostgreSQL/MySQL support</p>
                  <p>🔧 Docker ready</p>
                  <p>📱 PWA enabled</p>
                  <p>🔌 Podcast Index & iTunes API</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.tryPinepods}>
            <p>
              Try it now at <a href="https://try.pinepods.online">try.pinepods.online</a> or set up your own server with our simple guide.
            </p>
          </div>
        </div>

        {/* Original Feature List */}
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}