require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const router = require("./routes/");
const jwt = require("jsonwebtoken");
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(router);

app.get("/ping", (req, res) => {
  res.status(200).json({ message: ":) O Servidor esta a funcionar." });
});

const port = process.env.SERVER_PORT || 8080;

app.listen(port, () => console.log(`Express server running on port ${port}`));

//falta adicionar
//filtros
//limites de caracteres para descrição nomes etc
//falta logout adiionar a parte da frontend
