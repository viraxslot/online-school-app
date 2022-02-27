const config = require('../../../config/config');

module.exports = {
    async up(queryInterface, Sequelize) {
        const apiKeys = JSON.parse(config?.apiKeys) ?? [];

        const data = apiKeys.map((key) => {
            return {
                apiKey: key,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        });

        await queryInterface.bulkInsert('apiKeys', data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('apiKeys', null, {});
    },
};
