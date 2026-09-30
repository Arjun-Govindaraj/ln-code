import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Quiz() {
  const { lang, level } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        
        const [qRes, bRes] = await Promise.all([
          axios.get(`https://ln-code-backend.onrender.com/api/quiz/questions/${lang}/${level}`, config),
          axios.get('https://ln-code-backend.onrender.com/api/quiz/bookmarks', config)
        ]);

        setQuestions(qRes.data);
        setBookmarkedIds(bRes.data.map(q => q._id));
        setLoading(false);
      } catch (err) {
        alert('Failed to load quiz data');
      }
    };
    fetchData();
  }, [lang, level]);

  useEffect(() => {
    if (loading || isAnswered || questions.length === 0) return;
    if (timeLeft === 0) {
      setIsAnswered(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, loading, questions]);

  const toggleBookmark = async (qId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('https://ln-code-backend.onrender.com/api/quiz/bookmark', 
        { questionId: qId },
        { headers: { 'x-auth-token': token } }
      );
      setBookmarkedIds(res.data.bookmarks);
    } catch (err) {
      console.error('Failed to bookmark', err);
    }
  };

  const handleAnswer = (index) => {
    if (isAnswered) return;
    setSelectedOpt(index);
    setIsAnswered(true);
    if (index === questions[currentIdx].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOpt(null);
    setTimeLeft(30);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      saveProgress();
    }
  };

  const saveProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://ln-code-backend.onrender.com/api/quiz/save-history', 
        { language: lang, level, score, totalQuestions: questions.length },
        { headers: { 'x-auth-token': token } }
      );
      alert('🎉 Quiz Complete! Progress & achievements updated.');
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div className="card">Loading Questions...</div>;
  if (questions.length === 0) return <div className="card">No questions found!</div>;

  const q = questions[currentIdx];
  const isBookmarked = bookmarkedIds.includes(q._id);

  return (
    <div className="card" style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <span>Question {currentIdx + 1} / {questions.length}</span>
        <span className="timer">⏱️ {timeLeft}s</span>
        <span>Score: {score}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{q.question}</h3>
        <button 
          onClick={() => toggleBookmark(q._id)} 
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px' }}
          title="Save for review"
        >
          {isBookmarked ? '⭐' : '☆'}
        </button>
      </div>

      {q.code && <div className="code"><pre>{q.code}</pre></div>}

      <div className="options">
        {q.options.map((opt, i) => {
          let className = "option";
          if (isAnswered) {
            if (i === q.answer) className += " correct";
            else if (i === selectedOpt) className += " wrong";
          }
          return (
            <button key={i} className={className} disabled={isAnswered} onClick={() => handleAnswer(i)}>
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="explanation">
          <strong>💡 Explanation:</strong>
          <p>{q.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button className="btn" style={{ float: 'right', marginTop: '15px' }} onClick={handleNext}>
          {currentIdx + 1 === questions.length ? 'Finish & Save' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

export default Quiz;