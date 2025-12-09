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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://tastyfinal.onrender.com", // your Render frontend
];

// CORS
app.use(
  cors({
    origin(origin, callback) {
      // allow tools like curl / Postman with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

const isProduction = process.env.NODE_ENV === "production";

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false,
    cookie: isProduction
      ? {
          sameSite: "none",
          secure: true,
        }
      : undefined, // default cookie settings for local dev
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Simple root route for health check
app.get("/", (req, res) => {
  res.send("Tasty backend is running.");
});

// API routes
app.use("/api/recipes", recipesRoutes);
app.use("/auth", authRoutes);

// "Am I logged in?" route
app.get("/auth/status", (req, res) => {
  if (req.user) {
    return res.json({ loggedIn: true, user: req.user });
  }
  res.json({ loggedIn: false });
});

app.listen(PORT, () => {
  console.log(`Tasty backend listening on port ${PORT}`);
});