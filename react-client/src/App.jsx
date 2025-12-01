// src/App.jsx
import React from "react";
import HomePage from "./components/HomePage.jsx";

export default function App() {
  return (
    <div className="app-root">
      <div className="app-shell">
        <HomePage />
      </div>
    </div>
  );
}