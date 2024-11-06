import express from 'express'
import {formularioLogin, formularioRegistro, formularioOlvidePassword} from '../controllers/usuarioController.js'
const router = express.Router();

router.get('/Login', formularioLogin);
router.get('/registro', formularioRegistro)
router.get('/Olvide-Password', formularioOlvidePassword)

export default router