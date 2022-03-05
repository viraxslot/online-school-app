import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { SchemasV1 } from '../../src/api/v1/schemas';
import { UserRoles } from '../../src/api/v1/user/user.interfaces';
import { ApiUserRequest } from '../api/routes/user/user.interfaces';

export class TestData {
    static getUserData(options?: { role: UserRoles }): ApiUserRequest {
        return {
            body: {
                login: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: options?.role ?? (sample(Object.values(UserRoles)) as any),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
            },
        };
    }

    static getCategory(options?: { titleLength?: number; categoryId?: number }): any {
        const randomCount = faker.datatype.number({
            min: SchemasV1.CategoryRequest.properties.title.minLength,
            max: SchemasV1.CategoryRequest.properties.title.maxLength,
        });

        const body: any = {
            title: faker.random.alpha(options?.titleLength ?? randomCount),
        };

        if (options?.categoryId) {
            body.id = options?.categoryId;
        }

        return {
            body,
        };
    }
}
