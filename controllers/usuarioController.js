import { check, validationResult } from 'express-validator';
import Usuario from '../Models/Usuarios.js';
import { generatetId } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js';

// Mostrar formulario de login
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    });
};

// Mostrar formulario de registro
const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    });
};

// Registrar un nuevo usuario con token
const registrar = async (req, res) => {
    console.log('Datos recibidos en el formulario:', req.body);

    // Validaciones
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('email').isEmail().withMessage('El email debe ser válido').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de más de 6 caracteres').run(req);
    await check('confirmacion_password').equals(req.body.password).withMessage('La confirmación de la contraseña debe coincidir con la contraseña').run(req);

    let resultado = validationResult(req);

    // Si hay errores en la validación
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ where: { email: req.body.email } });
    if (existeUsuario) {
        return res.render("auth/registro", {
            pagina: 'Crear Cuenta',
            errores: [{ msg: 'El usuario ya está registrado.' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    // Generar token y registrar el usuario
    const token = generatetId();
    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        token: token  // Incluir el token generado
    });

    // Enviar correo de confirmación
    try {
        await emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        });
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{ msg: 'Hubo un problema al enviar el correo de confirmación. Inténtalo más tarde.' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    // Mostrar mensaje de éxito
    res.render('templates/message', {
        pagina: 'Cuenta creada satisfactoriamente',
        msg: `Hemos enviado un correo a ${req.body.email} para la confirmación de la cuenta`
    });
};

// Mostrar formulario para recuperar contraseña
const formularioOlvidePassword = (req, res) => {
    res.render('auth/Olvide-Password', {
        pagina: 'Recupera tu Cuenta por Contraseña Perdida'
    });
};

// Exportar las funciones
export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
};
