import React from 'react';

function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px' }}>
      <div className="card" style={{ padding: '40px 30px', textAlign: 'center' }}>
        <h2 className="animated-title" style={{ fontSize: '32px', marginBottom: '15px' }}>
          About CodeLearn
        </h2>
        <p style={{ color: 'var(--subtext-color, #94a3b8)', fontSize: '16px', lineHeight: '1.7', margin: '0 auto 25px auto', maxWidth: '650px' }}>
          CodeLearn is a modern, interactive learning platform engineered to help students master core programming languages through structured quizzes, real-time feedback, detailed question explanations, and interactive progress analytics.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
          <div style={{ background: 'var(--option-bg, #1e293b)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color, #334155)' }}>
            <span style={{ fontSize: '30px' }}>📚</span>
            <h4 style={{ margin: '10px 0 6px 0', color: '#fff' }}>5 Core Tracks</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--subtext-color, #94a3b8)' }}>Python, JavaScript, HTML, Java, and C Programming</p>
          </div>

          <div style={{ background: 'var(--option-bg, #1e293b)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color, #334155)' }}>
            <span style={{ fontSize: '30px' }}>🎯</span>
            <h4 style={{ margin: '10px 0 6px 0', color: '#fff' }}>375 Unique Qs</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--subtext-color, #94a3b8)' }}>Comprehensive beginner to veteran level questions</p>
          </div>

          <div style={{ background: 'var(--option-bg, #1e293b)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color, #334155)' }}>
            <span style={{ fontSize: '30px' }}>📊</span>
            <h4 style={{ margin: '10px 0 6px 0', color: '#fff' }}>Live Analytics</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--subtext-color, #94a3b8)' }}>Interactive skill charts and weaknesses tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;