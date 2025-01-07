const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// Rotas CRUD para as avaliações
router.post("/create", createReview); // Criar avaliação
router.get("/", getAllReviews); // Obter todas as avaliações
router.get("/:id", getReviewById); // Obter uma avaliação específica pelo ID
router.put("/update/:id", updateReview); // Atualizar uma avaliação
router.delete("/delete/:id", deleteReview); // Apagar avaliação

module.exports = router;
