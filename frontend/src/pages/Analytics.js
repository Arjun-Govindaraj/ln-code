import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

function Analytics() {
  const [data, setData] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsAndBookmarks = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      try {
        const [analyticsRes, bookmarksRes] = await Promise.all([
          axios.get('https://ln-code-backend.onrender.com/api/quiz/analytics', config),
          axios.get('https://ln-code-backend.onrender.com/api/quiz/bookmarks', config)
        ]);
        setData(analyticsRes.data);
        setBookmarks(Array.isArray(bookmarksRes.data) ? bookmarksRes.data : []);
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsAndBookmarks();
  }, []);

  const handleRemoveBookmark = async (questionId) => {
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    try {
      await axios.post('https://ln-code-backend.onrender.com/api/quiz/bookmark', { questionId }, config);
      setBookmarks((prev) => prev.filter((b) => b._id !== questionId));
    } catch (err) {
      console.error('Failed to remove bookmark', err);
    }
  };

  if (loading) return <div className="card" style={{ padding: '20px', textAlign: 'center' }}>Loading Advanced Analytics...</div>;
  if (!data) return <div className="card" style={{ padding: '20px', textAlign: 'center' }}>Failed to load analytics data.</div>;

  const langKeys = Object.keys(data.languageStats || {});

  const chartData = langKeys.map((lang) => ({
    language: lang.toUpperCase(),
    Attempts: data.languageStats[lang].attempts,
    Accuracy: data.languageStats[lang].accuracy,
    Score: data.languageStats[lang].score
  }));

  const pieData = langKeys.map((lang) => ({
    name: lang.toUpperCase(),
    value: data.languageStats[lang].attempts
  }));

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* 1. Learning Analytics Summary Card */}
      <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
        <h2 className="animated-title" style={{ fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          📊 Learning Analytics
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ background: 'var(--option-bg, #1e293b)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color, #334155)' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{data.totalQuizzes}</div>
            <div style={{ color: 'var(--subtext-color, #94a3b8)', fontSize: '14px', marginTop: '4px' }}>Quizzes Done</div>
          </div>

          <div style={{ background: 'var(--option-bg, #1e293b)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color, #334155)' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{data.totalQuestionsAttempted}</div>
            <div style={{ color: 'var(--subtext-color, #94a3b8)', fontSize: '14px', marginTop: '4px' }}>Questions Answered</div>
          </div>

          <div style={{ background: 'var(--option-bg, #1e293b)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color, #334155)' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--btn-bg, #06b6d4)' }}>{data.overallAccuracy}%</div>
            <div style={{ color: 'var(--subtext-color, #94a3b8)', fontSize: '14px', marginTop: '4px' }}>Accuracy</div>
          </div>
        </div>
      </div>

      {/* 2. Advanced Graph Suite */}
      {chartData.length > 0 && (
        <>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', color: 'var(--text-color)' }}>
              📈 Accuracy vs. Quiz Attempts
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="language" stroke="var(--subtext-color, #94a3b8)" />
                  <YAxis stroke="var(--subtext-color, #94a3b8)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-color, #0f172a)',
                      borderColor: 'var(--border-color, #334155)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Accuracy" fill="#06b6d4" name="Accuracy (%)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Attempts" fill="#8b5cf6" name="Total Attempts" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>🎯 Mastery Radar</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="rgba(255,255,255,0.15)" />
                    <PolarAngleAxis dataKey="language" stroke="var(--subtext-color, #94a3b8)" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="transparent" />
                    <Radar name="Accuracy" dataKey="Accuracy" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>🍰 Quiz Volume Share</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 3. Weakness Analysis Card */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⚠️ Weakness Analysis
        </h3>
        {data.weaknesses && data.weaknesses.length > 0 ? (
          <div>
            <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '10px' }}>
              The following languages require attention (Accuracy below 70%):
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-color)' }}>
              {data.weaknesses.map((w, idx) => (
                <li key={idx} style={{ margin: '6px 0', fontWeight: 'bold' }}>
                  {w.language.toUpperCase()} — <span style={{ color: '#ef4444' }}>{w.accuracy}% Accuracy</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p style={{ color: '#10b981', margin: 0, fontSize: '14px' }}>
            🎉 Great performance! All practiced languages are above 70% accuracy.
          </p>
        )}
      </div>

      {/* 4. Bookmarked Questions Card */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⭐ Bookmarked Questions ({bookmarks.length})
        </h3>
        {bookmarks.length === 0 ? (
          <p style={{ color: 'var(--subtext-color, #94a3b8)', margin: 0, fontSize: '14px' }}>
            No saved questions yet. Click ☆ during a quiz to save questions here.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            {bookmarks.map((b, idx) => (
              <div
                key={b._id || idx}
                style={{
                  padding: '14px 16px',
                  background: 'var(--option-bg, #1e293b)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, #334155)',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--btn-bg, #06b6d4)', textTransform: 'uppercase' }}>
                    {b.language} • {b.level}
                  </span>
                  <p style={{ margin: '6px 0 0 0', fontWeight: '500', fontSize: '14px', color: 'var(--text-color, #fff)' }}>
                    {b.question}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveBookmark(b._id)}
                  title="Remove Bookmark"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                >
                  ✖ Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Analytics;