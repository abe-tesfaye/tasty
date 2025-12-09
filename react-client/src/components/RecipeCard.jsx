// src/components/RecipeCard.jsx

export default function RecipeCard({ recipe, onDelete, onEdit }) {
  return (
    <div className="recipe-card">
      {recipe.photo_url && (
        <img
          className="recipe-card-image"
          src={recipe.photo_url}
          alt={recipe.title}
        />
      )}

      <h3 className="recipe-card-title">{recipe.title}</h3>

      <p className="recipe-meta">
        <strong>Ingredients:</strong> {recipe.ingredients}
      </p>

      <p className="recipe-meta">
        <strong>Steps:</strong> {recipe.steps}
      </p>

      {recipe.tags && (
        <div className="recipe-tags">
          <strong style={{ marginRight: "4px" }}>Tags:</strong>
          {recipe.tags.split(",").map((tag) => {
            const trimmed = tag.trim();
            if (!trimmed) return null;
            return (
              <span key={trimmed} className="tag-pill">
                {trimmed}
              </span>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
        {onEdit && (
          <button className="btn" type="button" onClick={() => onEdit(recipe)}>
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => onDelete(recipe.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}