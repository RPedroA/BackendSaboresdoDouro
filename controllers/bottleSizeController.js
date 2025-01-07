const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const debug = require("debug")("app:bottleSizeController");

// Criar um novo tamanho de garrafa
const createBottleSize = async (req, res) => {
  const { size } = req.body;

  // Validação do parâmetro size
  if (!size || typeof size !== "number" || size <= 0) {
    debug("Parâmetro de tamanho inválido: ", size);
    return res
      .status(400)
      .json({ error: "Tamanho inválido. O tamanho deve ser um número positivo." });
  }

  try {
    // Criação do tamanho da garrafa no banco de dados
    const bottleSize = await prisma.bottleSize.create({
      data: { tamanho: size },
    });

    debug("Tamanho de garrafa criado: ", bottleSize);
    res.status(201).json(bottleSize);
  } catch (error) {
    debug("Erro ao criar o tamanho de garrafa: ", error.message);
    res.status(500).json({ error: "Erro ao criar o tamanho de garrafa.", details: error.message });
  }
};

// Obter todos os tamanhos de garrafas
const getAllBottleSizes = async (req, res) => {
  try {
    // Busca de todos os tamanhos de garrafa
    const bottleSizes = await prisma.bottleSize.findMany();
    debug("Tamanhos de garrafas recuperados: ", bottleSizes);
    res.status(200).json(bottleSizes);
  } catch (error) {
    debug("Erro ao buscar tamanhos de garrafas: ", error.message);
    res
      .status(500)
      .json({ error: "Erro ao buscar tamanhos de garrafas.", details: error.message });
  }
};

// Obter um tamanho de garrafa específico por ID
const getBottleSizeById = async (req, res) => {
  const { id } = req.params;

  // Validação do ID
  if (!id || isNaN(id)) {
    debug("Parâmetro de ID inválido: ", id);
    return res
      .status(400)
      .json({ error: "ID inválido. Deve ser um número válido." });
  }

  try {
    // Busca do tamanho de garrafa pelo ID
    const bottleSize = await prisma.bottleSize.findUnique({
      where: { bottle_size_id: parseInt(id) },
    });

    if (!bottleSize) {
      debug(`Tamanho de garrafa com ID ${id} não encontrado.`);
      return res
        .status(404)
        .json({ error: `Tamanho de garrafa com ID ${id} não encontrado.` });
    }

    debug("Tamanho de garrafa recuperado: ", bottleSize);
    res.status(200).json(bottleSize);
  } catch (error) {
    debug("Erro ao buscar tamanho de garrafa: ", error.message);
    res
      .status(500)
      .json({ error: "Erro ao buscar tamanho de garrafa.", details: error.message });
  }
};

// Atualizar um tamanho de garrafa
const updateBottleSize = async (req, res) => {
  const { id } = req.params;
  const { size } = req.body;

  // Validação do ID
  if (!id || isNaN(id)) {
    debug("Parâmetro de ID inválido: ", id);
    return res
      .status(400)
      .json({ error: "ID inválido. Deve ser um número válido." });
  }

  // Validação do tamanho
  if (!size || typeof size !== "number" || size <= 0) {
    debug("Parâmetro de tamanho inválido: ", size);
    return res
      .status(400)
      .json({ error: "Tamanho inválido. Deve ser um número positivo." });
  }

  try {
    // Atualização do tamanho da garrafa
    const updatedBottleSize = await prisma.bottleSize.update({
      where: { bottle_size_id: parseInt(id) },
      data: { tamanho: size },
    });

    debug("Tamanho de garrafa atualizado: ", updatedBottleSize);
    res.status(200).json(updatedBottleSize);
  } catch (error) {
    debug("Erro ao atualizar tamanho de garrafa: ", error.message);
    res
      .status(500)
      .json({ error: "Erro ao atualizar tamanho de garrafa.", details: error.message });
  }
};

// Prevenir exclusão se associado a um vinho
const deleteBottleSize = async (req, res) => {
  const { id } = req.params;

  // Validação do ID
  if (!id || isNaN(id)) {
    debug("Parâmetro de ID inválido: ", id);
    return res
      .status(400)
      .json({ error: "ID inválido. Deve ser um número válido." });
  }

  try {
    // Verificar se existem vinhos associados ao tamanho de garrafa
    const wines = await prisma.wineBottleSize.findMany({
      where: { bottle_size_id: parseInt(id) },
    });

    if (wines.length > 0) {
      debug(`Não é possível apagar o tamanho de garrafa. Vinhos associados: ${wines.length}`);
      return res.status(400).json({
        error: "Não é possível apagar o tamanho de garrafa.",
        details: `Este tamanho de garrafa está associado a ${wines.length} vinho(s). Remova a associação antes de excluir.`,
      });
    }

    // Exclusão do tamanho de garrafa
    await prisma.bottleSize.delete({
      where: { bottle_size_id: parseInt(id) },
    });

    debug(`Tamanho de garrafa com ID ${id} apagado com sucesso.`);
    res.status(200).json({ message: `Tamanho de garrafa com ID ${id} apagado com sucesso.` });
  } catch (error) {
    debug("Erro ao apagar tamanho de garrafa: ", error.message);
    res
      .status(500)
      .json({ error: "Erro ao apagar tamanho de garrafa.", details: error.message });
  }
};

module.exports = {
  createBottleSize,
  getAllBottleSizes,
  getBottleSizeById,
  updateBottleSize,
  deleteBottleSize,
};
