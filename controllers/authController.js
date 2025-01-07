const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// Registrar um utilizador
const registerUser = async (req, res) => {
  const { nome, email, password } = req.body;

  if (!nome || !email || !password) {
    return res
      .status(400)
      .json({ erro: "Nome, email e password são obrigatórios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        password: hashedPassword,
        isAdmin: false,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ erro: "Email já existe" });
    }
    res
      .status(500)
      .json({ erro: "Erro ao criar o utilizador", detalhes: error.message });
  }
};

// Login do utilizador
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ erro: "Email e password são obrigatórios" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ erro: "Email não encontrado" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(400).json({ erro: "Password incorreta" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ erro: "Erro no login", detalhes: error.message });
  }
};

// Logout do utilizador
const logoutUser = async (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(400).json({ erro: "Token não fornecido" });
  }

  try {
    // Aqui o token poderia ser adicionado a uma blacklist, se necessário.
    res.status(200).json({ mensagem: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro no logout:", error.message);
    res.status(500).json({ erro: "Erro ao realizar o logout." });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
