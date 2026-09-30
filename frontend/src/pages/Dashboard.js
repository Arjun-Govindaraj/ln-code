import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ streak: 0, badges: [], completedLanguages: [] });

  // Time-Based Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good morning', icon: '☀️' };
    if (hour >= 12 && hour < 13) return { text: 'Good noon', icon: '🌤️' };
    if (hour >= 13 && hour < 17) return { text: 'Good afternoon', icon: '☀️' };
    if (hour >= 17 && hour < 21) return { text: 'Good evening', icon: '🌆' };
    return { text: 'Good night', icon: '🌙' };
  };

  const greeting = getGreeting();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };

        const [histRes, statsRes] = await Promise.all([
          axios.get('https://ln-code-backend.onrender.com/api/quiz/history', config),
          axios.get('https://ln-code-backend.onrender.com/api/quiz/profile-stats', config)
        ]);

        setHistory(histRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };
    fetchData();
  }, []);

  // Strict Dynamic Streak Calculation
  const computeStreak = (historyList) => {
    if (!historyList || historyList.length === 0) return 0;

    // Extract local YYYY-MM-DD dates to ignore timezone/time offsets
    const uniqueDates = historyList
      .map(item => {
        const d = new Date(item.completedAt || item.createdAt);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => new Date(b) - new Date(a));

    if (uniqueDates.length === 0) return 0;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    // If no quiz was taken today AND no quiz was taken yesterday, streak resets to 0
    if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
      return 0;
    }

    let count = 1;
    let curr = new Date(uniqueDates[0]);

    for (let i = 1; i < uniqueDates.length; i++) {
      curr.setDate(curr.getDate() - 1);
      const expectedStr = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;

      if (uniqueDates[i] === expectedStr) {
        count++;
      } else {
        break; // Consecutive streak broken
      }
    }

    return count;
  };

  // Daily Activity Ring Calculation (Goal: 3 Quizzes per day)
  const dailyTarget = 3;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const completedToday = history.filter(item => {
    const attemptDate = new Date(item.completedAt || item.createdAt);
    return attemptDate >= startOfToday;
  }).length;

  const progressPercent = Math.min(Math.round((completedToday / dailyTarget) * 100), 100);

  // SVG Circular Ring Setup
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Always compute live streak from actual quiz attempt dates
  const activeStreak = computeStreak(history);

  return (
    <div>
      {/* ================= HEADER HERO BANNER ================= */}
      <div className="card" style={{ padding: '36px 28px', textAlign: 'center' }}>
        
        {/* Welcome Name First */}
        <h1 
          className="animated-title" 
          style={{ fontSize: '38px', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '-0.5px' }}
        >
          Welcome, {stats.username || 'Learner'}!
        </h1>

        {/* Time Greeting Below Name */}
        <div style={{ fontSize: '16px', color: 'var(--subtext-color)', marginBottom: '28px', fontWeight: '500' }}>
          {greeting.icon} {greeting.text}!
        </div>

        {/* Lower Grid: Metrics + Activity Ring */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-color)'
          }}
        >
          {/* Left Side: Stats Pills & Start Quiz Button */}
          <div style={{ flex: '1', minWidth: '280px', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span 
                className="badge-item"
                style={{ 
                  background: 'var(--option-bg)', 
                  border: '1px solid var(--border-color)',
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  fontSize: '14px', 
                  fontWeight: 'bold' 
                }}
              >
                🔥 Streak: <span style={{ color: '#f97316' }}>{activeStreak} Days</span>
              </span>

              <span 
                className="badge-item"
                style={{ 
                  background: 'var(--option-bg)', 
                  border: '1px solid var(--border-color)',
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  fontSize: '14px', 
                  fontWeight: 'bold' 
                }}
              >
                🏅 Badges: <span style={{ color: '#eab308' }}>{(stats.badges || []).length}</span>
              </span>
            </div>

            <button className="btn" onClick={() => navigate('/languages')} style={{ padding: '12px 24px', fontSize: '15px' }}>
              Start New Quiz 🚀
            </button>
          </div>

          {/* Right Side: Interactive Progress Ring */}
          <div 
            style={{ 
              background: 'var(--option-bg)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '16px', 
              padding: '18px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              minWidth: '240px'
            }}
          >
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg width="80" height="80" viewBox="0 0 88 88" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="44"
                  cy="44"
                  r={radius}
                  stroke="var(--border-color)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="44"
                  cy="44"
                  r={radius}
                  stroke="var(--btn-bg)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 'bold', 
                  fontSize: '14px',
                  color: 'var(--text-color)'
                }}
              >
                {progressPercent}%
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>
                Daily Goal
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--subtext-color)' }}>
                {completedToday} of {dailyTarget} Quizzes Done
              </div>
              <div style={{ fontSize: '11px', color: 'var(--btn-bg)', marginTop: '4px', fontWeight: '600' }}>
                {progressPercent >= 100 ? '🎉 Goal Achieved!' : '⚡ Keep it up!'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= BADGES SECTION ================= */}
      <div className="card" style={{ marginTop: '20px', textAlign: 'left' }}>
        <h2>🏅 Unlocked Badges</h2>
        {(!stats.badges || stats.badges.length === 0) ? (
          <p style={{ color: 'var(--subtext-color)', marginTop: '10px' }}>
            No badges unlocked yet. Take quizzes daily to earn badges!
          </p>
        ) : (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
            {stats.badges.map((badge, i) => (
              <span key={i} className="badge-item" style={{ background: 'var(--option-bg)', border: '1px solid var(--border-color)', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ================= CERTIFICATES SECTION ================= */}
      <div className="card" style={{ marginTop: '20px', textAlign: 'left' }}>
        <h2>🎓 Language Completion Certificates</h2>
        {(!stats.completedLanguages || stats.completedLanguages.length === 0) ? (
          <p style={{ color: 'var(--subtext-color)', marginTop: '10px' }}>
            Complete Beginner, Intermediate, and Veteran levels in a language to earn your certificate!
          </p>
        ) : (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
            {stats.completedLanguages.map((lang, i) => (
              <Link key={i} to={`/certificate/${lang}`} className="btn" style={{ textDecoration: 'none' }}>
                📜 View {lang.toUpperCase()} Certificate
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ================= RECENT HISTORY TABLE ================= */}
      <div className="card" style={{ marginTop: '20px', textAlign: 'left' }}>
        <h2>📊 Your Recent Quiz History</h2>
        {history.length === 0 ? (
          <p style={{ marginTop: '15px', color: 'var(--subtext-color)' }}>No quiz attempts recorded yet.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Language</th>
                <th>Level</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td style={{ textTransform: 'capitalize' }}>{item.language}</td>
                  <td style={{ textTransform: 'capitalize' }}>{item.level}</td>
                  <td><strong>{item.score} / {item.totalQuestions}</strong></td>
                  <td>{new Date(item.completedAt || item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;