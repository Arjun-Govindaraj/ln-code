import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await axios.post('https://ln-code-backend.onrender.com/api/users/register', {
        username: username.trim(),
        email: email.trim(),
        password
      });

      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setErrorMsg(err.response.data.msg);
      } else {
        setErrorMsg('Registration failed. Please check backend connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '60px auto', padding: '0 20px' }}>
      <div className="card" style={{ padding: '35px 30px', textAlign: 'center' }}>
        <h2 className="animated-title" style={{ fontSize: '28px', marginBottom: '8px', color: '#fff' }}>
          Create Account
        </h2>
        <p style={{ color: 'var(--subtext-color, #94a3b8)', fontSize: '14px', marginBottom: '25px' }}>
          Join CodeLearn to start practicing and tracking your skills.
        </p>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              textAlign: 'center',
              marginBottom: '20px',
              fontWeight: '500'
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: 'var(--subtext-color, #94a3b8)' }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="e.g. Arjun"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #334155)',
                background: 'var(--option-bg, #1e293b)',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: 'var(--subtext-color, #94a3b8)' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="e.g. arjun@example.com"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #334155)',
                background: 'var(--option-bg, #1e293b)',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: 'var(--subtext-color, #94a3b8)' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #334155)',
                background: 'var(--option-bg, #1e293b)',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{
              padding: '12px',
              fontSize: '15px',
              fontWeight: 'bold',
              marginTop: '10px',
              width: '100%',
              borderRadius: '8px',
              background: 'var(--btn-bg, #06b6d4)',
              color: '#000',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '14px', color: 'var(--subtext-color, #94a3b8)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--btn-bg, #06b6d4)', textDecoration: 'none', fontWeight: 'bold' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;