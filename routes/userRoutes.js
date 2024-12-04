import express from 'express';
import {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword,
    resetPassword,
    confirm, 
    comprobarToken,
    nuevoPassword
} from '../controllers/usuarioController.js';

const router = express.Router();

// Ruta para mostrar el formulario de login
router.get('/login', formularioLogin);

// Ruta para mostrar el formulario de registro
router.get('/registro', formularioRegistro);

// Ruta para procesar el registro
router.post('/registro', registrar);

// Ruta para mostrar el formulario de Olvido de contraseña
router.get('/olvide-password', formularioOlvidePassword);

// Ruta para procesar el formulario de Olvido de contraseña (POST)
router.post('/olvide-password', resetPassword); 

// ... (código anterior) ...

// Ruta para confirmar la cuenta con el token (GET)
router.get('/confirmar/:token', confirm); // Llama a la función confirm y cambia la ruta a /confirmar/:token

// Ruta para almacenar el nuevo password
router.get('/reset-password/:token', comprobarToken); // Cambia la ruta a /reset-password/:token

// Ruta para cambiar la contraseña (Nueva contraseña)
router.post('/reset-password/:token', nuevoPassword); // Cambia la ruta a /reset-password/:token

// ... (código posterior) ...

export default router;