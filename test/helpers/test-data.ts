import { faker } from '@faker-js/faker';
import { isNil } from 'lodash';
import { Op } from 'sequelize';
import { SchemasV1 } from '../../src/api/v1/schemas';
import { Category, User, UserRoles } from '../../src/db/models';
import { ApiUserRequest } from '../api/routes/user/user.interfaces';

export class TestData {
    static getRandomPrefix(amount?: number): string {
        return faker.random.alphaNumeric(amount ?? 5);
    }

    static async getUserData(options?: { role: UserRoles }): Promise<ApiUserRequest> {
        let login: string;
        let email: string;
        let body: any;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            login = faker.internet.userName();
            email = faker.internet.email();
            const user = await User.findOne({
                raw: true,
                where: {
                    [Op.or]: [{ login }, { email }],
                },
            });

            if (isNil(user)) {
                body = {
                    login,
                    email,
                    password: faker.internet.password(),
                    role: options?.role ?? UserRoles.Student,
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                };
                break;
            }
        }

        return { body };
    }

    static async getCategory(options?: { titleLength?: number; categoryId?: number }): Promise<any> {
        const randomCount = faker.datatype.number({
            min: SchemasV1.CategoryRequest.properties.title.minLength,
            max: SchemasV1.CategoryRequest.properties.title.maxLength,
        });

        let title: string;
        let body: any;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            title = faker.random.alpha(options?.titleLength ?? randomCount);
            const category = await Category.findOne({
                raw: true,
                where: {
                    title,
                },
            });

            if (isNil(category)) {
                body = { title };
                break;
            }
        }

        if (options?.categoryId) {
            body.id = options?.categoryId;
        }

        return { body };
    }

    static getCourse(options?: { visible?: boolean; categoryId?: number; courseId?: number }): any {
        const body: any = {
            title: faker.lorem.words(5),
            description: faker.lorem.words(10),
            visible: options?.visible ?? true,
            categoryId: options?.categoryId ?? 1,
        };

        if (options?.courseId) {
            body.id = options.courseId;
        }

        return {
            body,
        };
    }

    static getMaterial(options?: { courseId?: number; materialId?: number }) {
        const body: any = {
            title: faker.lorem.words(5),
            data: faker.lorem.words(10),
            order: null,
        };

        if (options?.materialId) {
            body.id = options.materialId;
        }

        return {
            body,
        };
    }
}
