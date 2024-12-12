import jwt from 'jsonwebtoken';
import Usuario from '../Models/Usuario.js';

const admin = async (req, res) => {
    const token = req.cookies._token;

    if (!token) {
        return res.redirect('/auth/login'); // Si no hay token, redirigir al login
    }

    try {
        // Decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar al usuario en la base de datos
        const usuario = await Usuario.findByPk(decoded.id);

        if (!usuario) {
            return res.redirect('/auth/login'); // Si no se encuentra el usuario, redirigir al login
        }

        // Renderizar la vista con el nombre del usuario
        res.render('propiedades/admin', {
            pagina: `Bienvenido a tus Propiedades, ${usuario.nombre}`,
            usuario: usuario.nombre // Pasamos el nombre del usuario a la vista
        });

    } catch (error) {
        return res.redirect('/auth/login'); // En caso de error en la verificación del token
    }
};

export { admin };
