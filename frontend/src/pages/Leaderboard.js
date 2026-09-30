import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://ln-code-backend.onrender.com/api/quiz/leaderboard', {
          headers: { 'x-auth-token': token }
        });
        setLeaders(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard', err);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ padding: '40px', color: 'var(--subtext-color)' }}>
        Loading Rankings...
      </div>
    );
  }

  return (
    <div className="card">
      <h1 className="animated-title" style={{ fontSize: '28px', marginBottom: '8px' }}>
        🏆 Global Leaderboard
      </h1>
      <p style={{ color: 'var(--subtext-color)', marginBottom: '24px', fontSize: '14px' }}>
        Top performers based on total points, active streaks, and earned badges.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table className="history-table">
          <thead>
            <tr style={{ color: 'var(--subtext-color)' }}>
              <th style={{ padding: '12px' }}>Rank</th>
              <th style={{ padding: '12px' }}>Learner</th>
              <th style={{ padding: '12px' }}>Streak</th>
              <th style={{ padding: '12px' }}>Badges</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user, idx) => (
              <tr key={user.id || idx}>
                <td style={{ fontWeight: 'bold', padding: '12px' }}>
                  {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                </td>
                <td style={{ fontWeight: '600', padding: '12px' }}>
                  {user.username}
                </td>
                <td style={{ padding: '12px' }}>
                  🔥 {user.streak} Days
                </td>
                <td style={{ padding: '12px' }}>
                  🏅 {user.badgeCount} Badges
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <strong style={{ color: 'var(--btn-bg)', fontSize: '15px' }}>
                    {user.totalScore} pts
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;