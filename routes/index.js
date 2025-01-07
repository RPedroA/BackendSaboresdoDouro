const router = require("express").Router();

const authRouter = require("./auth");
const userRouter = require("./user");
const wineRouter = require("./wine");
const categoryRouter = require("./category");
const reviewRouter = require("./review");
const bottleSizeRoutes = require("./bottleSize");

// Configura todas as rotas principais no router principal
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/wine", wineRouter);
router.use("/category", categoryRouter);
router.use("/review", reviewRouter);
router.use("/bottlesizes", bottleSizeRoutes);
module.exports = router;
