require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path"); // Para gerenciar caminhos de arquivos
const router = require("./routes/");
const jwt = require("jsonwebtoken");
const app = express();

// Configurar middlewares
app.use(bodyParser.json());
app.use(cors());

// Servir arquivos de imagens
app.use("/images", express.static(path.join(__dirname, "uploads/images")));

// Rotas principais
app.use(router);

// Rota de ping para verificar se o servidor está funcionando
app.get("/ping", (req, res) => {
  res.status(200).json({ message: ":) O Servidor está a funcionar." });
});

// Configurar porta do servidor
const port = process.env.SERVER_PORT || 8080;

// Iniciar o servidor
app.listen(port, () => console.log(`Express server running on port ${port}`));
//falta adicionar
//filtros
//limites de caracteres para descrição nomes etc
//falta logout adiionar a parte da frontend
