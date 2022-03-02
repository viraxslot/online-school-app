import { UserRoles } from '../../src/api/v1/user/user.interfaces';
import { User } from '../../src/db/models';
import { LoginRoute } from '../api/routes/login/login.route';
import { TestData } from '../helpers/test-data';

describe('API: login route suite', function () {
    const createdUsers: number[] = [];

    it('should return validation error if role has wrong value', async () => {
        const user = TestData.getUserData();
        user.body.role = 'test' as any;

        const result = await LoginRoute.postSignUp(user);
        expect(result.status).toBe(400);
        const error = (result.body as any).errors[0];
        expect(error.param).toBe('role');
        expect(error.msg).toBe('Wrong role, please send the right role: student,teacher');
    });

    it('should return validation error if email has wrong format', async () => {
        const user = TestData.getUserData();
        user.body.email = 'test@';

        const result = await LoginRoute.postSignUp(user);
        expect(result.status).toBe(400);

        const error = (result.body as any).errors[0];
        expect(error.param).toBe('email');
        expect(error.msg).toBe('Invalid value');
    });

    it('should return validation error if user already exists', async () => {
        const user = TestData.getUserData();
        const createdUser = await User.create({
            nickname: user.body.nickname,
            email: user.body.email,
            password: user.body.password,
            role: user.body.role,
        });

        const id = createdUser.getDataValue('id') as number;
        createdUsers.push(id);

        const result = await LoginRoute.postSignUp(user);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('User with such credentials already exist');
    });

    const createTestCases = [
        { title: 'with student role', role: UserRoles.Student, expectedRoleId: 1 },
        { title: 'with teacher role', role: UserRoles.Teacher, expectedRoleId: 2 },
    ];

    createTestCases.forEach((test) => {
        it(`should be possible to create user ${test.title}`, async () => {
            const user = TestData.getUserData({
                role: test.role,
            });

            const result = await LoginRoute.postSignUp(user);
            const id = result.body.id;
            createdUsers.push(id);

            expect(result.status).toBe(200);
            expect(result.body.nickname).toBe(user.body.nickname);
            expect(result.body.email).toBe(user.body.email);
            expect(result.body.password).not.toBe(user.body.password);
            expect(result.body.firstName).toBe(user.body.firstName);
            expect(result.body.lastName).toBe(user.body.lastName);
            expect(result.body.role).toBe(test.expectedRoleId);
        });
    });

    afterAll(async () => {
        for (let userId of createdUsers) {
            await User.destroy({
                where: {
                    id: userId,
                },
            });
        }
    });
});
