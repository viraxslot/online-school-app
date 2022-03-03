import { SchemasV1 } from '../../src/api/v1/schemas';
import { UserRoles } from '../../src/api/v1/user/user.interfaces';
import { User } from '../../src/db/models';
import { UserRoute } from '../api/routes/user/user.route';
import { SchemaValidator } from '../helpers/schema-validator';
import { SeedData } from '../helpers/seed-data';
import { TestData } from '../helpers/test-data';

describe('API: user route suite', function () {
    const createdUserIds: number[] = [];

    describe('GET, list of teachers:', function () {
        // TODO: sequelize mock needed
        it.todo('should return 404 if no teacher role found');

        it('should return list of teachers', async () => {
            const { studentId, teacherId } = await SeedData.createTwoUsers();
            createdUserIds.push(studentId, teacherId);
            
            const result = await UserRoute.getTeachersList();
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
            const error = result.body.errors.find((el: any) => el.msg === 'ID parameter should be numeric');
            expect(error).not.toBeNull();
        });

        it('should return 404 error if teacher record is not found', async () => {
            const result = await UserRoute.putTeacher({ body: { id: -1 } });

            expect(result.status).toBe(404);
            expect(result.body.errors).toBe('Unable to find teacher record');
        });

        it('should not be possible to change user password or role', async () => {
            const { studentId, teacherId } = await SeedData.createTwoUsers();
            createdUserIds.push(studentId, teacherId);

            const userBeforeChange = await User.findOne({
                where: {
                    id: teacherId,
                },
            });

            const newUser = TestData.getUserData({ role: UserRoles.Student });
            // intentionally added "password" parameter
            const result = await UserRoute.putTeacher({
                body: { id: teacherId, email: newUser.body.email, password: newUser.body.password } as any,
            });
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

        it('should be possible to change user data', async () => {
            const { studentId, teacherId } = await SeedData.createTwoUsers();
            createdUserIds.push(studentId, teacherId);
            const userBeforeChange = await User.findOne({
                where: {
                    id: teacherId,
                },
            });

            const newUser = TestData.getUserData();
            const result = await UserRoute.putTeacher({
                body: { id: teacherId, ...newUser.body } as any,
            });

            expect(result.status).toBe(200);
            SchemaValidator.check(result.body, SchemasV1.UserResponse);

            expect(result.body.id).toBe(teacherId);
            expect(result.body.nickname).toBe(newUser.body.nickname);
            expect(result.body.email).toBe(newUser.body.email);
            expect(result.body.firstName).toBe(newUser.body.firstName);
            expect(result.body.lastName).toBe(newUser.body.lastName);
            expect(result.body.role).toBe(userBeforeChange?.getDataValue('role'));
        });

        // TODO: sequelize mock needed
        it.todo('should return 404 error if teacher role is not found');
        it.todo('should not be possible to change user data with existent nickname');
        it.todo('should not be possible to change user data with existent email');
    });

    afterAll(async () => {
        for (let userId of createdUserIds) {
            await User.destroy({
                where: {
                    id: userId,
                },
            });
        }
    });
});
