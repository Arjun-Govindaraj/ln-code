import React from 'react';
import { useNavigate } from 'react-router-dom';

function LanguageSelect() {
  const navigate = useNavigate();
  const languages = ['Python', 'JavaScript', 'HTML', 'Java', 'C'];

  return (
    <div className="card">
      <h2>Select Coding Language</h2>
      <div style={{ margin: '20px 0' }}>
        {languages.map((lang) => (
          <button key={lang} className="btn" onClick={() => navigate(`/levels/${lang.toLowerCase()}`)}>
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSelect;