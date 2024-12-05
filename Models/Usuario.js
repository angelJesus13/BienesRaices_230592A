import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt'; // Importar bcrypt
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
        },
        beforeUpdate: async function (usuario) {
            // Si el campo password fue modificado
            if (usuario.changed('password')) {
                // Verificar si el password ya está hasheado
                const isHashed = bcrypt.getRounds(usuario.password) > 0; // Revisa si tiene un salt válido
                if (!isHashed) {
                    const salt = await bcrypt.genSalt(10);
                    usuario.password = await bcrypt.hash(usuario.password, salt);
                }
            }
        }
    }
});

export default Usuario;
