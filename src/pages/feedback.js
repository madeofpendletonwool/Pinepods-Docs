import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './contact.module.css';

export default function Feedback() {
  const [formData, setFormData] = useState({
    feedback: '',
    email: '',
    platform: [],
    category: 'general',
    page: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platformOptions = [
    { value: 'ios', label: 'iOS' },
    { value: 'android', label: 'Android' },
    { value: 'web', label: 'Web' },
    { value: 'firewood', label: 'Firewood (CLI)' },
    { value: 'search-api', label: 'Search API' },
    { value: 'pinepods-api', label: 'PinePods API' },
    { value: 'desktop-clients', label: 'Desktop Clients' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'platform' && type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        platform: checked 
          ? [...prev.platform, value]
          : prev.platform.filter(p => p !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const apiUrl = 'https://forms.pinepods.online/api/forms/submit';
      console.log('Submitting to:', apiUrl);
      console.log('Form data:', formData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form_id: 'feedback-form',
          data: {
            ...formData,
            platform: formData.platform.join(', ') || 'Not specified'
          }
        }),
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you for your feedback! We\'ve received your submission and will review it soon.'
        });
        setFormData({ 
          feedback: '', 
          email: '', 
          platform: [], 
          category: 'general', 
          page: '' 
        });
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
      title="Feedback"
      description="Send feedback, bug reports, and feature requests for PinePods">
      <main className={styles.contactMain}>
        <div className="container">
          <div className={styles.contactHeader}>
            <h1>Send us your feedback!</h1>
            <p>We value your input. Please share your thoughts, report bugs, or suggest new features.</p>
          </div>
          
          <div className={styles.contactGrid}>
            <div className={styles.contactCard} style={{ gridColumn: 'span 2', maxWidth: '700px', margin: '0 auto' }}>
              <div className={styles.contactIcon}>
                <i className="ph-fill ph-chat-circle"></i>
              </div>
              <h3>Feedback Form</h3>
              <p>
                Help us improve PinePods by sharing your experience, reporting issues, or suggesting new features. 
                Your feedback directly influences our development priorities.
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
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="feedback" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Your Feedback *
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      backgroundColor: 'var(--ifm-background-color)',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Tell us what you think, report a bug, or suggest a feature..."
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      backgroundColor: 'var(--ifm-background-color)'
                    }}
                    placeholder="your.email@example.com - Leave empty for anonymous feedback"
                  />
                  <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                    Providing your email allows us to follow up with you if needed.
                  </small>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Platform(s) (optional - select all that apply)
                  </label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '12px',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: 'var(--ifm-background-surface-color)'
                  }}>
                    {platformOptions.map((option) => (
                      <label key={option.value} style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          name="platform"
                          value={option.value}
                          checked={formData.platform.includes(option.value)}
                          onChange={handleInputChange}
                          style={{ marginRight: '8px' }}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="category" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      backgroundColor: 'var(--ifm-background-color)'
                    }}
                  >
                    <option value="general">General Feedback</option>
                    <option value="bug-report">Bug Report</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="improvement">Improvement Suggestion</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="page" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Page/Feature (optional)
                  </label>
                  <input
                    type="text"
                    id="page"
                    name="page"
                    value={formData.page}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      backgroundColor: 'var(--ifm-background-color)'
                    }}
                    placeholder="Which page or feature is this about?"
                  />
                  <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                    Help us locate the specific area you're referring to.
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
                  {isSubmitting ? 'Sending...' : 'Send Feedback'}
                </button>
              </form>

              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '6px', color: 'var(--ifm-color-content)' }}>
                <h4>Types of feedback we're looking for:</h4>
                <ul style={{ textAlign: 'left', marginBottom: 0 }}>
                  <li><strong>Bug Reports:</strong> Issues you've encountered while using PinePods</li>
                  <li><strong>Feature Requests:</strong> New functionality you'd like to see</li>
                  <li><strong>Improvements:</strong> Ways to make existing features better</li>
                  <li><strong>General Feedback:</strong> Your overall experience and thoughts</li>
                </ul>
              </div>

              <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '6px', color: 'var(--ifm-color-content)' }}>
                <h4>What happens next:</h4>
                <ul style={{ textAlign: 'left', marginBottom: 0 }}>
                  <li>Your feedback is reviewed by our development team</li>
                  <li>If you provided an email, you'll receive a confirmation</li>
                  <li>Critical bugs and popular features are prioritized</li>
                  <li>We may follow up with questions if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}