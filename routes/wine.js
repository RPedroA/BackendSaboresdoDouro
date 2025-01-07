const express = require("express");
const {
  createWine,
  getAllWines,
  getWineById,
  updateWine,
  deleteWine,
} = require("../controllers/wineController");

const router = express.Router();

// Create a new wine
router.post("/create", createWine);

// Get all wines
router.get("/", getAllWines);

// Get a wine by ID
router.get("/:id", getWineById);

// Update a wine by ID
router.put("/update/:id", updateWine);

// Delete a wine by ID
router.delete("/delete/:id", deleteWine);

module.exports = router;
