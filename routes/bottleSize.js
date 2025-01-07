const express = require("express");
const {
  createBottleSize,
  getAllBottleSizes,
  getBottleSizeById,
  updateBottleSize,
  deleteBottleSize,
} = require("../controllers/bottleSizeController");

const router = express.Router();

// Rota para criar um novo tamanho de garrafa
router.post("/create", createBottleSize);

// Rota para obter todos os tamanhos de garrafas
router.get("/", getAllBottleSizes);

// Rota para obter um tamanho de garrafa específico por ID
router.get("/:id", getBottleSizeById);

// Rota para atualizar um tamanho de garrafa por ID
router.put("/update/:id", updateBottleSize);

// Rota para apagar um tamanho de garrafa por ID
router.delete("/delete/:id", deleteBottleSize);

module.exports = router;
