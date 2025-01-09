const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const upload = require("../middleware/multerConfig");

// Criar um vinho
const createWine = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    isPromotion,
    promotionPrice,
    bottleSizes,
    emDestaque,
    descricaoDestaque,
  } = req.body;

  // Capturar o caminho da imagem carregada pelo multer
  const imagem = req.file ? req.file.path : null;

  // Arrays para rastrear parâmetros ausentes ou inválidos
  const missingParams = [];
  const invalidParams = [];

  // Verificar campos obrigatórios e seus tipos
  if (!name) missingParams.push("name");
  else if (typeof name !== "string") invalidParams.push("name");

  if (!description) missingParams.push("description");
  else if (typeof description !== "string") invalidParams.push("description");

  if (!price) missingParams.push("price");
  else if (typeof price !== "number") invalidParams.push("price");

  if (!category) missingParams.push("category");
  else if (typeof category !== "number") invalidParams.push("category");

  if (!imagem) missingParams.push("imagem");

  // Verificar tipos opcionais
  if (isPromotion !== undefined && typeof isPromotion !== "boolean") {
    invalidParams.push("isPromotion (deve ser um boolean)");
  }

  if (promotionPrice !== undefined && typeof promotionPrice !== "number") {
    invalidParams.push("promotionPrice (deve ser um número)");
  }

  if (emDestaque !== undefined && typeof emDestaque !== "boolean") {
    invalidParams.push("emDestaque (deve ser um boolean)");
  }

  if (descricaoDestaque !== undefined && typeof descricaoDestaque !== "string") {
    invalidParams.push("descricaoDestaque");
  }

  if (!bottleSizes || !Array.isArray(bottleSizes)) {
    missingParams.push("bottleSizes");
  }

  // Retornar erros de validação se houver parâmetros ausentes ou inválidos
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
    // Criar o vinho e associar os tamanhos de garrafa
    const wine = await prisma.wine.create({
      data: {
        nome: name,
        descricao: description,
        preco: price,
        categoriaId: category,
        emPromocao: isPromotion || false,
        precoPromocao: promotionPrice || null,
        imagem: imagem,
        emDestaque: emDestaque || false,
        descricaoDestaque: descricaoDestaque || null,
        bottleSizes: {
          connect: bottleSizes.map((sizeId) => ({ bottle_size_id: sizeId })),
        },
      },
    });

    res.status(201).json(wine);
  } catch (error) {
    console.error("Erro ao criar o vinho:", error.message);
    res.status(400).json({
      erro: "Não foi possível criar o vinho.",
      detalhes: error.message,
    });
  }
};

// Obter todos os vinhos
const getAllWines = async (req, res) => {
  try {
    const wines = await prisma.wine.findMany({
      include: {
        bottleSizes: true,
      },
    });
    res.status(200).json(wines);
  } catch (error) {
    console.error("Erro ao buscar todos os vinhos:", error.message);
    res.status(500).json({
      erro: "Não foi possível obter os vinhos.",
      detalhes: error.message,
    });
  }
};

// Obter um vinho específico por ID
const getWineById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    const wine = await prisma.wine.findUnique({
      where: { wine_id: parseInt(id) },
      include: {
        bottleSizes: true,
      },
    });

    if (!wine) {
      return res
        .status(404)
        .json({ erro: `Vinho com ID ${id} não encontrado.` });
    }

    res.status(200).json(wine);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar o vinho",
      detalhes: error.message,
    });
  }
};

// Atualizar um vinho
const updateWine = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const imagem = req.file ? req.file.path : undefined;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    const updatedWine = await prisma.wine.update({
      where: { wine_id: parseInt(id) },
      data: {
        ...data,
        imagem: imagem || data.imagem,
      },
    });

    res.status(200).json(updatedWine);
  } catch (error) {
    res.status(400).json({
      erro: "Erro ao atualizar o vinho",
      detalhes: error.message,
    });
  }
};

// Apagar um vinho
const deleteWine = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    const wine = await prisma.wine.findUnique({
      where: { wine_id: parseInt(id) },
    });

    if (!wine) {
      return res
        .status(404)
        .json({ erro: `Vinho com ID ${id} não encontrado.` });
    }

    if (wine.emDestaque) {
      return res.status(400).json({
        erro: "Não é possível apagar o vinho.",
        detalhes: "O vinho está marcado como 'em destaque' e não pode ser apagado.",
      });
    }

    await prisma.review.deleteMany({
      where: { wine_id: parseInt(id) },
    });

    await prisma.wine.delete({
      where: { wine_id: parseInt(id) },
    });

    res.status(200).json({ mensagem: `Vinho com ID ${id} apagado com sucesso.` });
  } catch (error) {
    console.error("Erro ao apagar o vinho:", error.message);
    res.status(500).json({
      erro: "Erro ao apagar o vinho",
      detalhes: error.message,
    });
  }
};

module.exports = {
  createWine,
  getAllWines,
  getWineById,
  updateWine,
  deleteWine,
};
