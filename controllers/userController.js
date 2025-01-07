const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt"); // Importar bcrypt

// Criar um utilizador
const createUser = async (req, res) => {
  const { nome, email, password, isAdmin } = req.body;

  // Verificar parâmetros em falta
  const missingParams = [];
  const invalidParams = [];

  if (!nome) missingParams.push("nome");
  else if (typeof nome !== "string") invalidParams.push("nome");

  if (!email) missingParams.push("email");
  else if (typeof email !== "string") invalidParams.push("email");

  if (!password) missingParams.push("password");
  else if (typeof password !== "string") invalidParams.push("password");

  if (isAdmin !== undefined && typeof isAdmin !== "boolean") {
    invalidParams.push("isAdmin (deve ser um boolean)");
  }

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
    //Hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar utilizador com a password criptografada
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Erro ao criar utilizador:", error.message);
    res.status(400).json({
      erro: "Não foi possível criar o utilizador.",
      detalhes: error.message,
    });
  }
};

// Ler todos os utilizadores
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar todos os utilizadores:", error.message);
    res.status(500).json({
      erro: "Não foi possível obter os utilizadores.",
      detalhes: error.message,
    });
  }
};

// Ler um utilizador por ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res
        .status(404)
        .json({ erro: `Utilizador com ID ${id} não foi encontrado.` });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(`Erro ao buscar utilizador com ID ${id}:`, error.message);
    res.status(500).json({
      erro: "Não foi possível buscar o utilizador.",
      detalhes: error.message,
    });
  }
};

// Atualizar um utilizador
const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      erro: "Dados em falta",
      detalhes: "É necessário fornecer os campos que deseja atualizar.",
    });
  }

  const invalidParams = [];
  if (data.nome && typeof data.nome !== "string") invalidParams.push("nome");
  if (data.email && typeof data.email !== "string") invalidParams.push("email");
  if (data.password && typeof data.password !== "string")
    invalidParams.push("password");
  if (data.isAdmin !== undefined && typeof data.isAdmin !== "boolean")
    invalidParams.push("isAdmin (deve ser um boolean)");

  if (invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Tipos incorretos nos campos",
      detalhes: `Os seguintes campos têm tipos inválidos: ${invalidParams.join(
        ", "
      )}`,
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Erro ao atualizar utilizador com ID ${id}:`, error.message);
    res.status(400).json({
      erro: "Não foi possível atualizar o utilizador.",
      detalhes: error.message,
    });
  }
};

// Apagar um utilizador
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    // Apagar as reviews associadas ao utilizador
    await prisma.review.deleteMany({
      where: { user_id: parseInt(id) },
    });

    // Apagar o utilizador
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res
      .status(200)
      .json({ mensagem: `Utilizador com ID ${id} e suas reviews foram apagados com sucesso.` });
  } catch (error) {
    console.error(`Erro ao apagar utilizador com ID ${id}:`, error.message);
    res.status(500).json({
      erro: "Não foi possível apagar o utilizador.",
      detalhes: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
