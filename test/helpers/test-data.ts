import { faker } from '@faker-js/faker';
import { SchemasV1 } from '../../src/rest-api/v1/schemas';
import { UserRoles } from '../../src/db/models';
import { ApiUserRequest } from '../rest-api/routes/user/user.interfaces';

export class TestData {
    static getRandomPrefix(amount?: number): string {
        return faker.random.alphaNumeric(amount ?? 5);
    }

    static async getUserData(options?: { role: UserRoles; }): Promise<ApiUserRequest> {
        const login = faker.internet.userName() + Date.now();
        const email = faker.internet.email(login);

        const body = {
            login,
            email,
            password: faker.internet.password(),
            role: options?.role ?? UserRoles.Student,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
        };

        return { body };
    }

    static async getCategory(options?: { titleLength?: number; categoryId?: number; }): Promise<any> {
        let title: string;

        if (options?.titleLength) {
            title = faker.random.alpha(options.titleLength);
        } else {
            const now = Date.now().toString();
            title = faker.random.alpha(SchemasV1.CategoryRequest.properties.title.maxLength / 2) + now;
        }

        const body = { title } as any;

        if (options?.categoryId) {
            body.id = options?.categoryId;
        }

        return { body };
    }

    static getCourse(options?: { visible?: boolean; categoryId?: number; courseId?: number; }): any {
        const body: any = {
            title: faker.lorem.words(5) + Date.now(),
            description: faker.lorem.words(10) + Date.now(),
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

    static getMaterial(options?: { materialId?: number; }) {
        const body: any = {
            title: faker.lorem.words(5) + Date.now(),
            data: faker.lorem.words(10) + Date.now(),
            order: null,
        };

        if (options?.materialId) {
            body.id = options.materialId;
        }

        return {
            body,
        };
    }

    static getBanUserData(options?: {
        userId?: number;
        reason?: string | null;
        ban?: boolean;
        jwt?: string;
    }): any {
        return {
            userId: options?.userId ?? null,
            reason: options?.reason ?? faker.lorem.words(3),
            ban: options?.ban ?? null,
            jwt: options?.jwt ?? null
        };
    }
}
