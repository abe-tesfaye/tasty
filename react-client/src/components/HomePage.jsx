// src/components/HomePage.jsx
import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard.jsx";
import AuthStatus from "./AuthStatus.jsx";
import RecipeForm from "./RecipeForm.jsx";
import InspireMe from "./InspireMe.jsx";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASE_URL;

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("home"); // "home" | "add" | "edit" | "inspire"
  const [editingRecipe, setEditingRecipe] = useState(null);

  async function fetchRecipes() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/api/recipes`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load recipes");
      }

      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Could not load recipes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  function goHome() {
    setView("home");
    setEditingRecipe(null);
  }

  function goAddRecipe() {
    setEditingRecipe(null);
    setView("add");
  }

  function goInspire() {
    setEditingRecipe(null);
    setView("inspire");
  }

  function handleRecipeCreated() {
    setView("home");
    fetchRecipes();
  }

  function handleRecipeUpdated() {
    setView("home");
    setEditingRecipe(null);
    fetchRecipes();
  }

  function handleEditClick(recipe) {
    setEditingRecipe(recipe);
    setView("edit");
  }

  async function handleDeleteRecipe(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/api/recipes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 401) {
        alert("You must be logged in to delete recipes.");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Delete failed:", body);
        alert(body.error || "Failed to delete recipe.");
        return;
      }

      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting recipe:", err);
      alert("Unexpected error deleting recipe.");
    }
  }

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="app-title">Tasty</div>
        <div className="nav-buttons">
          <button className="btn btn-ghost" onClick={goHome}>
            Home
          </button>
          <button className="btn btn-ghost" onClick={goAddRecipe}>
            Add Recipe
          </button>
          <button className="btn btn-ghost" onClick={goInspire}>
            Inspire Me
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="main-panel">
        <div className="status-row">
          <AuthStatus />
        </div>

        {view === "home" && (
          <>
            <h1 className="recipes-header">Recipes</h1>

            {loading && <p>Loading recipes…</p>}
            {error && <p className="error-text">{error}</p>}
            {!loading && !error && recipes.length === 0 && (
              <p>No recipes yet. Add your first recipe!</p>
            )}

            <div className="recipes-list">
              {recipes.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  onDelete={handleDeleteRecipe}
                  onEdit={handleEditClick}
                />
              ))}
            </div>
          </>
        )}

        {view === "add" && (
          <div className="form-wrapper">
            <RecipeForm onSuccess={handleRecipeCreated} onCancel={goHome} />
          </div>
        )}

        {view === "edit" && (
          <div className="form-wrapper">
            <RecipeForm
              initialRecipe={editingRecipe}
              onSuccess={handleRecipeUpdated}
              onCancel={goHome}
            />
          </div>
        )}

        {view === "inspire" && (
          <div className="inspire-section">
            <InspireMe />
          </div>
        )}
      </main>
    </>
  );
}