const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Criar uma review
const createReview = async (req, res) => {
  const { user_id, wine_id, rating } = req.body;

  const missingParams = [];
  const invalidParams = [];

  if (!user_id) missingParams.push("user_id");
  else if (isNaN(user_id)) invalidParams.push("user_id (deve ser um número válido)");

  if (!wine_id) missingParams.push("wine_id");
  else if (isNaN(wine_id)) invalidParams.push("wine_id (deve ser um número válido)");

  if (rating === undefined) missingParams.push("rating");
  else if (typeof rating !== "number" || rating < 0 || rating > 5)
    invalidParams.push("rating (deve ser um número entre 0 e 5)");

  if (missingParams.length > 0 || invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Parâmetros inválidos ou em falta",
      detalhes: {
        emFalta: missingParams,
        tiposIncorretos: invalidParams,
      },
    });
  }

  try {
    const review = await prisma.review.create({
      data: {
        user_id: parseInt(user_id),
        wine_id: parseInt(wine_id),
        rating,
      },
    });

    // Recalcular e atualizar a média do vinho associado
    const reviews = await prisma.review.findMany({ where: { wine_id } });
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await prisma.wine.update({
      where: { wine_id },
      data: { averageRating },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Erro ao criar a review:", error.message);
    res.status(400).json({
      erro: "Não foi possível criar a review.",
      detalhes: error.message,
    });
  }
};

// Obter todas as reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Erro ao buscar todas as reviews:", error.message);
    res.status(500).json({
      erro: "Não foi possível obter as reviews.",
      detalhes: error.message,
    });
  }
};

// Obter uma review específica por ID
const getReviewById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    const review = await prisma.review.findUnique({
      where: { review_id: parseInt(id) },
    });

    if (!review) {
      return res
        .status(404)
        .json({ erro: `Review com ID ${id} não encontrada.` });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar a review",
      detalhes: error.message,
    });
  }
};

// Atualizar uma review
const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  if (rating === undefined || typeof rating !== "number" || rating < 0 || rating > 5) {
    return res.status(400).json({
      erro: "Rating inválido",
      detalhes: "O campo 'rating' deve ser um número entre 0 e 5.",
    });
  }

  try {
    const updatedReview = await prisma.review.update({
      where: { review_id: parseInt(id) },
      data: { rating },
    });

    // Recalcular e atualizar a média do vinho associado
    const wine_id = updatedReview.wine_id;
    const reviews = await prisma.review.findMany({ where: { wine_id } });
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await prisma.wine.update({
      where: { wine_id },
      data: { averageRating },
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({
      erro: "Erro ao atualizar a review",
      detalhes: error.message,
    });
  }
};

// Apagar uma review
const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    const review = await prisma.review.findUnique({ where: { review_id: parseInt(id) } });

    if (!review) {
      return res.status(404).json({ erro: "Review não encontrada." });
    }

    const wine_id = review.wine_id;

    await prisma.review.delete({ where: { review_id: parseInt(id) } });

    // Recalcular e atualizar a média do vinho associado
    const reviews = await prisma.review.findMany({ where: { wine_id } });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    await prisma.wine.update({
      where: { wine_id },
      data: { averageRating },
    });

    res.status(200).json({ mensagem: "Review apagada com sucesso." });
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao apagar a review",
      detalhes: error.message,
    });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
