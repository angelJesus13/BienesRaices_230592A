import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Asegúrate de importar tu conexión a la base de datos

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
        type: DataTypes.DATEONLY,  // Usamos DATEONLY para solo almacenar la fecha
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
    },
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Sincroniza el modelo con la base de datos
Usuario.sync({ alter: true });  // 'alter: true' se asegura de que se actualicen los cambios si ya existe la tabla

export default Usuario;
