
const formularioLogin = (req, res) => {
    res.render('auth/login',{
        pagina: 'Iniciar Sesion'
    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro',{
        pagina: 'Crear Cuenta'
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/Olvide-Password',{
        pagina: 'Recupera tu Cuenta por Contraseña Perdida'
    })
}

export{
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
}