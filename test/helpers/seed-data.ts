import { UserRoles } from '../../src/api/v1/user/user.interfaces';
import { User } from '../../src/db/models';
import { TestData } from './test-data';

export class SeedData {
    /**
     * Create teacher and student records
     * @returns
     */
    static createTwoUsers = async (): Promise<{ studentId: number; teacherId: number }> => {
        const student = TestData.getUserData({ role: UserRoles.Student });
        const teacher = TestData.getUserData({ role: UserRoles.Teacher });

        let createdStudent: any;
        let createdTeacher: any;
        try {
            createdStudent = await User.create(student.body);
            createdTeacher = await User.create(teacher.body);
        } catch (err) {
            console.log('Unable to create user data: ' + err);
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
