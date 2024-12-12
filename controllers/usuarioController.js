import Usuario from '../Models/Usuario.js';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { generarJWT, generatetId } from '../helpers/tokens.js';
import { emailRegistro, emailChangePassword } from '../helpers/emails.js';

// Mostrar formulario de login
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    });
};

// Mostrar formulario de registro
const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });
};

// Registrar un nuevo usuario
const registrar = async (req, res) => {
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('email').isEmail().withMessage('El email debe ser válido').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);
    await check('confirmacion_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);
    await check('fecha_nacimiento').notEmpty().withMessage('La fecha de nacimiento es obligatoria').run(req);  // Validación de fecha de nacimiento

    const resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: req.body
        });
    }

    const existeUsuario = await Usuario.findOne({ where: { email: req.body.email } });
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya está registrado.' }],
            usuario: req.body
        });
    }

    const token = generatetId();
    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        token,
        fecha_nacimiento: req.body.fecha_nacimiento // Guardamos la fecha de nacimiento
    });

    await emailRegistro({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });

    res.render('templates/message', {
        pagina: 'Cuenta creada satisfactoriamente',
        msg: `Hemos enviado un correo a ${req.body.email} para la confirmación de la cuenta`
    });
};

// Confirmar cuenta
const confirm = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render('auth/confirmAccount', {
            pagina: 'Token inválido o expirado',
            msg: 'El token no es válido o ha expirado. Verifica la liga enviada a tu correo.',
            estado: 'error'
        });
    }

    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmAccount', {
        pagina: 'Cuenta confirmada',
        msg: 'Tu cuenta ha sido confirmada exitosamente. Ahora puedes iniciar sesión.',
        estado: 'exito'
    });
};

// Mostrar formulario de olvido de contraseña
const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recuperar Contraseña',
        csrfToken: req.csrfToken()
    });
};

// Procesar el formulario de olvido de contraseña
const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('El correo debe ser válido').run(req);

    const resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a BienesRaices',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        });
    }

    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El correo no pertenece a ningún usuario, verifica tus datos' }]
        });
    }

    usuario.token = generatetId();
    await usuario.save();

    await emailChangePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });

    res.render('templates/message', {
        pagina: 'Restablece tu Contraseña',
        msg: `Hemos enviado un correo a ${req.body.email} con las instrucciones para restablecer tu contraseña.`
    });
};

// Comprobar token para restablecimiento de contraseña
const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render('auth/reset-password', {
            pagina: 'Token inválido o expirado',
            msg: 'El token no es válido o ha expirado. Verifica la liga enviada a tu correo.',
            estado: 'error'
        });
    }

    const csrfToken = req.csrfToken();

    res.render('auth/reset-password', {
        pagina: 'Restablece tu contraseña',
        msg: 'El token es válido. Puedes proceder a cambiar tu contraseña.',
        estado: 'exito',
        token,
        csrfToken
    });
};

// Cambiar contraseña del usuario
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Token inválido o expirado',
            msg: 'El token no es válido o ha expirado. Verifica la liga enviada a tu correo.',
            estado: 'error'
        });
    }

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null; // Se limpia el token después de cambiar la contraseña
    await usuario.save();

    res.render('auth/confirmAccount', {
        pagina: 'Contraseña actualizada',
        msg: 'Tu contraseña ha sido actualizada con éxito.',
        estado: 'exito'
    });
};

// Autenticar al usuario
const userAuthentication = async (req, res, next) => {
    const { correo, password } = req.body;

    console.log('Intentando iniciar sesión con el correo:', correo);

    // Validación básica
    await check('correo').isEmail().withMessage('El correo no es válido').run(req);
    await check('password').notEmpty().withMessage('La contraseña no puede estar vacía').run(req);

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: req.body
        });
    }

    const usuario = await Usuario.findOne({ where: { email: correo } });

    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El correo no está registrado.' }],
            usuario: req.body
        });
    }

    // Verificar si la cuenta está confirmada
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Debes confirmar tu cuenta antes de iniciar sesión.' }],
            usuario: req.body
        });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Contraseña incorrecta.' }],
            usuario: req.body
        });
    }

    // Generar el JWT
    const token = generarJWT(usuario.id);

    // Imprimir el token en la consola
    console.log('Token generado:', token);

    // Almacenar el token en una cookie
    res.cookie('_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Solo si es producción, asegurar que sea seguro
        sameSite: 'Strict',
    }).redirect('/mis-propiedades');
};


export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword,
    resetPassword,
    confirm,
    comprobarToken,
    nuevoPassword,
    userAuthentication
};
