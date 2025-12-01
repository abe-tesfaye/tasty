// InspireMe.jsx
import React, { useState } from "react";

export default function InspireMe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meal, setMeal] = useState(null);

  async function fetchRandomMeal() {
    try {
      setLoading(true);
      setError("");
      setMeal(null);

      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );

      if (!res.ok) {
        throw new Error("Failed to fetch random recipe");
      }

      const data = await res.json();
      if (!data.meals || data.meals.length === 0) {
        setError("No recipe returned, try again.");
        return;
      }

      setMeal(data.meals[0]);
    } catch (err) {
      console.error("Error fetching random meal:", err);
      setError("Could not load a random recipe. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ paddingTop: "1rem" }}>
      <h1>Inspire Me</h1>
      <p>Get a random recipe idea from TheMealDB.</p>

      <button onClick={fetchRandomMeal} disabled={loading}>
        {loading ? "Loading..." : "Get Random Recipe"}
      </button>

      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

      {meal && (
        <div style={{ marginTop: "1rem", maxWidth: "700px" }}>
          <h2>{meal.strMeal}</h2>
          <p>
            <strong>Category:</strong> {meal.strCategory}{" "}
            {meal.strArea && (
              <>
                {" · "}
                <strong>Area:</strong> {meal.strArea}
              </>
            )}
          </p>

          {meal.strMealThumb && (
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              style={{ maxWidth: "300px", display: "block", marginBottom: "0.75rem" }}
            />
          )}

          <h3>Instructions</h3>
          <p style={{ whiteSpace: "pre-line" }}>
            {meal.strInstructions
            ?.replace(/step\s*/gi, "Step ")
            .trim()}
            </p>

          {meal.strSource && (
            <p style={{ marginTop: "0.5rem" }}>
              <a href={meal.strSource} target="_blank" rel="noreferrer">
                View full recipe
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}