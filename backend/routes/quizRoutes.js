const express = require('express');
const router = express.Router();

const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// ---------------- USER & ROLE MANAGEMENT (ADMIN) ---------------- //

// Fetch All Registered Users
router.get('/admin/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('username email isAdmin streak').sort({ _id: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update User Role (Admin <-> User)
router.put('/admin/user-role/:id', auth, async (req, res) => {
  const { isAdmin } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: Boolean(isAdmin) },
      { new: true }
    ).select('username email isAdmin');
    
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: `Updated ${user.username}'s role`, user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ---------------- QUESTION MANAGEMENT (ADMIN) ---------------- //

// Fetch All Questions
router.get('/admin/questions', auth, async (req, res) => {
  try {
    const questions = await Question.find().sort({ _id: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add New Question
router.post('/admin/question', auth, async (req, res) => {
  const { language, level, question, code, options, answer, explanation } = req.body;
  try {
    const newQuestion = new Question({
      language: language.toLowerCase(),
      level: level.toLowerCase(),
      question,
      code,
      options,
      answer: parseInt(answer),
      explanation
    });
    await newQuestion.save();
    res.json(newQuestion);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete Question
router.delete('/admin/question/:id', auth, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ---------------- QUIZ & GAMEPLAY ROUTES ---------------- //

// Get Questions by Language and Level
router.get('/questions/:language/:level', auth, async (req, res) => {
  try {
    const questions = await Question.find({
      language: req.params.language.toLowerCase(),
      level: req.params.level.toLowerCase()
    }).limit(25);
    res.json(questions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Save Quiz Result, Update Streaks, and Award Badges/Certificates
router.post('/save-history', auth, async (req, res) => {
  const { language, level, score, totalQuestions } = req.body;
  try {
    const user = await User.findById(req.user.id);
    
    user.quizHistory.unshift({
      language,
      level,
      score,
      totalQuestions,
      completedAt: new Date()
    });

    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.lastActiveDate === yesterday) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
      user.lastActiveDate = today;
    }

    const newBadges = new Set(user.badges || []);
    if (user.streak >= 3) newBadges.add('🔥 3-Day Streak');
    if (user.streak >= 7) newBadges.add('⚡ 7-Day Warrior');
    if (score === totalQuestions) newBadges.add('🎯 Perfect Score');
    if (user.quizHistory.length >= 1) newBadges.add('🌱 First Quiz');
    if (user.quizHistory.length >= 5) newBadges.add('📚 Quiz Enthusiast');
    user.badges = Array.from(newBadges);

    const history = user.quizHistory || [];
    const langLevelsCompleted = new Set(
      history.filter(h => h.language === language && (h.score / h.totalQuestions) >= 0.5).map(h => h.level)
    );

    if (langLevelsCompleted.has('beginner') && langLevelsCompleted.has('intermediate') && langLevelsCompleted.has('veteran')) {
      if (!user.completedLanguages.includes(language)) {
        user.completedLanguages.push(language);
      }
    }

    await user.save();
    res.json({ msg: 'Quiz saved successfully!', streak: user.streak, badges: user.badges });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Fetch User Quiz History
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('quizHistory');
    res.json(user.quizHistory || []);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Toggle Bookmark
router.post('/bookmark', auth, async (req, res) => {
  const { questionId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const index = user.bookmarks.indexOf(questionId);
    if (index === -1) {
      user.bookmarks.push(questionId);
    } else {
      user.bookmarks.splice(index, 1);
    }
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Fetch Bookmarks
router.get('/bookmarks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');
    res.json(user.bookmarks || []);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Fetch Leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('username streak badges quizHistory completedLanguages')
      .lean();

    const leaderboard = users.map(user => {
      const totalScore = (user.quizHistory || []).reduce((acc, curr) => acc + curr.score, 0);
      return {
        id: user._id,
        username: user.username,
        streak: user.streak || 0,
        badgeCount: (user.badges || []).length,
        completedCount: (user.completedLanguages || []).length,
        totalScore
      };
    }).sort((a, b) => b.totalScore - a.totalScore).slice(0, 10);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Fetch Gamification & Profile Stats
router.get('/profile-stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email streak badges completedLanguages');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Fetch Analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const history = user.quizHistory || [];

    const totalQuizzes = history.length;
    let totalScore = 0;
    let totalQuestionsAttempted = 0;
    const languageStats = {};

    history.forEach((entry) => {
      totalScore += entry.score;
      totalQuestionsAttempted += entry.totalQuestions;

      if (!languageStats[entry.language]) {
        languageStats[entry.language] = { score: 0, total: 0, attempts: 0 };
      }
      languageStats[entry.language].score += entry.score;
      languageStats[entry.language].total += entry.totalQuestions;
      languageStats[entry.language].attempts += 1;
    });

    const weaknesses = [];
    Object.keys(languageStats).forEach((lang) => {
      const accuracy = Math.round((languageStats[lang].score / languageStats[lang].total) * 100);
      languageStats[lang].accuracy = accuracy;
      if (accuracy < 70) {
        weaknesses.push({ language: lang, accuracy });
      }
    });

    const overallAccuracy = totalQuestionsAttempted > 0 
      ? Math.round((totalScore / totalQuestionsAttempted) * 100) 
      : 0;

    res.json({
      totalQuizzes,
      totalScore,
      totalQuestionsAttempted,
      overallAccuracy,
      languageStats,
      weaknesses
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;