// controllers/userController.js

// Controlador para mostrar el formulario de login
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        autenticado: true,
    });
};

// Controlador para mostrar el formulario de registro
const formularioRegister = (req, res) => {
    res.render('auth/register', {
        autenticado: true,
    });
};

// Controlador para mostrar el formulario de recuperación de contraseña
const formularioPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        autenticado: true,
    });
};

// Exportar los controladores
export { formularioLogin, formularioRegister, formularioPasswordRecovery };
