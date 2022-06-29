'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('materials', 'data', {
            type: Sequelize.DataTypes.STRING(1000),
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('materials', 'data', {
            type: Sequelize.DataTypes.STRING(255),
        });
    },
};
