import Usuario from '../Models/Usuario.js'; // Importa el modelo de usuario
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { generatetId } from '../helpers/tokens.js';
import { emailRegistro, emailChangePassword } from '../helpers/emails.js';

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
    // Realiza las validaciones
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('email').isEmail().withMessage('El email debe ser válido').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de más de 6 caracteres').run(req);
    await check('confirmacion_password').equals(req.body.password).withMessage('La confirmación de la contraseña debe coincidir con la contraseña').run(req);
    await check('fecha_nacimiento').custom((value) => {
        const fechaNacimiento = new Date(value);
        const edad = new Date().getFullYear() - fechaNacimiento.getFullYear();
        if (edad < 18) {
            throw new Error('Debes ser mayor de 18 años para registrarte.');
        }
        return true;
    }).run(req);

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
        fecha_nacimiento: req.body.fecha_nacimiento,
        token
    });

    console.log('Usuario creado:', usuario);

    // Enviar el correo de registro
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
    console.log("Token recibido:", token);

    try {
        const usuario = await Usuario.findOne({ where: { token } });
        console.log("Usuario encontrado:", usuario);

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

        console.log("Cuenta confirmada");
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
    res.render("auth/olvide-password", {      
        pagina: 'Recuperar Contraseña',
        csrfToken: req.csrfToken()
    });
};

// Procesar el formulario de olvido de contraseña
const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('El correo debe ser válido revisa por favor tu correo').run(req);
    let resultado = validationResult(req);
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

    // Generar un token y guardar el usuario
    usuario.token = generatetId();
    await usuario.save();

    // Enviar el correo
    await emailChangePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });

    // Renderizar el mensaje
    res.render('templates/message', {
        pagina: 'Restablece tu Contraseña',
        msg: `Hemos enviado un correo a ${req.body.email} para la confirmación de la cuenta`
    });
};

// Comprobar token para resetear contraseña
const comprobarToken = async (req, res) => {
    const { token } = req.params;

    // Buscar el usuario con el token proporcionado
    const usuario = await Usuario.findOne({
        where: { token: token }
    });

    // Si no se encuentra el usuario, renderizar mensaje de error
    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Restablece tu password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        });
    }

    // Mostrar formulario para modificar la contraseña
    res.render('auth/reset-password', {
        pagina: 'Restablece tu Contraseña',
        csrfToken: req.csrfToken() 
    });
};

// Cambiar la contraseña (Nueva contraseña)
const nuevoPassword = async (req, res) => {
    // Validar campos de contraseña y confirmación
    await check('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .run(req);

    await check('confirm_password')
        .notEmpty()
        .withMessage('La confirmación de la contraseña es obligatoria')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Las contraseñas no coinciden')
        .run(req);

        const resultado = validationResult(req);
        if (!resultado.isEmpty()) {
            return res.render('auth/olvide-password', {
                pagina: 'Recupera tu acceso a BienesRaices',
                csrfToken: req.csrfToken(),
                errores: resultado.array(),
            });
        }        

    const { token } = req.params;
    const { password } = req.body;

    try {
        // Identificar quién hace el cambio
        const usuario = await Usuario.findOne({ where: { token } });

        if (!usuario) {
            return res.render('auth/reset-password', {
                pagina: 'Restablecer tu Contraseña',
                csrfToken: req.csrfToken(),
                errores: [{ msg: 'El token no es válido o ha expirado' }]
            });
        }

        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
        usuario.token = null;

        await usuario.save();

        res.render('auth/confirmAccount', {
            pagina: 'Contraseña Reestablecida',
            msg: 'La contraseña se guardó correctamente'
        });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.render('auth/reset-password', {
            pagina: 'Restablecer tu Contraseña',
            errores: [{ msg: 'Hubo un error al restablecer la contraseña. Intenta nuevamente más tarde.' }],
            csrfToken: req.csrfToken(),
        });
    }
};

// Exportar las funciones
export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword,
    resetPassword,
    confirm,
    nuevoPassword, 
    comprobarToken
};
