import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

function Contact() {
  const formRef = useRef();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ loading: false, type: '', text: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !message) {
      setStatus({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    setStatus({ loading: true, type: '', text: '' });

    // Web-based email trigger
    window.location.href = `mailto:erenyeager.18021802@gmail.com?subject=Ln Code Support Query from ${encodeURIComponent(email)}&body=${encodeURIComponent(message)}`;
    
    setStatus({ 
      loading: false, 
      type: 'success', 
      text: '🚀 Opening your email client to send message!' 
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '35px 30px', textAlign: 'center' }}>
        
        {/* Updated H1 with animated-title class */}
        <h1 
          className="animated-title" 
          style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}
        >
          Contact Support
        </h1>
        
        <p style={{ color: 'var(--subtext-color)', fontSize: '14.5px', marginBottom: '25px' }}>
          Have questions or feedback regarding the platform? Send us a direct message.
        </p>

        {status.text && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '600',
            background: status.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${status.type === 'success' ? '#22c55e' : '#ef4444'}`,
            color: status.type === 'success' ? '#4ade80' : '#f87171'
          }}>
            {status.text}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-color)' }}>Your Email</label>
            <input 
              type="email" 
              name="user_email"
              placeholder="e.g. arjun@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group" style={{ marginTop: '18px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-color)' }}>Message</label>
            <textarea 
              name="message"
              rows="5"
              placeholder="Type your feedback or question here..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              required 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'var(--text-color)',
                fontSize: '14.5px',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            disabled={status.loading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginTop: '20px',
              background: '#06b6d4',
              color: '#020617'
            }}
          >
            {status.loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '13.5px', color: 'var(--subtext-color)' }}>
          Direct E-mail: <strong style={{ color: 'var(--text-color)' }}>erenyeager.18021802@gmail.com</strong>
        </div>

      </div>
    </div>
  );
}

export default Contact;