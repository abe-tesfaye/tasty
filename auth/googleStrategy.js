"use strict";

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Safety check for missing environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error(
    "❌ Missing Google OAuth environment variables. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file."
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Store minimal user info in session
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        email:
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : "",
      };

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user); // For class project, okay to store whole user
});

passport.deserializeUser((user, done) => {
  done(null, user);
});