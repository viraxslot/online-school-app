const config = require('../../../config/config');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

module.exports = {
    async up(queryInterface) {
        const password = config.adminPassword;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = {
            login: config.adminLogin,
            email: faker.internet.email(),
            password: passwordHash,
            // admin role
            role: 3,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await queryInterface.bulkInsert('users', [user], {});
    },
    async down() {
        //
    },
};
