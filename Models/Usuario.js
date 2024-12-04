import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt'; // Asegúrate de importar bcrypt
import sequelize from '../config/db.js'; // Conexión a la base de datos

const Usuario = sequelize.define('Usuario', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
    },
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    hooks: {
        beforeCreate: async function (usuario) {
            const salt = await bcrypt.genSalt(10); 
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
});

// Sincroniza el modelo con la base de datos
Usuario.sync({ alter: true }); // 'alter: true' actualiza los cambios si la tabla ya existe

export default Usuario;
