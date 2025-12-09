// auth/googleStrategy.js
"use strict";

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Use env var so we can have one URL for local dev and one for Render
const CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:3000/auth/google/callback";

console.log("Using Google OAuth callback URL:", CALLBACK_URL);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile) {
          return done(new Error("No Google profile"));
        }

        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : "";

        const user = {
          id: profile.id,
          displayName: profile.displayName || email,
          email,
        };

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});