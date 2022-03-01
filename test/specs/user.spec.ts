import { LoginRoles } from '../../src/api/v1/login/login.interfaces';
import { User } from '../../src/db/models';
import { UserRoute } from '../api/routes/user/user.route';
import { TestData } from '../helpers/test-data';

describe('API: user route suite', function () {
    const createdUserIds: number[] = [];

    // TODO: sequelize mock needed
    it.todo('should return 404 if no teacher role found');

    it('should return list of teachers', async () => {
        const { studentId, teacherId } = await prepareData();
        const result = await UserRoute.getTeachersList();
        expect(result.status).toBe(200);

        const foundStudent = result.body.find((el) => el.id === studentId);
        expect(foundStudent).toBeNull;

        const foundTeacher = result.body.find((el) => el.id === teacherId);
        expect(foundTeacher).not.toBeNull;

        result.body.forEach((el: any) => {
            expect(el.role).toBe(2);
            expect(el.password).toBeUndefined();
            expect(el.createdAt).toBeUndefined();
            expect(el.updatedAt).toBeUndefined();
        });
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

    const prepareData = async (): Promise<{ studentId: number; teacherId: number }> => {
        const student = TestData.getUserData({ role: LoginRoles.Student });
        const teacher = TestData.getUserData({ role: LoginRoles.Teacher });

        const createdStudent: any = await User.create(student.body);
        const createdTeacher: any = await User.create(teacher.body);

        const studentId = createdStudent.id;
        const teacherId = createdTeacher.id;
        expect(typeof studentId).toBe('number');
        expect(typeof teacherId).toBe('number');

        expect(studentId).toBeGreaterThan(0);
        expect(teacherId).toBeGreaterThan(0);

        createdUserIds.push(studentId);
        createdUserIds.push(teacherId);

        return {
            studentId,
            teacherId,
        };
    };
});
