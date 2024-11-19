import express from 'express';
import {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
} from '../controllers/usuarioController.js';

const router = express.Router();

// Ruta para mostrar el formulario de login
router.get('/login', formularioLogin);

// Ruta para mostrar el formulario de registro
router.get('/registro', formularioRegistro);

// Ruta para procesar el registro
router.post('/registro', registrar);

// Ruta para mostrar el formulario de Olvido de contraseña
router.get('/Olvide-Password', formularioOlvidePassword);

export default router;
