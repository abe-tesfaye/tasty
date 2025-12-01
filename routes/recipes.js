"use strict";

const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipesController");
const ensureAuth = require("../middleware/ensureAuth");

// GET /api/recipes – list all recipes (can be public)
router.get("/", recipesController.getAllRecipes);

// GET /api/recipes/:id – single recipe
router.get("/:id", recipesController.getRecipeById);

// POST /api/recipes – create recipe (protected)
router.post("/", ensureAuth, recipesController.createRecipe);

// PUT /api/recipes/:id – update recipe (protected)
router.put("/:id", ensureAuth, recipesController.updateRecipe);

// DELETE /api/recipes/:id – delete recipe (also protected)
router.delete("/:id", ensureAuth, recipesController.deleteRecipe);

module.exports = router;