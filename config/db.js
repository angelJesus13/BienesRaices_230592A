import Sequelize from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Verificar que las variables de entorno estén cargadas correctamente
console.log('Conectando a la base de datos:', process.env.DB_NAME);

// Configuración de la conexión a la base de datos con Sequelize
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 3306,  // Puerto por defecto de MySQL
    dialect: 'mysql',
    define: {
        timestamps: true // Para que Sequelize agregue automáticamente las fechas de creación y actualización
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false,  // Desactivar los alias de operadores antiguos
    timezone: '-06:00',     // Zona horaria para la base de datos
    dialectOptions: {
        timezone: 'local',   // Configura la zona horaria local del servidor
    }
});

// Verificar la conexión a la base de datos
db.authenticate()
    .then(() => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch((error) => {
        console.error('No se pudo conectar a la base de datos:', error);
    });

export default db;

