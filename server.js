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

// CORS: allow React dev servers
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
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