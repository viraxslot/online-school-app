import { User, UserRoles } from '../../src/db/models';
import { CategoryRoute } from '../api/routes/category/category.route';
import { CourseRoute } from '../api/routes/course/course.route';
import { LoginRoute } from '../api/routes/login/login.route';
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

export class ApiHelper {
    static async getStudentToken(): Promise<CreatedUser> {
        return await this.getToken(UserRoles.Student);
    }

    static async getTeacherToken(): Promise<CreatedUser> {
        return await this.getToken(UserRoles.Teacher);
    }

    static async getAdminToken(): Promise<CreatedUser> {
        return await this.getToken(UserRoles.Admin);
    }

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

    static async getToken(role: UserRoles): Promise<CreatedUser> {
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
            console.log(err);
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
