const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Rotas CRUD para a categoria
router.post("/create", createCategory); // Criar categoria
router.get("/", getAllCategories); // Obter todas as categorias
router.get("/:id", getCategoryById); // Obter uma categoria específica pelo ID
router.put("/update/:id", updateCategory); // Atualizar uma categoria
router.delete("/delete/:id", deleteCategory); // Apagar uma categoria

module.exports = router;
