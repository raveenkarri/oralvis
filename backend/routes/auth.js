// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Registration
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });

    if (user) {
      return res.status(409).json({ error: 'Already Registered! Please Login' });
    }

    try {
     
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = "INSERT INTO users(email, password, role) VALUES (?, ?, ?)";
      db.run(sql, [email, hashedPassword, role], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ message: "Registration Successful" });
      });
    } catch (hashErr) {
      res.status(500).json({ error: hashErr.message });
    }
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, role: user.role });
  });
});

module.exports = router;
