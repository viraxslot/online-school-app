import { UserRoles } from '../../src/db/models';
import { LoginRoute } from '../api/routes/login/login.route';
import { TestData } from './test-data';

interface UserIdAndToken {
    userId: number;
    token: string;
}

export class ApiHelper {
    static async getStudentToken(): Promise<UserIdAndToken> {
        return this.getToken(UserRoles.Student);
    }

    static async getTeacherToken(): Promise<UserIdAndToken> {
        return this.getToken(UserRoles.Teacher);
    }

    static async getAdminToken(): Promise<UserIdAndToken> {
        return this.getToken(UserRoles.Admin);
    }

    private static async getToken(role: UserRoles): Promise<UserIdAndToken> {
        const user = TestData.getUserData({
            role,
        });
        const signUpResponse = await LoginRoute.postSignUp(user);
        expect(signUpResponse.status).toBe(200);

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
            userId: signUpResponse.body.id,
            token,
        };
    }
}
