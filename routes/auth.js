// routes/auth.js
"use strict";

const express = require("express");
const passport = require("passport");

const router = express.Router();

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: FRONTEND_URL,
  }),
  (req, res) => {
    // Successful auth – send user back to frontend
    res.redirect(FRONTEND_URL);
  }
);

router.post("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
});

module.exports = router;