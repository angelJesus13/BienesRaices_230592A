import Usuario from '../Models/Usuarios.js';
import { check, validationResult } from 'express-validator';
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
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });
};

// Registrar un nuevo usuario con token
const registrar = async (req, res) => {
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('email').isEmail().withMessage('El email debe ser válido').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de más de 6 caracteres').run(req);
    await check('confirmacion_password').equals(req.body.password).withMessage('La confirmación de la contraseña debe coincidir con la contraseña').run(req);

    // Validación de la fecha de nacimiento
    await check('fecha_nacimiento').custom((value) => {
        const fechaNacimiento = new Date(value);
        const edad = new Date().getFullYear() - fechaNacimiento.getFullYear();
        if (edad < 18) {
            throw new Error('Debes ser mayor de 18 años para registrarte.');
        }
        return true;
    }).run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
                fecha_nacimiento: req.body.fecha_nacimiento // Mantener la fecha en el formulario
            }
        });
    }

    const existeUsuario = await Usuario.findOne({ where: { email: req.body.email } });
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya está registrado.' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
                fecha_nacimiento: req.body.fecha_nacimiento
            }
        });
    }

    const token = generatetId();
    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        fecha_nacimiento: req.body.fecha_nacimiento, // Aquí se guarda la fecha de nacimiento
        token
    });

    console.log('Usuario creado:', usuario); // Verificar que el usuario y la fecha de nacimiento se están guardando correctamente

    // Asegúrate de que la tabla esté sincronizada, si es necesario
    await Usuario.sync({ alter: true });

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

    try {
        const userWithToken = await Usuario.findOne({ where: { token } });

        if (!userWithToken) {
            console.log('Token inválido o expirado');
            return res.render('auth/confirmAccount', {
                pagina: 'Token inválido o expirado',
                msg: 'El token no es válido o ha expirado. Verifica la liga enviada a tu correo.',
                estado: 'error'
            });
        }

        userWithToken.token = null;
        userWithToken.confirmado = true;
        await userWithToken.save();

        console.log('Cuenta confirmada exitosamente');
        res.render('auth/confirmAccount', {
            pagina: 'Cuenta confirmada',
            msg: 'Tu cuenta ha sido confirmada exitosamente. Ahora puedes iniciar sesión.',
            estado: 'exito'
        });
    } catch (error) {
        console.error('Error al confirmar la cuenta:', error);
        res.render('auth/confirmAccount', {
            pagina: 'Error',
            msg: 'Hubo un problema al confirmar tu cuenta. Por favor, intenta nuevamente más tarde.',
            estado: 'error'
        });
    }
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
    formularioOlvidePassword,
    confirm
};
