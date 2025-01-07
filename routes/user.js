const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Rotas para CRUD de User
router.post("/create", createUser); // Criar utilizador
router.get("/", getAllUsers); // Ler todos os utilizadores
router.get("/:id", getUserById); // Ler um utilizador por ID
router.put("/update/:id", updateUser); // Atualizar utilizador
router.delete("/delete/:id", deleteUser); // Apagar utilizador

module.exports = router;
