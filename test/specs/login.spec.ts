import { SchemasV1 } from '../../src/api/v1/schemas';
import { User, UserRoles } from '../../src/db/models';
import { LoginRoute } from '../api/routes/login/login.route';
import { SchemaValidator } from '../helpers/schema-validator';
import { TestData } from '../helpers/test-data';

describe('API: login route suite', function () {
    const createdUsers: number[] = [];

    describe('POST, signup', function () {
        const passwordValidationTestCases = [
            {
                title: 'less than minimum length',
                password: '1'.repeat(SchemasV1.UserRequest.properties.password.minLength - 1),
                expectedError: 'Minimum password length is: 8',
            },
            {
                title: 'greater than maximum length',
                password: '1'.repeat(SchemasV1.UserRequest.properties.password.maxLength + 1),
                expectedError: 'Maximum password length is: 20',
            },
        ];

        passwordValidationTestCases.forEach((test) => {
            it(`should return error if password ${test.title}`, async () => {
                const user = TestData.getUserData();
                user.body.password = test.password

                const result = await LoginRoute.postSignUp(user);
                expect(result.status).toBe(400);
                expect(result.body.errors.length).toBe(1);

                const error = result.body.errors[0];
                expect(error.location).toBe('body');
                expect(error.param).toBe('password');
                expect(error.msg).toBe(test.expectedError);
            });
        });

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
                login: user.body.login,
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
                SchemaValidator.check(result.body, SchemasV1.UserResponse);

                expect(result.body.login).toBe(user.body.login);
                expect(result.body.email).toBe(user.body.email);
                expect(result.body.password).not.toBe(user.body.password);
                expect(result.body.firstName).toBe(user.body.firstName);
                expect(result.body.lastName).toBe(user.body.lastName);
                expect(result.body.role).toBe(test.expectedRoleId);
            });
        });
    });

    describe('POST, signin', function () {
        it('should return validation error if no username passed', async () => {
            const signInResponse = await LoginRoute.postSignIn({
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
            const signInResponse = await LoginRoute.postSignIn({
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
            const user = TestData.getUserData();
            const signInResponse = await LoginRoute.postSignIn({
                body: {
                    username: user.body.login,
                    password: user.body.password,
                },
            });

            expect(signInResponse.status).toBe(404);
            expect(signInResponse.body.errors).toBe('Unable to find user record');
        });

        it('should return validation error if wrong credentials passed', async () => {
            const user = TestData.getUserData();
            const signUpResponse = await LoginRoute.postSignUp(user);
            expect(signUpResponse.status).toBe(200);
            createdUsers.push(signUpResponse.body.id);

            const signInResponse = await LoginRoute.postSignIn({
                body: {
                    username: user.body.login,
                    password: user.body.password + '1',
                },
            });
            expect(signInResponse.status).toBe(400);
            expect(signInResponse.body.errors).toBe('Unable to authenticate user, wrong credentials');
        });

        it('should return created earlier token if it exists', async () => {
            const user = TestData.getUserData();
            const signUpResponse = await LoginRoute.postSignUp(user);
            expect(signUpResponse.status).toBe(200);
            createdUsers.push(signUpResponse.body.id);

            const signInResponse1 = await LoginRoute.postSignIn({
                body: {
                    username: user.body.login,
                    password: user.body.password,
                },
            });
            expect(signInResponse1.status).toBe(200);
            const token1 = signInResponse1.body.accessToken;

            const signInResponse2 = await LoginRoute.postSignIn({
                body: {
                    username: user.body.login,
                    password: user.body.password,
                },
            });
            expect(signInResponse2.status).toBe(200);
            const token2 = signInResponse2.body.accessToken;

            expect(token1).toBe(token2);
        });

        const positiveTestCases = [{ title: 'login' }, { title: 'email' }];
        positiveTestCases.forEach((test) => {
            it(`should return jwt token if credentials are correct (${test.title})`, async () => {
                const user = TestData.getUserData();
                const signUpResponse = await LoginRoute.postSignUp(user);
                expect(signUpResponse.status).toBe(200);
                createdUsers.push(signUpResponse.body.id);

                const signInResponse = await LoginRoute.postSignIn({
                    body: {
                        username: (user.body as any)[test.title],
                        password: user.body.password,
                    },
                });
                expect(signInResponse.status).toBe(200);
                expect(typeof signInResponse.body.accessToken).toBe('string');
                SchemaValidator.check(signInResponse.body, SchemasV1.SignInResponse);
            });
        });

        it.todo('should remove expired token and return a new one');
    });

    afterAll(async () => {
        for (const userId of createdUsers) {
            await User.destroy({
                where: {
                    id: userId,
                },
            });
        }
    });
});
