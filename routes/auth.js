"use strict";

const express = require("express");
const passport = require("passport");
const router = express.Router();

// Kick off Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback from Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173", // can show error later if you want
  }),
  (req, res) => {
    // On success, send them back to the React app
    res.redirect("http://localhost:5173");
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