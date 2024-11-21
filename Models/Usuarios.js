import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import bcrypt from 'bcrypt';

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Evitar que se repitan los emails
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Asegura que por defecto sea falso
    }
}, {
    timestamps: true, // Añadir esto para los campos createdAt y updatedAt
    hooks: {
        beforeCreate: async function (usuario) { // Recibe la instancia del usuario
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt); // Hashear la contraseña de la instancia
        }
    }
});

// Sincronizar la tabla con la base de datos
Usuario.sync({ force: false }) // `force: false` para no borrar datos si ya existe la tabla
    .then(() => console.log('Tabla usuarios sincronizada correctamente'))
    .catch(err => console.log('Error al sincronizar tabla usuarios: ', err));

export default Usuario;
