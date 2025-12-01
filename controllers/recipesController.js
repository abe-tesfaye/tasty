"use strict";

const Recipes = require("../models/recipesModel");

async function getAllRecipes(req, res) {
  try {
    const recipes = await Recipes.getAllRecipes();
    res.json(recipes);
  } catch (err) {
    console.error("Error getting recipes:", err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}

async function getRecipeById(req, res) {
  try {
    const id = Number(req.params.id);
    const recipe = await Recipes.getRecipeById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    console.error("Error getting recipe by id:", err);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
}

async function createRecipe(req, res) {
  try {
    const { title, ingredients, steps, tags, photo_url } = req.body;

    if (!title || !ingredients || !steps) {
      return res
        .status(400)
        .json({ error: "title, ingredients, and steps are required" });
    }

    const newRecipe = await Recipes.createRecipe({
      title,
      ingredients,
      steps,
      tags,
      photo_url,
    });

    res.status(201).json(newRecipe);
  } catch (err) {
    console.error("Error creating recipe:", err);
    res.status(500).json({ error: "Failed to create recipe" });
  }
}

async function updateRecipe(req, res) {
  try {
    const id = Number(req.params.id);
    const { title, ingredients, steps, tags, photo_url } = req.body;

    if (!title || !ingredients || !steps) {
      return res
        .status(400)
        .json({ error: "title, ingredients, and steps are required" });
    }

    const updated = await Recipes.updateRecipe(id, {
      title,
      ingredients,
      steps,
      tags,
      photo_url,
    });

    if (!updated) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating recipe:", err);
    res.status(500).json({ error: "Failed to update recipe" });
  }
}

async function deleteRecipe(req, res) {
  try {
    const id = Number(req.params.id);
    await Recipes.deleteRecipe(id);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting recipe:", err);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};