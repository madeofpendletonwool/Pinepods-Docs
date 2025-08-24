import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './contact.module.css';

export default function InternalTesting() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platform: 'android',
    wantsNews: false,
    newsEmail: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Submit to pinepods-admin form service
      const apiUrl = 'https://forms.pinepods.online/api/forms/submit';
      console.log('Submitting to:', apiUrl);
      console.log('Form data:', formData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form_id: 'internal-testing-signup',
          data: formData
        }),
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Successfully signed up for internal testing! You\'ll receive an invitation email from Google Play Console within 24 hours.'
        });
        setFormData({ name: '', email: '', platform: 'android', wantsNews: false, newsEmail: '' });
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
                You'll receive test builds and can provide feedback directly to our development team.
              </p>
              
              <div style={{ 
                backgroundColor: 'var(--ifm-color-secondary-lightest)', 
                border: '1px solid var(--ifm-color-emphasis-300)', 
                borderRadius: '6px', 
                padding: '12px', 
                marginBottom: '20px',
                color: 'var(--ifm-color-content-secondary)'
              }}>
                <strong>📧 Email Requirements:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  <li><strong>Android:</strong> Use your Gmail address</li>
                  <li><strong>iOS:</strong> Use your Apple ID email address</li>
                </ul>
              </div>
              
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
                    This email will be used to send you the testing invitation.
                  </small>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Platform *
                  </label>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
                      <input
                        type="radio"
                        name="platform"
                        value="android"
                        checked={formData.platform === 'android'}
                        onChange={handleInputChange}
                        style={{ marginRight: '8px' }}
                      />
                      Android (Google Play)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
                      <input
                        type="radio"
                        name="platform"
                        value="ios"
                        checked={formData.platform === 'ios'}
                        onChange={handleInputChange}
                        style={{ marginRight: '8px' }}
                      />
                      iOS (TestFlight)
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    <input
                      type="checkbox"
                      name="wantsNews"
                      checked={formData.wantsNews}
                      onChange={handleInputChange}
                      style={{ marginRight: '8px' }}
                    />
                    I'd like to receive very infrequent news and updates about PinePods
                  </label>
                </div>

                {formData.wantsNews && (
                  <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="newsEmail" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      News Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      id="newsEmail"
                      name="newsEmail"
                      value={formData.newsEmail}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '16px',
                        backgroundColor: 'var(--ifm-background-color)'
                      }}
                      placeholder="Enter email for news (leave blank to use main email)"
                    />
                    <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                      If left blank, we'll use your main email address above.
                    </small>
                  </div>
                )}

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

              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--ifm-color-secondary-lightest)', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', color: 'var(--ifm-color-content-secondary)' }}>
                <h4>What to expect:</h4>
                <ul style={{ textAlign: 'left', marginBottom: 0 }}>
                  <li>You'll receive a Google Play Console invitation within 24 hours</li>
                  <li>Access to beta versions before public release</li>
                  <li>Direct feedback channel to the development team</li>
                  <li>Early access to new features and improvements</li>
                </ul>
              </div>
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--ifm-color-secondary-lightest)', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', color: 'var(--ifm-color-content-secondary)' }}>
                <h4>What NOT to expect:</h4>
                <ul style={{ textAlign: 'left', marginBottom: 0 }}>
                  <li>Spam</li>
                  <li>Your email used for anything other than invitations and if you select it, very infrequent news updates</li>
                  <li>Ads or Marketing in any way</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}