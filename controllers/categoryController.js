const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Criar uma categoria
const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      erro: "Nome inválido. O campo 'name' é obrigatório e deve ser uma string.",
    });
  }

  try {
    const category = await prisma.category.create({
      data: {
        nome: name,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Erro ao criar a categoria:", error.message);
    res.status(400).json({
      erro: "Não foi possível criar a categoria.",
      detalhes: error.message,
    });
  }
};

// Obter todas as categorias
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Erro ao buscar todas as categorias:", error.message);
    res.status(500).json({
      erro: "Não foi possível obter as categorias.",
      detalhes: error.message,
    });
  }
};

// Obter uma categoria específica por ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido. Deve ser um número válido.",
    });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { category_id: parseInt(id) },
    });

    if (!category) {
      return res
        .status(404)
        .json({ erro: `Categoria com ID ${id} não encontrada.` });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar a categoria.",
      detalhes: error.message,
    });
  }
};

// Atualizar uma categoria
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido. Deve ser um número válido.",
    });
  }

  if (name && typeof name !== "string") {
    return res.status(400).json({
      erro: "Nome inválido. O campo 'name' deve ser uma string.",
    });
  }

  try {
    const updatedCategory = await prisma.category.update({
      where: { category_id: parseInt(id) },
      data: {
        nome: name,
      },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({
      erro: "Erro ao atualizar a categoria.",
      detalhes: error.message,
    });
  }
};

// Apagar uma categoria
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido. Deve ser um número válido.",
    });
  }

  try {
    // Verificar se existem vinhos associados à categoria
    const wines = await prisma.wine.findMany({
      where: { categoriaId: parseInt(id) },
    });

    if (wines.length > 0) {
      return res.status(400).json({
        erro: "Não é possível apagar a categoria.",
        detalhes:
          "Existem vinhos associados a esta categoria. Reatribua ou remova esses vinhos antes de continuar.",
      });
    }

    // Apagar a categoria
    await prisma.category.delete({
      where: { category_id: parseInt(id) },
    });

    res
      .status(200)
      .json({ mensagem: `Categoria com ID ${id} apagada com sucesso.` });
  } catch (error) {
    console.error("Erro ao apagar a categoria:", error.message);
    res.status(500).json({
      erro: "Erro ao apagar a categoria.",
      detalhes: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
