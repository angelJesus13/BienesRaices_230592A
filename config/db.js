import Sequelize from 'sequelize';

const db = new Sequelize('BienesRaices_230592', 'Angel_230592', 'taylor2', {
    host: 'localhost',
    port: 3306,
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
    operatorAliases: false
});

export default db;
