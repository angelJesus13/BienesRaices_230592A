import Sequelize from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Verificar que las variables de entorno estén cargadas correctamente
console.log('Conectando a la base de datos:', process.env.BD_NOMBRE);

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASSWORD, {
    host: process.env.BD_HOST,
    port: 3306,  // Puerto por defecto de MySQL
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false,
    timezone: '-06:00',  
    dialectOptions: {
        timezone: 'local', // Configura la zona horaria del servidor
    }
});

// Verificar la conexión
db.authenticate()
    .then(() => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch((error) => {
        console.error('No se pudo conectar a la base de datos:', error);
    });

export default db;
