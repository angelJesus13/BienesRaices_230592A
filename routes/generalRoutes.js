import express from "express";

const router = express.Router();

// Ruta para devolver información del usuario
router.get('/quienEres', (req, res) => {
    res.json({
        "Nombre": "Angel de Jesus",
        "Carrera": "D.S.M",
        "Grado": "4",
        "Grupo": "A"
    });
});

export default router;
