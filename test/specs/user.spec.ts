import { SchemasV1 } from '../../src/api/v1/schemas';
import { User, UserRoles } from '../../src/db/models';
import { UserRoute } from '../api/routes/user/user.route';
import { ApiHelper } from '../helpers/api-helper';
import { SchemaValidator } from '../helpers/schema-validator';
import { SeedData } from '../helpers/seed-data';
import { TestData } from '../helpers/test-data';

describe('API: user route suite', function () {
    const createdUserIds: number[] = [];

    let studentToken: string;
    let adminToken: string;
    beforeAll(async () => {
        const student = await ApiHelper.getStudentToken();
        const admin = await ApiHelper.getAdminToken();
        studentToken = student.token;
        adminToken = admin.token;

        createdUserIds.push(student.userId, admin.userId);
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

    describe('PUT, change teacher data:', function () {
        it('should return 401 error if token is not passed', async () => {
            const result = await UserRoute.putTeacher({ body: { id: 1 } as any });
            expect(result.status).toBe(401);
            expect(result.body.errors).toBe('Unauthorized');
        });

        it('should return validation error if no id passed', async () => {
            const result = await UserRoute.putTeacher();

            expect(result.status).toBe(400);
            const error = result.body.errors.find(
                (el: any) => el.msg === 'Unable to parse teacher id, please add id parameter'
            );
            expect(error).not.toBeNull();
        });

        it('should return validation error if id is not a number', async () => {
            const result = await UserRoute.putTeacher({ body: { id: 'test' } as any });

            expect(result.status).toBe(400);
            const error = result.body.errors.find((el: any) => el.msg === 'Parameter should be numeric');
            expect(error).not.toBeNull();
        });

        it('should return 404 error if teacher record is not found', async () => {
            const result = await UserRoute.putTeacher({ body: { id: -1 } }, adminToken);

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
            const result = await UserRoute.putTeacher(
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
            const result = await UserRoute.putTeacher(
                {
                    body: { id: teacherId, ...newUser.body } as any,
                },
                adminToken
            );

            expect(result.status).toBe(200);
            SchemaValidator.check(result.body, SchemasV1.UserResponse);

            expect(result.body.id).toBe(teacherId);
            expect(result.body.login).toBe(newUser.body.login);
            expect(result.body.email).toBe(newUser.body.email);
            expect(result.body.firstName).toBe(newUser.body.firstName);
            expect(result.body.lastName).toBe(newUser.body.lastName);
            expect(result.body.role).toBe(userBeforeChange?.getDataValue('role'));
        });

        const uniqueFieldsTests = [{ field: 'login' }, { field: 'email' }];

        uniqueFieldsTests.forEach((test) => {
            it(`should not be possible to change user data with existent ${test.field}`, async () => {
                const studentData = TestData.getUserData({ role: UserRoles.Student });
                const { studentId, teacherId } = await SeedData.createTwoUsers({ studentData: studentData });
                createdUserIds.push(studentId, teacherId);

                const result = await UserRoute.putTeacher(
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
