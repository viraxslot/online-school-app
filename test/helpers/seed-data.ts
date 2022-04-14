import { User, UserRoles } from '../../src/db/models';
import { logger } from '../../src/helpers/winston-logger';
import { ApiUserRequest } from '../api/routes/user/user.interfaces';
import { TestData } from './test-data';

export class SeedData {
    /**
     * Create teacher and student records
     * @returns
     */
    static createTwoUsers = async (options?: {
        studentData?: ApiUserRequest;
        teacherData?: ApiUserRequest;
    }): Promise<{ studentId: number; teacherId: number; }> => {
        const student = options?.studentData ?? await TestData.getUserData({ role: UserRoles.Student });
        const teacher = options?.teacherData ?? await TestData.getUserData({ role: UserRoles.Teacher });

        let createdStudent: any;
        let createdTeacher: any;
        try {
            createdStudent = await User.create(student.body);
            createdTeacher = await User.create(teacher.body);
        } catch (err) {
            logger.error('Unable to create user data: ' + err);
        }

        const studentId = createdStudent.id;
        const teacherId = createdTeacher.id;
        expect(typeof studentId).toBe('number');
        expect(typeof teacherId).toBe('number');

        expect(studentId).toBeGreaterThan(0);
        expect(teacherId).toBeGreaterThan(0);

        return {
            studentId,
            teacherId,
        };
    };
}
