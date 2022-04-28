import { User, UserRoles } from '../../src/db/models';
import { logger } from '../../src/helpers/winston-logger';
import { CategoryRoute } from '../rest-api/routes/category/category.route';
import { CourseRoute } from '../rest-api/routes/course/course.route';
import { LoginRoute } from '../rest-api/routes/login/login.route';
import { TestData } from './test-data';

interface CreatedUser {
    userId: number;
    token: string;
}

interface CreatedCategory {
    categoryId: number;
}

interface CreatedCourse extends CreatedCategory {
    courseId: number;
}

interface CreatedMaterial {
    materialId: number;
}

export class ApiHelper {
    /**
     * Create category
     * @param adminToken
     * @returns
     */
    static async createCategory(adminToken: string): Promise<CreatedCategory> {
        const categoryData = await TestData.getCategory();
        const categoryResponse = await CategoryRoute.postCategory(categoryData, adminToken);
        expect(categoryResponse.status).toBe(200);
        const categoryId = categoryResponse.body.id;

        return {
            categoryId,
        };
    }

    /**
     * Create category and course inside it
     * @param adminToken
     * @returns
     */
    static async createCourse(adminToken: string): Promise<CreatedCourse> {
        const { categoryId } = await this.createCategory(adminToken);
        const courseData = TestData.getCourse({ categoryId });

        const createdCourse = await CourseRoute.postCourse(courseData, adminToken);
        expect(createdCourse.status).toBe(200);

        const courseId = createdCourse.body.id;

        return {
            courseId,
            categoryId,
        };
    }

    /**
     * Create course material
     * @param adminToken should be the same token as for course creation
     * @returns
     */
    static async createMaterial(courseId: number, adminToken: string): Promise<CreatedMaterial> {
        const material = TestData.getMaterial();

        const result = await CourseRoute.postMaterial(courseId, material, adminToken);
        const materialId = result.body.id;

        return {
            materialId,
        };
    }

    static async createStudent(): Promise<CreatedUser> {
        return await this.createUser(UserRoles.Student);
    }

    static async createTeacher(): Promise<CreatedUser> {
        return await this.createUser(UserRoles.Teacher);
    }

    static async createAdmin(): Promise<CreatedUser> {
        return await this.createUser(UserRoles.Admin);
    }

    static async createUser(role: UserRoles): Promise<CreatedUser> {
        const user = await TestData.getUserData({
            role,
        });

        expect(user.body.role).toBe(role);

        let createdUser;
        try {
            createdUser = await User.create({
                login: user.body.login,
                email: user.body.email,
                firstName: user.body?.firstName ?? null,
                lastName: user.body?.lastName ?? null,
                password: user.body.password,
                role: user.body.role,
            });
        } catch (err) {
            logger.error(err);
            expect(err).toBeNull();
        }

        const signInResponse = await LoginRoute.postSession({
            body: {
                username: user.body.login,
                password: user.body.password,
            },
        });

        expect(signInResponse.status).toBe(200);
        const token = signInResponse?.body?.accessToken;
        expect(token).not.toBeUndefined();

        return {
            userId: (createdUser as any).toJSON().id,
            token,
        };
    }
}
