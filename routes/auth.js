const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser); // Para registar
router.post("/login", loginUser); // Para entrar
router.post("/logout", logoutUser); // Para sair

module.exports = router;
