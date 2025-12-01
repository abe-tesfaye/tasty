// src/components/RecipeForm.jsx
import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASE_URL;

export default function RecipeForm({ onSuccess, onCancel, initialRecipe }) {
  const [title, setTitle] = useState(initialRecipe?.title || "");
  const [ingredients, setIngredients] = useState(initialRecipe?.ingredients || "");
  const [steps, setSteps] = useState(initialRecipe?.steps || "");
  const [tags, setTags] = useState(initialRecipe?.tags || "");
  const [photoUrl, setPhotoUrl] = useState(initialRecipe?.photo_url || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(initialRecipe && initialRecipe.id);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title || !ingredients || !steps) {
      setError("Title, ingredients, and steps are required.");
      return;
    }

    try {
      setSaving(true);

      const url = isEdit
        ? `${API_BASE}/api/recipes/${initialRecipe.id}`
        : `${API_BASE}/api/recipes`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          ingredients,
          steps,
          tags,
          photo_url: photoUrl,
        }),
      });

      if (res.status === 401) {
        setError("You must be logged in with Google for this action.");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Save recipe failed:", body);
        setError(body.error || "Failed to save recipe.");
        return;
      }

      const saved = await res.json();

      if (!isEdit) {
        setTitle("");
        setIngredients("");
        setSteps("");
        setTags("");
        setPhotoUrl("");
      }

      if (onSuccess) {
        onSuccess(saved);
      }
    } catch (err) {
      console.error("Error saving recipe:", err);
      setError("Unexpected error saving recipe.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2>{isEdit ? "Edit Recipe" : "Add Recipe"}</h2>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Photo URL (optional)</label>
          <input
            type="text"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <p className="help-text">
            Paste an image link if you want a photo for this recipe.
          </p>
        </div>

        <div className="form-field">
          <label>Tags (comma-separated, optional)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Ingredients</label>
          <textarea
            rows={4}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Steps</label>
          <textarea
            rows={4}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Recipe" : "Save Recipe"}
          </button>

          {onCancel && (
            <button
              type="button"
              className="btn"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}