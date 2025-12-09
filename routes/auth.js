// routes/auth.js
"use strict";

const express = require("express");
const passport = require("passport");

const router = express.Router();

// Where we send the browser after login / failure.
// Local:  http://localhost:5173
// Prod:   https://tastyfinal.onrender.com  (set via env var on Render)
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

// Kick off Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback from Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: FRONTEND_URL,
  }),
  (req, res) => {
    // On success, send them back to the React app
    res.redirect(FRONTEND_URL);
  }
);

// Logout
router.post("/logout", (req, res) => {
  req.logout(err => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).json({ error: "Failed to log out" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });
});

module.exports = router;