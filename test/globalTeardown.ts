import sequelize from '../src/db/sequelize';

module.exports = async () => {
    console.log('Jest global teardown');
    await sequelize.close();
};
