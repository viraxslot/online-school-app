import {faker} from '@faker-js/faker';
import { sample } from 'lodash';
import { UserRoles } from '../../src/api/v1/user/user.interfaces';
import { ApiUserRequest } from '../api/routes/user/user.interfaces';

export class TestData {
    static getUserData(options?: { role: UserRoles }): ApiUserRequest {
        return {
            body: {
                login: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: options?.role ?? sample(Object.values(UserRoles)) as any,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
            },
        };
    }
}
