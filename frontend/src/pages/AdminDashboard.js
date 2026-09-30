import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState('python');
  const [level, setLevel] = useState('beginner');
  const [questionText, setQuestionText] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [explanation, setExplanation] = useState('');

  const token = localStorage.getItem('token');
  const config = { headers: { 'x-auth-token': token } };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('https://ln-code-backend.onrender.com/api/quiz/admin/questions', config);
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching questions', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://ln-code-backend.onrender.com/api/quiz/admin/users', config);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      await Promise.all([fetchQuestions(), fetchUsers()]);
      setLoading(false);
    };
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        language,
        level,
        question: questionText,
        code: codeSnippet,
        options,
        answer: answerIndex,
        explanation
      };
      await axios.post('https://ln-code-backend.onrender.com/api/quiz/admin/question', payload, config);
      alert('Question added successfully!');
      setQuestionText('');
      setCodeSnippet('');
      setOptions(['', '', '', '']);
      setExplanation('');
      fetchQuestions();
    } catch (err) {
      alert('Failed to add question');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await axios.delete(`https://ln-code-backend.onrender.com/api/quiz/admin/question/${id}`, config);
      fetchQuestions();
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  const handleToggleAdmin = async (id, currentStatus) => {
    try {
      await axios.put(`https://ln-code-backend.onrender.com/api/quiz/admin/user-role/${id}`, { isAdmin: !currentStatus }, config);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  if (loading) return <div className="card" style={{ padding: '20px', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <h2 className="animated-title" style={{ fontSize: '28px', margin: 0 }}>⚡ Admin Management Control Panel</h2>

      {/* Add New Question Form */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ marginTop: 0 }}>➕ Add New Question</h3>
        <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Language:</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
                <option value="java">Java</option>
                <option value="c">C</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Level:</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="veteran">Veteran</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Question:</label>
            <input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Code Snippet (Optional):</label>
            <textarea value={codeSnippet} onChange={(e) => setCodeSnippet(e.target.value)} rows="3" style={{ width: '100%', padding: '8px', fontFamily: 'monospace' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {options.map((opt, idx) => (
              <div key={idx}>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Option {idx + 1}:</label>
                <input type="text" value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)} required style={{ width: '100%', padding: '8px' }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Correct Option Index (0-3):</label>
              <select value={answerIndex} onChange={(e) => setAnswerIndex(parseInt(e.target.value))} style={{ width: '100%', padding: '8px' }}>
                <option value={0}>Option 1 (Index 0)</option>
                <option value={1}>Option 2 (Index 1)</option>
                <option value={2}>Option 3 (Index 2)</option>
                <option value={3}>Option 4 (Index 3)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Explanation:</label>
            <input type="text" value={explanation} onChange={(e) => setExplanation(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </div>

          <button type="submit" className="btn" style={{ padding: '10px', marginTop: '10px' }}>Save Question</button>
        </form>
      </div>

      {/* User Management Table */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ marginTop: 0 }}>👥 Registered Users ({users.length})</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color, #334155)' }}>
                <th style={{ padding: '8px' }}>Username</th>
                <th style={{ padding: '8px' }}>Email</th>
                <th style={{ padding: '8px' }}>Role</th>
                <th style={{ padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color, #334155)' }}>
                  <td style={{ padding: '8px' }}>{u.username}</td>
                  <td style={{ padding: '8px' }}>{u.email}</td>
                  <td style={{ padding: '8px' }}>{u.isAdmin ? '👑 Admin' : '👤 User'}</td>
                  <td style={{ padding: '8px' }}>
                    <button onClick={() => handleToggleAdmin(u._id, u.isAdmin)} className="btn" style={{ padding: '4px 8px', fontSize: '12px' }}>
                      Toggle Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Question Bank Manager */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ marginTop: 0 }}>📚 Question Bank ({questions.length})</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {questions.map((q) => (
            <div key={q._id} style={{ padding: '10px', background: 'var(--option-bg, #1e293b)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--btn-bg, #06b6d4)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {q.language} • {q.level}
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>{q.question}</p>
              </div>
              <button onClick={() => handleDeleteQuestion(q._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;