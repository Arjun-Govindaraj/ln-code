import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function LevelSelect() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const levels = ['Beginner', 'Intermediate', 'Veteran'];

  return (
    <div className="card">
      <h2>Select Difficulty Level ({lang.toUpperCase()})</h2>
      <div style={{ margin: '20px 0' }}>
        {levels.map((lvl) => (
          <button key={lvl} className="btn" onClick={() => navigate(`/quiz/${lang}/${lvl.toLowerCase()}`)}>
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LevelSelect;