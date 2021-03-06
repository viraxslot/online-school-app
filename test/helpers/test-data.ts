import { faker } from '@faker-js/faker';
import { SchemasV1 } from '../../src/rest-api/v1/schemas';
import { UserRoles } from '../../src/db/models';
import { ApiUserRequest } from '../rest-api/routes/user/user.interfaces';

export class TestData {
    static getRandomPrefix(amount?: number): string {
        return faker.random.alphaNumeric(amount ?? 5);
    }

    static getUserData(options?: {
        role: UserRoles;
        username?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
    }): ApiUserRequest {
        const username = options?.username ?? faker.internet.userName() + Date.now();
        const email = options?.email ?? faker.internet.email(username);
        const password = options?.password ?? faker.internet.password();

        const body = {
            username,
            email,
            password,
            role: options?.role ?? UserRoles.Student,
            firstName: options?.firstName ?? faker.name.firstName(),
            lastName: options?.lastName ?? faker.name.lastName(),
        };

        return { body };
    }

    static getCategory(options?: { titleLength?: number; categoryId?: number }): any {
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

    static getCourse(options?: { visible?: boolean; categoryId?: number; courseId?: number }): any {
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

    static getMaterial(options?: { materialId?: number }) {
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

    static getBanUserData(options?: { userId?: number; reason?: string | null; ban?: boolean; jwt?: string }): any {
        return {
            userId: options?.userId ?? null,
            reason: options?.reason ?? faker.lorem.words(3),
            ban: options?.ban ?? null,
            jwt: options?.jwt ?? null,
        };
    }
}
