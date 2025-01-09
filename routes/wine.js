const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig"); // Middleware para upload de imagens
const {
  createWine,
  getAllWines,
  getWineById,
  updateWine,
  deleteWine,
} = require("../controllers/wineController");

// Rota para criar um novo vinho (com upload de imagem)
router.post("/create", upload.single("file"), createWine);

// Rota para atualizar um vinho existente (com upload de imagem)
router.put("/update/:id", upload.single("file"), updateWine);

// Rotas para obter vinhos
router.get("/", getAllWines);

// Rota para obter vinho por ID
router.get("/:id", getWineById);

//Rota para apagar um vinho
router.delete("/:id", deleteWine);

module.exports = router;
