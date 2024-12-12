import jwt from 'jsonwebtoken';

// Generar un ID único
const generatetId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

// Generar JWT
const generarJWT = id => jwt.sign(
    {
        id, // ID del usuario
        developerName: 'Angel de Jesus Baños',
        empresa: 'Universidad Tecnológica de Xicotepec de Juárez',
        tecnologias: 'Node.js'
    },
    process.env.JWT_SECRET, // Clave secreta desde el entorno
    {
        expiresIn: '1h' // Token válido por 1 hora
    }
);

export {
    generarJWT,
    generatetId
};
