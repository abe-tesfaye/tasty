"use strict";

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function getAllRecipes() {
  const result = await pool.query(
    "SELECT * FROM recipes ORDER BY created_at DESC"
  );
  return result.rows;
}

async function getRecipeById(id) {
  const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function createRecipe(recipe) {
  const { title, ingredients, steps, tags, photo_url } = recipe;
  const result = await pool.query(
    `INSERT INTO recipes (title, ingredients, steps, tags, photo_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, ingredients, steps, tags || null, photo_url || null]
  );
  return result.rows[0];
}

async function updateRecipe(id, recipe) {
  const { title, ingredients, steps, tags, photo_url } = recipe;
  const result = await pool.query(
    `UPDATE recipes
     SET title = $1,
         ingredients = $2,
         steps = $3,
         tags = $4,
         photo_url = $5
     WHERE id = $6
     RETURNING *`,
    [title, ingredients, steps, tags || null, photo_url || null, id]
  );
  return result.rows[0] || null;
}

async function deleteRecipe(id) {
  await pool.query("DELETE FROM recipes WHERE id = $1", [id]);
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};