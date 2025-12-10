// server.js
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

// Allow local dev + Render frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL, // e.g. https://tastyfinal.onrender.com
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // allow tools like curl / Postman with no origin
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      console.log("Blocked by CORS:", origin);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

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
      : {
          sameSite: "lax",
          secure: false,
        },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/recipes", recipesRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Tasty backend is running.");
});

app.get("/auth/status", (req, res) => {
  if (req.user) {
    return res.json({ loggedIn: true, user: req.user });
  }
  res.json({ loggedIn: false });
});

app.listen(PORT, () => {
  console.log(`Tasty backend listening on port ${PORT}`);
});