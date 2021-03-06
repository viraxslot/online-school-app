const bcrypt = require('bcryptjs');
const config = require('../../../config/app-config');

module.exports = {
    async up(queryInterface) {
        let credentials;
        try {
            credentials = JSON.parse(config.basicAuth) ?? [];
        } catch (err) {
            console.log('Unable to parse "basicAuth" variable from config: ', err);
        }

        const data = credentials.map((el) => {
            const salt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(el.password, salt);

            return {
                username: el.username,
                password: passwordHash,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        });

        await queryInterface.bulkInsert('basicAuth', data, {});
    },

    async down(queryInterface) {
        return queryInterface.bulkDelete('basicAuth', null, {});
    },
};
