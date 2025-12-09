"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

require("./auth/googleStrategy");

const recipesRoutes = require("./routes/recipes");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Needed on Render so secure cookies & X-Forwarded-* work
if (isProduction) {
  app.set("trust proxy", 1);
}

// CORS: allow React frontends
const allowedOrigins = isProduction
  ? [
      "https://tastyfinal.onrender.com", // your Render static site
    ]
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Session middleware (must come before passport.session)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // For Render (different domains) we need cross-site cookies:
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction, // only secure cookies on HTTPS
    },
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use("/api/recipes", recipesRoutes);
app.use("/auth", authRoutes);

// Simple "am I logged in?" route
app.get("/auth/status", (req, res) => {
  if (req.user) {
    return res.json({ loggedIn: true, user: req.user });
  }
  res.json({ loggedIn: false });
});

app.listen(PORT, () => {
  console.log(`Tasty backend listening on port ${PORT}`);
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tastyfinal.onrender.com",
    ],
    credentials: true,
  })
);