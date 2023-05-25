import { DbHelper } from '../../../src/rest-api/v1/db-helper';
import { SchemasV1 } from '../../../src/rest-api/v1/schemas';
import { User, UserRoles } from '../../../src/db/models';
import { ApiChangeUserRequest } from '../../rest-api/routes/user/user.interfaces';
import { UserRoute } from '../../rest-api/routes/user/user.route';
import { ApiHelper } from '../../helpers/api-helper';
import { SchemaValidator } from '../../helpers/schema-validator';
import { SeedData } from '../../helpers/seed-data';
import { TestData } from '../../helpers/test-data';

describe('REST API: user route suite', function () {
    const createdUserIds: number[] = [];

    let studentToken: string;
    let teacherToken: string;
    let adminToken: string;
    beforeAll(async () => {
        const student = await ApiHelper.createStudent();
        const teacher = await ApiHelper.createTeacher();
        const admin = await ApiHelper.createAdmin();
        studentToken = student.token;
        teacherToken = teacher.token;
        adminToken = admin.token;

        createdUserIds.push(student.userId, teacher.userId, admin.userId);
    });

    describe('GET, list of teachers:', function () {
        // TODO: sequelize mock needed
        it.todo('should return 404 if no teacher role found');

        it('should return 401 error if token is not passed', async () => {
            const result = await UserRoute.getTeachersList();
            expect(result.status).toBe(401);
            expect(result.body.errors).toBe('Unauthorized');
        });

        it('should return list of teachers', async () => {
            const { studentId, teacherId } = await SeedData.createTwoUsers();
            createdUserIds.push(studentId, teacherId);

            const result = await UserRoute.getTeachersList(studentToken);
            expect(result.status).toBe(200);

            const foundStudent = result.body.find((el) => el.id === studentId);
            expect(foundStudent).toBeNull;

            const foundTeacher = result.body.find((el) => el.id === teacherId);
            expect(foundTeacher).not.toBeNull;

            SchemaValidator.check(result.body, SchemasV1.UserListResponse);
            result.body.forEach((el: any) => {
                expect(el.role).toBe(2);
                expect(el.password).toBeUndefined();
                expect(el.createdAt).toBeUndefined();
                expect(el.updatedAt).toBeUndefined();
            });
        });
    });

    describe('POST, create user', function () {
        const usernameValidationTestCases = [
            {
                title: 'has non-string type',
                username: 123,
                expectedError: 'Parameter should be a string',
            },
            {
                title: 'less than minimum length',
                username: '1'.repeat(SchemasV1.UserRequest.properties.username.minLength - 1),
                expectedError: 'Minimum username length is: 3',
            },
            {
                title: 'greater than maximum length',
                username: '1'.repeat(SchemasV1.UserRequest.properties.username.maxLength + 1),
                expectedError: 'Maximum username length is: 255',
            },
        ];

        usernameValidationTestCases.forEach((test) => {
            it(`should return error if username ${test.title}`, async () => {
                const user = TestData.getUserData();
                user.body.username = test.username as string;

                const result = await UserRoute.postUser(user);
                expect(result.status).toBe(400);
                expect(result.body.errors.length).toBe(1);

                const error = result.body.errors[0];
                expect(error.location).toBe('body');
                expect(error.param).toBe('username');
                expect(error.msg).toBe(test.expectedError);
            });
        });

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
                user.body.password = test.password;

                const result = await UserRoute.postUser(user);
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

            const result = await UserRoute.postUser(user);
            expect(result.status).toBe(400);
            const error = (result.body as any).errors[0];
            expect(error.param).toBe('role');
            expect(error.msg).toBe('Wrong role, please send the right role: student,teacher,admin');
        });

        it('should return validation error if email has wrong format', async () => {
            const user = TestData.getUserData();
            user.body.email = 'test@';

            const result = await UserRoute.postUser(user);
            expect(result.status).toBe(400);

            const error = (result.body as any).errors[0];
            expect(error.param).toBe('email');
            expect(error.msg).toBe('Invalid value');
        });

        it('should return validation error if user already exists', async () => {
            const user = TestData.getUserData();
            const createdUser = await User.create({
                username: user.body.username,
                email: user.body.email,
                password: user.body.password,
                role: user.body.role,
            });

            const id = createdUser.getDataValue('id') as number;
            createdUserIds.push(id);

            const result = await UserRoute.postUser(user);
            expect(result.status).toBe(400);
            expect(result.body.errors).toBe('User with such credentials already exist');
        });

        const createTestCases = [
            { title: 'with student role', role: UserRoles.Student },
            { title: 'with teacher role', role: UserRoles.Teacher },
        ];

        createTestCases.forEach((test) => {
            it(`should be possible to create user ${test.title}`, async () => {
                const user = TestData.getUserData({
                    role: test.role,
                });

                const result = await UserRoute.postUser(user);
                const id = result.body.id;
                createdUserIds.push(id);

                expect(result.status).toBe(200);
                SchemaValidator.check(result.body, SchemasV1.UserResponse);

                expect(result.body.username).toBe(user.body.username);
                expect(result.body.email).toBe(user.body.email);
                expect(result.body.password).not.toBe(user.body.password);
                expect(result.body.firstName).toBe(user.body.firstName);
                expect(result.body.lastName).toBe(user.body.lastName);

                const roleId = await DbHelper.getRoleId(test.role);
                expect(result.body.role).toBe(roleId);
            });
        });

        it('should return 403 error when trying to create admin user with student role', async () => {
            const student = await ApiHelper.createStudent();
            createdUserIds.push(student.userId);

            const user = TestData.getUserData({
                role: UserRoles.Admin,
            });

            const result = await UserRoute.postUser(user, student.token);
            expect(result.status).toBe(403);
            expect(result.body.errors).toBe('This action is forbidden for role student');
        });

        it('should return 403 error when trying to create admin user with teacher role', async () => {
            const teacher = await ApiHelper.createTeacher();
            createdUserIds.push(teacher.userId);

            const user = TestData.getUserData({
                role: UserRoles.Admin,
            });

            const result = await UserRoute.postUser(user, teacher.token);
            expect(result.status).toBe(403);
            expect(result.body.errors).toBe('This action is forbidden for role teacher');
        });

        it('should be possible to create admin user with admin token', async () => {
            const admin = await ApiHelper.createAdmin();
            createdUserIds.push(admin.userId);

            const user = TestData.getUserData({
                role: UserRoles.Admin,
            });

            const result = await UserRoute.postUser(user, admin.token);
            expect(result.status).toBe(200);
            const id = result?.body?.id;
            createdUserIds.push(id);
        });
    });

    describe('PATCH, change teacher data', function () {
        it('should return 401 error if token is not passed', async () => {
            const result = await UserRoute.patchTeacher({ body: { id: 1 } as any });
            expect(result.status).toBe(401);
            expect(result.body.errors).toBe('Unauthorized');
        });

        it('should return validation error if no id passed', async () => {
            const result = await UserRoute.patchTeacher();

            expect(result.status).toBe(400);
            const error = result.body.errors.find(
                (el: any) => el.msg === 'Unable to parse teacher id, please add id parameter'
            );
            expect(error).not.toBeNull();
        });

        it('should return validation error if id is not a number', async () => {
            const result = await UserRoute.patchTeacher({ body: { id: 'test' } as any });

            expect(result.status).toBe(400);
            const error = result.body.errors.find((el: any) => el.msg === 'Parameter should be numeric');
            expect(error).not.toBeNull();
        });

        it('should not be possible to change other teacher data', async () => {
            const user = TestData.getUserData({ role: UserRoles.Teacher });
            const createResponse = await UserRoute.postUser(user);
            expect(createResponse.status).toBe(200);

            const userId = createResponse.body.id;
            createdUserIds.push(userId);

            const changeUserData: ApiChangeUserRequest = {
                body: {
                    id: userId,
                    firstName: 'test',
                },
            };
            const changeResponse = await UserRoute.patchTeacher(changeUserData, teacherToken);
            expect(changeResponse.status).toBe(403);
            expect(changeResponse.body.errors).toBe('This action is forbidden for this user');
        });

        it('should return 404 error if teacher record is not found', async () => {
            const result = await UserRoute.patchTeacher({ body: { id: -1 } }, adminToken);

            expect(result.status).toBe(404);
            expect(result.body.errors).toBe('Unable to find teacher record');
        });

        it('should not be possible to change teacher password or role', async () => {
            const { studentId, teacherId } = await SeedData.createTwoUsers();
            createdUserIds.push(studentId, teacherId);

            const userBeforeChange = await User.findOne({
                where: {
                    id: teacherId,
                },
            });

            const newUser = TestData.getUserData({ role: UserRoles.Student });
            // intentionally added "password" parameter
            const result = await UserRoute.patchTeacher(
                {
                    body: { id: teacherId, email: newUser.body.email, password: newUser.body.password } as any,
                },
                adminToken
            );
            expect(result.status).toBe(200);

            const userAfterChange = await User.findOne({
                where: {
                    id: teacherId,
                },
            });

            expect(userBeforeChange?.getDataValue('email')).not.toBe(userAfterChange?.getDataValue('email'));
            expect(userBeforeChange?.getDataValue('password')).toBe(userAfterChange?.getDataValue('password'));
            expect(userAfterChange?.getDataValue('email')).toBe(newUser.body.email);
            expect(userAfterChange?.getDataValue('role')).toBe(userBeforeChange?.getDataValue('role'));
        });

        it('should be possible to change teacher data', async () => {
            const { studentId, teacherId } = await SeedData.createTwoUsers();
            createdUserIds.push(studentId, teacherId);
            const userBeforeChange = await User.findOne({
                where: {
                    id: teacherId,
                },
            });

            const newUser = TestData.getUserData();
            const result = await UserRoute.patchTeacher(
                {
                    body: { id: teacherId, ...newUser.body } as any,
                },
                adminToken
            );

            expect(result.status).toBe(200);
            SchemaValidator.check(result.body, SchemasV1.UserResponse);

            expect(result.body.id).toBe(teacherId);
            expect(result.body.username).toBe(newUser.body.username);
            expect(result.body.email).toBe(newUser.body.email);
            expect(result.body.firstName).toBe(newUser.body.firstName);
            expect(result.body.lastName).toBe(newUser.body.lastName);
            expect(result.body.role).toBe(userBeforeChange?.getDataValue('role'));
        });

        const uniqueFieldsTests = [{ field: 'username' }, { field: 'email' }];

        uniqueFieldsTests.forEach((test) => {
            it(`should not be possible to change user data with existent ${test.field}`, async () => {
                const studentData = TestData.getUserData({ role: UserRoles.Student });
                const { studentId, teacherId } = await SeedData.createTwoUsers({ studentData: studentData });
                createdUserIds.push(studentId, teacherId);

                const result = await UserRoute.patchTeacher(
                    {
                        body: { id: teacherId, [test.field]: (studentData.body as any)[test.field] },
                    },
                    adminToken
                );

                expect(result.status).toBe(400);
                expect(result.body.errors).toBe('Unable to update user: login and email fields should be unique');
            });
        });

        // TODO: sequelize mock needed
        it.todo('should return 404 error if teacher role is not found');
    });

    describe('DELETE, remove teacher data:', function () {
        it('should return 401 error if token is not passed', async () => {
            const result = await UserRoute.deleteTeacher(1);
            expect(result.status).toBe(401);
            expect(result.body.errors).toBe('Unauthorized');
        });

        it('should return validation error if no teacher id passed', async () => {
            const result = await UserRoute.deleteTeacher('1a' as any);

            expect(result.status).toBe(400);
            const errorMessage = result.body.errors.find(
                (el: any) => el.msg === 'Unable to parse teacher id, please add id parameter'
            );
            expect(errorMessage).not.toBeNull();
        });

        it('should return an error if no teacher record found', async () => {
            const result = await UserRoute.deleteTeacher(-1, adminToken);

            expect(result.status).toBe(404);
            expect(result.body.errors).toBe('Unable to find teacher record');
        });

        it('should not be possible to remove other teacher data', async () => {
            const user = TestData.getUserData({ role: UserRoles.Teacher });
            const createResponse = await UserRoute.postUser(user);
            expect(createResponse.status).toBe(200);

            const userId = createResponse.body.id;
            createdUserIds.push(userId);

            const changeResponse = await UserRoute.deleteTeacher(userId, teacherToken);
            expect(changeResponse.status).toBe(403);
            expect(changeResponse.body.errors).toBe('This action is forbidden for this user');
        });

        it('should return an error if trying to remove student record', async () => {
            const { studentId, teacherId } = await SeedData.createTwoUsers();
            createdUserIds.push(studentId, teacherId);

            const result = await UserRoute.deleteTeacher(studentId, adminToken);
            expect(result.status).toBe(404);
            expect(result.body.errors).toBe('Unable to find teacher record');

            const userRecord = await User.findOne({
                raw: true,
                where: {
                    id: studentId,
                },
            });

            expect(userRecord).not.toBeNull();
        });

        it('should be possible to remove teacher record', async () => {
            const { studentId, teacherId } = await SeedData.createTwoUsers();
            createdUserIds.push(studentId, teacherId);

            const result = await UserRoute.deleteTeacher(teacherId, adminToken);
            expect(result.status).toBe(200);

            SchemaValidator.check(result.body, SchemasV1.DefaultResponse);
            expect(result.body.result).toBe('Success: record was removed.');

            const userRecord = await User.findOne({
                raw: true,
                where: {
                    id: teacherId,
                },
            });

            expect(userRecord).toBeNull();
        });
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
