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

    static async getCategory(token: string): Promise<CreatedCategory> {
        const categoryData = await TestData.getCategory();
        const categoryResponse = await CategoryRoute.postCategory(categoryData, token);
        expect(categoryResponse.status).toBe(200);
        const categoryId = categoryResponse.body.id;

        return {
            categoryId,
        };
    }

    static async getCourse(token: string): Promise<CreatedCourse> {
        const { categoryId } = await this.getCategory(token);
        const courseData = TestData.getCourse({ categoryId });

        const createdCourse = await CourseRoute.postCourse(courseData, token);
        expect(createdCourse.status).toBe(200);

        const courseId = createdCourse.body.id;

        return {
            courseId,
            categoryId,
        };
    }

    private static async getToken(role: UserRoles): Promise<CreatedUser> {
        const user = await TestData.getUserData({
            role,
        });

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

        const signInResponse = await LoginRoute.postSignIn({
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
