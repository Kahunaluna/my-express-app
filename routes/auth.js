const express = require("express");
const GameUser = require("../models/User");

const router = express.Router();

router.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await GameUser.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const newUser = new GameUser({ username, password });
    await newUser.save();

    req.session.userId = newUser._id;
    req.session.username = newUser.username;

    res.json({ 
      success: true, 
      message: "Registration successful!", 
      user: { 
        id: newUser._id, 
        username: newUser.username
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error registering user" });
  }
});

router.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await GameUser.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.json({ 
      success: true, 
      message: "Login successful!", 
      user: { 
        id: user._id, 
        username: user.username 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error logging in" });
  }
});

router.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Error logging out" });
    }
    res.json({ success: true, message: "Logout successful!" });
  });
});

router.get("/api/auth/check", (req, res) => {
  if (req.session.userId) {
    res.json({ 
      authenticated: true, 
      user: { 
        id: req.session.userId, 
        username: req.session.username 
      } 
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
