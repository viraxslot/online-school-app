'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('courses', 'description', {
            type: Sequelize.DataTypes.STRING(500),
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('courses', 'description', {
            type: Sequelize.DataTypes.STRING(255),
        });
    },
};
