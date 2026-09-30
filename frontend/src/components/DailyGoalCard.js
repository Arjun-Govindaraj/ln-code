import React from 'react';

function DailyGoalCard({ quizzesDoneToday = 0, target = 3 }) {
  const percentage = Math.min(Math.round((quizzesDoneToday / target) * 100), 100);
  
  // SVG Ring Geometry
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStatusText = () => {
    if (quizzesDoneToday >= target) return '🎉 Goal Reached!';
    if (quizzesDoneToday > 0) return '⚡ Keep it up!';
    return '🚀 Start your first quiz!';
  };

  return (
    <div style={{
      background: 'var(--card-bg, #151e38)',
      borderRadius: '16px',
      padding: '20px 24px',
      border: '1px solid var(--border-color, #2a3756)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '20px',
      minWidth: '320px'
    }}>
      
      {/* Dynamic SVG Circular Ring */}
      <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
        <svg width="84" height="84" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track Background */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="var(--border-color, #2a3756)"
            strokeWidth="10"
          />
          {/* Active Progress Fill */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#06b6d4"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>

        {/* Center Percentage */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '18px',
          color: 'var(--text-color, #ffffff)'
        }}>
          {percentage}%
        </div>
      </div>

      {/* Goal Details */}
      <div style={{ textAlign: 'left' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--text-color, #ffffff)' }}>
          Daily Goal
        </h3>
        <p style={{ margin: '4px 0', fontSize: '14px', color: 'var(--subtext-color, #94a3b8)' }}>
          {quizzesDoneToday} of {target} Quizzes Done
        </p>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#06b6d4' }}>
          {getStatusText()}
        </span>
      </div>

    </div>
  );
}

export default DailyGoalCard;