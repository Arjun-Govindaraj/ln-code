import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Username States
  const [newUsername, setNewUsername] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    try {
      const res = await axios.get('https://ln-code-backend.onrender.com/api/quiz/profile-stats', config);
      setUser(res.data);
      setNewUsername(res.data.username || '');
    } catch (err) {
      console.error('Failed to fetch profile stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handler for Updating Username
  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return alert('Username cannot be empty');

    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    try {
      const res = await axios.put(
        'https://ln-code-backend.onrender.com/api/auth/update-profile',
        { username: newUsername.trim() },
        config
      );
      alert(res.data.msg);
      setIsEditingName(false);
      fetchProfile(); // Refresh profile header with new name
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update username');
    }
  };

  // Handler for Changing Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    try {
      const res = await axios.put(
        'https://ln-code-backend.onrender.com/api/auth/change-password',
        { currentPassword, newPassword },
        config
      );
      alert(res.data.msg);
      setCurrentPassword('');
      setNewPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update password');
    }
  };

  // Handler for Resetting Progress
  const handleResetAccount = async () => {
    if (!window.confirm('⚠️ WARNING: This will permanently reset all your quiz history, streaks, badges, and bookmarks. Continue?')) {
      return;
    }

    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    try {
      const res = await axios.post('https://ln-code-backend.onrender.com/api/auth/reset-account', {}, config);
      alert(res.data.msg);
      fetchProfile();
    } catch (err) {
      alert('Failed to reset account progress');
    }
  };

  if (loading) return <div className="card" style={{ padding: '20px', textAlign: 'center' }}>Loading Profile...</div>;
  if (!user) return <div className="card" style={{ padding: '20px', textAlign: 'center' }}>Failed to load profile.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Profile Header Card */}
      <div className="card" style={{ padding: '25px', textAlign: 'center' }}>
        
        {/* Username Display & Edit Form */}
        {!isEditingName ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
            <h2 className="animated-title" style={{ fontSize: '28px', margin: 0 }}>
              👤 {user.username}'s Profile
            </h2>
            <button
              onClick={() => setIsEditingName(true)}
              style={{
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                color: 'var(--btn-bg, #06b6d4)',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Edit Username"
            >
              ✏️ Edit Name
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateUsername} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              required
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color, #334155)',
                background: 'var(--option-bg, #0f172a)',
                color: '#fff',
                fontSize: '16px'
              }}
            />
            <button type="submit" className="btn" style={{ padding: '8px 14px', fontSize: '14px' }}>Save</button>
            <button
              type="button"
              onClick={() => {
                setIsEditingName(false);
                setNewUsername(user.username);
              }}
              style={{
                padding: '8px 14px',
                background: 'transparent',
                border: '1px solid var(--border-color, #334155)',
                color: '#fff',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </form>
        )}

        <p style={{ color: 'var(--subtext-color, #94a3b8)', margin: '0 0 20px 0' }}>{user.email}</p>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          <div style={{ background: 'var(--option-bg, #1e293b)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color, #334155)' }}>
            <span style={{ fontSize: '24px' }}>🔥</span>
            <h4 style={{ margin: '5px 0', color: 'var(--subtext-color, #94a3b8)' }}>Current Streak</h4>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--btn-bg, #06b6d4)' }}>{user.streak || 0} Days</span>
          </div>

          <div style={{ background: 'var(--option-bg, #1e293b)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color, #334155)' }}>
            <span style={{ fontSize: '24px' }}>🏅</span>
            <h4 style={{ margin: '5px 0', color: 'var(--subtext-color, #94a3b8)' }}>Badges Earned</h4>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>{(user.badges || []).length} Badges</span>
          </div>

          <div style={{ background: 'var(--option-bg, #1e293b)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color, #334155)' }}>
            <span style={{ fontSize: '24px' }}>📜</span>
            <h4 style={{ margin: '5px 0', color: 'var(--subtext-color, #94a3b8)' }}>Certificates</h4>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>{(user.completedLanguages || []).length} Completed</span>
          </div>
        </div>
      </div>

      {/* Unlocked Badges */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>🎖️ Unlocked Badges</h3>
        {(user.badges || []).length === 0 ? (
          <p style={{ color: 'var(--subtext-color, #94a3b8)', margin: 0 }}>No badges unlocked yet. Keep practicing!</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {user.badges.map((b, idx) => (
              <span
                key={idx}
                className="badge-item"
                style={{
                  background: 'var(--option-bg, #1e293b)',
                  border: '1px solid var(--btn-bg, #06b6d4)',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#fff'
                }}
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>⚙️ Account Settings</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Password Management */}
          <div>
            {!showPasswordForm ? (
              <button onClick={() => setShowPasswordForm(true)} className="btn" style={{ padding: '8px 16px', fontSize: '14px' }}>
                🔑 Change Password
              </button>
            ) : (
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--option-bg)', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>Update Password</h4>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: '#fff' }}
                />
                <input
                  type="password"
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: '#fff' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <button type="submit" className="btn" style={{ padding: '8px 14px', fontSize: '13px' }}>Update Password</button>
                  <button type="button" onClick={() => setShowPasswordForm(false)} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                </div>
              </form>
            )}
          </div>

          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.2 }} />

          {/* Reset Account Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#ef4444' }}>Reset Progress Data</h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--subtext-color)' }}>Wipe out all quiz history, streaks, and badges to start fresh.</p>
            </div>
            <button
              onClick={handleResetAccount}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              🔄 Reset Progress
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Profile;