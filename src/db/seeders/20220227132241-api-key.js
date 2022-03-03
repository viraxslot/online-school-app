const config = require('../../../config/config');

module.exports = {
    async up(queryInterface) {
        let apiKeys;
        try {
            apiKeys = JSON.parse(config?.apiKeys) ?? [];
        } catch (err) {
            console.log('Unable to parse "apiKeys" variable from config: ', err);
        }

        const data = apiKeys.map((key) => {
            return {
                apiKey: key,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        });

        await queryInterface.bulkInsert('apiKeys', data, {});
    },

    async down(queryInterface) {
        return queryInterface.bulkDelete('apiKeys', null, {});
    },
};
