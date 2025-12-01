// AuthStatus.jsx
import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASE_URL;

export default function AuthStatus() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  async function fetchStatus() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/auth/status`, {
        credentials: "include", // send cookies
      });

      if (!res.ok) {
        throw new Error(`Status check failed: ${res.status}`);
      }

      const data = await res.json();
      setLoggedIn(Boolean(data.loggedIn));
      setUser(data.user || null);
    } catch (err) {
      console.error("Error checking auth status:", err);
      setError("Could not check login status");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleLogin = () => {
    // kick off Google OAuth
    window.location.href = `${API_BASE}/auth/google`;
  };

  const handleLogout = async () => {
    try {
      setError("");

      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Logout failed: ${res.status}`);
      }

      // Refresh the status after logout
      await fetchStatus();
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Failed to log out");
    }
  };

  // 🧠 Simple UI
  return (
    <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
      {loading && <span>Checking login status…</span>}

      {!loading && error && (
        <span style={{ color: "red" }}>{error}</span>
      )}

      {!loading && !error && (
        <>
          {loggedIn ? (
            <>
              <span>
                Logged in{user?.displayName ? ` as ${user.displayName}` : ""}.
              </span>
              <button
                style={{ marginLeft: "0.5rem" }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <span>Not logged in.</span>
              <button
                style={{ marginLeft: "0.5rem" }}
                onClick={handleLogin}
              >
                Login with Google
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}