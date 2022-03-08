require('../../../config/config');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

module.exports = {
    async up(queryInterface) {
        const users = [];
        for (let i = 0; i < 10; i++) {
            const password = faker.internet.password();
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const role = i % 2 === 0 ? 1 : 2;
            users.push({
                login: faker.internet.userName(),
                email: faker.internet.email(),
                password: passwordHash,
                role,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        await queryInterface.bulkInsert('users', users, {});
    },

    async down(queryInterface) {
        return queryInterface.bulkDelete('users', null, {});
    },
};
