const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const tokenValue = token.startsWith("Bearer ") ? token.slice(7) : token;

    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err.message);
    return res.status(403).json({ erro: "Token inválido ou expirado" });
  }
};

module.exports = authenticateToken;
