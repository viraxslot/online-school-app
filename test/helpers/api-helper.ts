import { User, UserRoles } from '../../src/db/models';
import { LoginRoute } from '../api/routes/login/login.route';
import { TestData } from './test-data';

interface UserIdAndToken {
    userId: number;
    token: string;
}

export class ApiHelper {
    static async getStudentToken(): Promise<UserIdAndToken> {
        return await this.getToken(UserRoles.Student);
    }

    static async getTeacherToken(): Promise<UserIdAndToken> {
        return await this.getToken(UserRoles.Teacher);
    }

    static async getAdminToken(): Promise<UserIdAndToken> {
        return await this.getToken(UserRoles.Admin);
    }

    private static async getToken(role: UserRoles): Promise<UserIdAndToken> {
        const user = TestData.getUserData({
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
