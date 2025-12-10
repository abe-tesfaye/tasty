// routes/auth.js
"use strict";

const express = require("express");
const passport = require("passport");

const router = express.Router();

// Where to send the user AFTER a successful login
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Start the Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}?login=failed`,
    session: true,
  }),
  (req, res) => {
    // On success, send them back to the frontend
    res.redirect(FRONTEND_URL);
  }
);

// Logout
router.post("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
});

module.exports = router;