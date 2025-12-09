// src/components/AuthStatus.jsx
import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASE_URL;

export default function AuthStatus() {
  const [status, setStatus] = useState({ loading: true, loggedIn: false, user: null });

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch(`${API_BASE}/auth/status`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to check auth status");
        }

        const data = await res.json();
        setStatus({ loading: false, loggedIn: data.loggedIn, user: data.user || null });
      } catch (err) {
        console.error("Error checking auth status:", err);
        setStatus({ loading: false, loggedIn: false, user: null });
      }
    }

    checkStatus();
  }, []);

  function handleLogin() {
    // redirect to backend Google OAuth
    window.location.href = `${API_BASE}/auth/google`;
  }

  async function handleLogout() {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Logout failed");
      }
      // simplest: reload page to reset state
      window.location.reload();
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }

  if (status.loading) {
    return <div className="auth-banner"><span>Checking login…</span></div>;
  }

  if (!status.loggedIn) {
    return (
      <div className="auth-banner">
        <span>Not logged in</span>
        <button className="btn btn-primary" type="button" onClick={handleLogin}>
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="auth-banner">
      <span>Logged in as {status.user?.displayName || "User"}</span>
      <button className="btn btn-ghost" type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}