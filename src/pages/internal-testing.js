import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './contact.module.css';

export default function InternalTesting() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Replace with your middleware API endpoint
      const response = await fetch(process.env.REACT_APP_FORM_API_URL || 'http://localhost:8080/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: 'internal-testing-signup',
          data: formData
        }),
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Successfully signed up for internal testing! You\'ll receive an invitation email from Google Play Console within 24 hours.'
        });
        setFormData({ name: '', email: '' });
      } else {
        const errorData = await response.json();
        setStatus({
          type: 'error',
          message: errorData.message || 'Failed to submit form. Please try again.'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Internal Testing Sign-up"
      description="Sign up for PinePods internal testing to get early access to new features">
      <main className={styles.contactMain}>
        <div className="container">
          <div className={styles.contactHeader}>
            <h1>Join PinePods Internal Testing</h1>
            <p>Get early access to new features and help us improve PinePods before public release!</p>
          </div>
          
          <div className={styles.contactGrid}>
            <div className={styles.contactCard} style={{ gridColumn: 'span 2', maxWidth: '600px', margin: '0 auto' }}>
              <div className={styles.contactIcon}>
                <i className="ph-fill ph-test-tube"></i>
              </div>
              <h3>Internal Testing Program</h3>
              <p>
                Join our internal testing program to get early access to new PinePods features. 
                You'll receive test builds through Google Play Console and can provide feedback directly to our development team.
              </p>
              
              {status.message && (
                <div style={{
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: status.type === 'success' ? '#155724' : '#721c24',
                  border: `1px solid ${status.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      backgroundColor: 'var(--ifm-background-color)'
                    }}
                    placeholder="Enter your full name"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      backgroundColor: 'var(--ifm-background-color)'
                    }}
                    placeholder="Enter your email address"
                  />
                  <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                    This email will be used to send you the Google Play Console testing invitation.
                  </small>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.contactButton}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    fontSize: '16px',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Sign Up for Testing'}
                </button>
              </form>

              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--ifm-color-secondary-lightest)', borderRadius: '6px' }}>
                <h4>What to expect:</h4>
                <ul style={{ textAlign: 'left', marginBottom: 0 }}>
                  <li>You'll receive a Google Play Console invitation within 24 hours</li>
                  <li>Access to beta versions before public release</li>
                  <li>Direct feedback channel to the development team</li>
                  <li>Early access to new features and improvements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}