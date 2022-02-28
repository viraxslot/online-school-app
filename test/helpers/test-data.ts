import { LoginRoles } from '../../src/api/v1/login/login.interfaces';
import { LoginRequest } from '../api/routes/login/login.interfaces';
import {faker} from '@faker-js/faker';
import { sample } from 'lodash';

export class TestData {
    static getUserData(options?: { role: LoginRoles }): LoginRequest {
        return {
            body: {
                nickname: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: options?.role ?? sample(Object.values(LoginRoles)) as any,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
            },
        };
    }
}
