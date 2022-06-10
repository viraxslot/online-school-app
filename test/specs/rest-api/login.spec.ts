import { SchemasV1 } from '../../../src/rest-api/v1/schemas';
import { User } from '../../../src/db/models';
import { BanUserRoute } from '../../rest-api/routes/banned-users/banned-users.route';
import { LoginRoute } from '../../rest-api/routes/login/login.route';
import { UserRoute } from '../../rest-api/routes/user/user.route';
import { ApiHelper } from '../../helpers/api-helper';
import { SchemaValidator } from '../../helpers/schema-validator';
import { TestData } from '../../helpers/test-data';

describe('REST API: login route suite', function () {
    const createdUserIds: number[] = [];

    describe('POST, session', function () {
        it('should return validation error if no username passed', async () => {
            const signInResponse = await LoginRoute.postSession({
                body: {
                    password: 'test',
                } as any,
            });

            expect(signInResponse.status).toBe(400);
            expect(signInResponse.body.errors.length).toBe(1);
            const error = signInResponse.body.errors[0];

            expect(error.location).toBe('body');
            expect(error.param).toBe('username');
            expect(error.msg).toBe('Invalid value');
        });

        it('should return validation error if no password passed', async () => {
            const signInResponse = await LoginRoute.postSession({
                body: {
                    username: 'test',
                } as any,
            });

            expect(signInResponse.status).toBe(400);
            expect(signInResponse.body.errors.length).toBe(1);
            const error = signInResponse.body.errors[0];

            expect(error.location).toBe('body');
            expect(error.param).toBe('password');
            expect(error.msg).toBe('Invalid value');
        });

        it('should return validation error if user not found', async () => {
            const user = await TestData.getUserData();
            const signInResponse = await LoginRoute.postSession({
                body: {
                    username: user.body.username,
                    password: user.body.password,
                },
            });

            expect(signInResponse.status).toBe(404);
            expect(signInResponse.body.errors).toBe('Unable to find user record');
        });

        it('should return validation error if wrong credentials passed', async () => {
            const user = await TestData.getUserData();
            const signUpResponse = await UserRoute.postUser(user);
            expect(signUpResponse.status).toBe(200);
            createdUserIds.push(signUpResponse.body.id);

            const signInResponse = await LoginRoute.postSession({
                body: {
                    username: user.body.username,
                    password: user.body.password + '1',
                },
            });
            expect(signInResponse.status).toBe(400);
            expect(signInResponse.body.errors).toBe('Unable to authenticate user, wrong credentials');
        });

        it('should return created earlier token if it exists', async () => {
            const user = await TestData.getUserData();
            const signUpResponse = await UserRoute.postUser(user);
            expect(signUpResponse.status).toBe(200);
            createdUserIds.push(signUpResponse.body.id);

            const signInResponse1 = await LoginRoute.postSession({
                body: {
                    username: user.body.username,
                    password: user.body.password,
                },
            });
            expect(signInResponse1.status).toBe(200);
            const token1 = signInResponse1.body.accessToken;

            const signInResponse2 = await LoginRoute.postSession({
                body: {
                    username: user.body.username,
                    password: user.body.password,
                },
            });
            expect(signInResponse2.status).toBe(200);
            const token2 = signInResponse2.body.accessToken;

            expect(token1).toBe(token2);
        });

        const positiveTestCases = [{ title: 'username' }, { title: 'email' }];
        positiveTestCases.forEach((test) => {
            it(`should return jwt token if credentials are correct (${test.title})`, async () => {
                const user = await TestData.getUserData();
                const signUpResponse = await UserRoute.postUser(user);
                expect(signUpResponse.status).toBe(200);
                createdUserIds.push(signUpResponse.body.id);

                const signInResponse = await LoginRoute.postSession({
                    body: {
                        username: (user.body as any)[test.title],
                        password: user.body.password,
                    },
                });
                expect(signInResponse.status).toBe(200);
                expect(typeof signInResponse.body.accessToken).toBe('string');
                SchemaValidator.check(signInResponse.body, SchemasV1.SessionResponse);
            });
        });

        it('should not be possible to get new session if user is banned', async () => {
            const admin = await ApiHelper.createAdmin();
            const user = await TestData.getUserData();
            const signUpResponse = await UserRoute.postUser(user);
            expect(signUpResponse.status).toBe(200);

            const userId = signUpResponse.body.id;
            createdUserIds.push(userId, admin.userId);

            const banUserData = TestData.getBanUserData({ userId, ban: true, jwt: admin.token });
            const banResult = await BanUserRoute.changeUserBan(banUserData);
            expect(banResult.status).toBe(200);

            const signInResponse = await LoginRoute.postSession({
                body: {
                    username: user.body.username,
                    password: user.body.password,
                },
            });

            expect(signInResponse.status).toBe(200);
            expect(signInResponse.body.errors).toBe("User is banned, you can't get a new session");
        });

        it.todo('should remove expired token and return a new one');
    });

    afterAll(async () => {
        for (const userId of createdUserIds) {
            await User.destroy({
                where: {
                    id: userId,
                },
            });
        }
    });
});
