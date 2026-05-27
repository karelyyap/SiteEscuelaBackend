const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post("/login", authController.login);
router.post("/register",authController.register);

router.get("/users", authController.getUsers);
router.get("/users/:id",verifyToken, authController.getUserById);
router.delete("/users/:id", authController.deleteUser);
router.put("/users/:id", authController.updateUser);

router.get("/maestros", authController.getMaestros);
router.post("/maestros/registro", authController.createMaestro);
router.put("/maestros/:id", authController.updateMaestro);
router.delete("/maestros/:id", authController.deleteMaestro);

router.get("/alumnos", authController.getAlumnos);
router.post("/alumnos/registro", authController.createAlumno);
router.put("/alumnos/:id", authController.updateAlumno);
router.delete("/alumnos/:id", authController.deleteAlumno);

router.post("/alumnos/reporte-ia/:id", authController.generarReporteIA);

module.exports = router;

