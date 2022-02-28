const config = require('../config/config');
import sequelize from '../src/db/sequelize';

module.exports = async () => {
    console.log('Jest global setup');
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
