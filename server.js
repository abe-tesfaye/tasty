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

// Allow Render / proxies to set correct IP info (safe to add)
app.set("trust proxy", 1);

// CORS: allow React dev servers + (later) your deployed frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      // add your deployed frontend URL here later, e.g.:
      // "https://tasty-frontend.onrender.com",
      // or Netlify/Vercel URL
    ],
    credentials: true
  })
);

app.use(express.json());

// Session middleware (must come before passport.session)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false
    // for production with HTTPS + cross-site cookies, you could later
    // tweak cookie: { secure: true, sameSite: "none" }
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Simple root route so Render can check service
app.get("/", (req, res) => {
  res.send("Tasty backend is running.");
});

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