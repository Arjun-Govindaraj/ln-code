import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Certificate() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareStatus, setShareStatus] = useState('');

  const languageName = lang ? lang.toUpperCase() : 'PROGRAMMING';
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certId = `LNC-${languageName.substring(0, 3)}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  useEffect(() => {
    document.title = `Ln Code Certificate - ${languageName}`;
  }, [languageName]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://ln-code-backend.onrender.com/api/quiz/profile-stats', {
          headers: { 'x-auth-token': token }
        });
        setUserData(res.data);
      } catch (err) {
        console.error('Error loading certificate data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Ln Code Certificate - ${languageName}`,
      text: `I just earned my official ${languageName} Master Certificate on Ln Code! 🚀`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareStatus('Link copied to clipboard! 📋');
      setTimeout(() => setShareStatus(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: '40px', color: 'var(--subtext-color)' }}>
        Generating your official Ln Code certificate...
      </div>
    );
  }

  const username = userData?.username || 'Learner';

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      
      {/* Action Buttons */}
      <div className="no-print" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => navigate('/dashboard')} style={{ background: 'var(--card-bg)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}>
            ⬅️ Back
          </button>
          <button className="btn" onClick={handlePrint} style={{ padding: '10px 20px', fontSize: '14px' }}>
            🖨️ Download / Print
          </button>
          <button className="btn" onClick={handleShare} style={{ background: '#9d4edd', color: '#ffffff', padding: '10px 20px', fontSize: '14px' }}>
            🔗 Share Certificate
          </button>
        </div>

        {shareStatus && (
          <span style={{ color: '#06b6d4', fontSize: '13px', fontWeight: 'bold' }}>
            {shareStatus}
          </span>
        )}
      </div>

      {/* ================= OFFICIAL CERTIFICATE CANVAS ================= */}
      <div 
        id="certificate-frame"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: '#0b1329',
          border: '8px solid #1e293b',
          outline: '2px solid #06b6d4',
          borderRadius: '16px',
          padding: '30px 35px',
          position: 'relative',
          color: '#ffffff',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      >
        {/* Corner Accents */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '70px', height: '70px', borderTop: '4px solid #06b6d4', borderLeft: '4px solid #06b6d4', borderRadius: '12px 0 0 0' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '70px', height: '70px', borderTop: '4px solid #9d4edd', borderRight: '4px solid #9d4edd', borderRadius: '0 12px 0 0' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '70px', height: '70px', borderBottom: '4px solid #9d4edd', borderLeft: '4px solid #9d4edd', borderRadius: '0 0 0 12px' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '70px', height: '70px', borderBottom: '4px solid #06b6d4', borderRight: '4px solid #06b6d4', borderRadius: '0 0 12px 0' }} />

        {/* --- PROMINENT LOGO & BRANDING --- */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '10px' }}>
          <img 
            src="/logo.png" 
            alt="Ln Code Logo" 
            onError={(e) => { 
              // Transparent inline SVG fallback if image fails to load
              e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%2306b6d4'/><text x='50%' y='65%' font-size='50' font-weight='bold' fill='%230b1329' text-anchor='middle'>Ln</text></svg>"; 
            }}
            className="cert-logo-img"
            style={{ 
              width: '70px', 
              height: '70px', 
              objectFit: 'contain',
              mixBlendMode: 'screen',
              display: 'block'
            }} 
          />
          <span style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '1.5px', color: '#06b6d4' }}>
            Ln Code
          </span>
        </div>

        <p style={{ color: '#06b6d4', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '20px' }}>
          Interactive Learning Platform
        </p>

        {/* --- CERTIFICATE TITLE --- */}
        <h1 style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '2px', margin: '0 0 4px 0', textTransform: 'uppercase', color: '#ffffff' }}>
          Certificate of Completion
        </h1>
        <div style={{ width: '120px', height: '3px', background: '#06b6d4', margin: '0 auto 20px auto', borderRadius: '2px' }} />

        {/* --- RECIPIENT DETAILS --- */}
        <p style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic', marginBottom: '6px' }}>
          This is proudly presented to
        </p>

        <h2 style={{ fontSize: '34px', fontWeight: 'bold', color: '#ffffff', margin: '6px 0', borderBottom: '1px dashed #2a3756', display: 'inline-block', paddingBottom: '4px', paddingLeft: '20px', paddingRight: '20px' }}>
          {username}
        </h2>

        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '12px', lineHeight: '1.5', maxWidth: '580px', margin: '12px auto 20px auto' }}>
          For successfully demonstrating proficiency, completing all practical assessments, and mastering the core concepts of
        </p>

        {/* --- LANGUAGE TITLE --- */}
        <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4', borderRadius: '10px', padding: '10px 24px', display: 'inline-block', marginBottom: '25px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#06b6d4', textTransform: 'capitalize' }}>
            {languageName} Master Level
          </span>
        </div>

        {/* --- FOOTER: SIGNATURE, BADGE SEAL & DATE --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #2a3756' }}>
          
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Issued Date:</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>{issueDate}</div>
            <div style={{ fontSize: '11px', color: '#06b6d4', fontFamily: 'monospace' }}>ID: {certId}</div>
          </div>

          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#06b6d4',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ffffff'
          }}>
            <span style={{ fontSize: '18px' }}>🏆</span>
            <span style={{ fontSize: '7px', fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', marginTop: '1px' }}>Verified</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '20px', color: '#06b6d4', marginBottom: '2px' }}>
              Ln Code Team
            </div>
            <div style={{ width: '130px', height: '1px', background: '#94a3b8', margin: '0 0 3px auto' }} />
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Authorized Signature</div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Certificate;