import React from 'react';
import Layout from '@theme/Layout';
import styles from './contact.module.css';

export default function Contact() {
  return (
    <Layout
      title="Contact"
      description="Get in touch with the PinePods community and developers">
      <main className={styles.contactMain}>
        <div className="container">
          <div className={styles.contactHeader}>
            <h1>Get in Touch</h1>
            <p>Have questions, suggestions, or want to contribute? We'd love to hear from you!</p>
          </div>
          
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <i className="ph-fill ph-discord-logo"></i>
              </div>
              <h3>Discord Community</h3>
              <p>Join our active Discord server for real-time chat, support, and community discussions.</p>
              <a href="https://discord.com/invite/bKzHRa4GNc" className={styles.contactButton}>
                Join Discord
              </a>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <i className="ph-fill ph-github-logo"></i>
              </div>
              <h3>GitHub Issues</h3>
              <p>Report bugs, request features, or contribute to the codebase on our GitHub repository.</p>
              <a href="https://github.com/madeofpendletonwool/PinePods/issues" className={styles.contactButton}>
                GitHub Issues
              </a>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <i className="ph-fill ph-coffee"></i>
              </div>
              <h3>Buy Me a Coffee</h3>
              <p>Support the development of PinePods with a small donation to keep the project going.</p>
              <a href="https://www.buymeacoffee.com/collinscoffee" className={styles.contactButton}>
                Support Development
              </a>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <i className="ph-fill ph-envelope"></i>
              </div>
              <h3>Email</h3>
              <p>For business inquiries, partnerships, or other matters, reach out via email.</p>
              <a href="mailto:contact@pinepods.online" className={styles.contactButton}>
                Send Email
              </a>
            </div>
          </div>

          <div className={styles.additionalInfo}>
            <h2>Contributing</h2>
            <p>
              PinePods is open source and welcomes contributions from developers of all skill levels. 
              Whether you're fixing bugs, adding features, improving documentation, or helping with translations, 
              your contributions are greatly appreciated.
            </p>
            <p>
              Check out our <a href="https://github.com/madeofpendletonwool/PinePods">GitHub repository</a> to get started!
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}