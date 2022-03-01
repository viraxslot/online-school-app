import { isNil, omit } from 'lodash';
import { Role, User } from '../../../db/models';
import { LoginRoles } from '../login/login.interfaces';
import { TeacherListResponse } from './user.interfaces';

/**
 * @swagger
 * /api/v1/user/teachers:
 *   get:
 *     tags:
 *       - User
 *     summary: Allow to get list of teachers
 *     description: Allow to get list of teachers
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherListResponse'
 *         description: Return list of teachers
 */
export async function handleGetTeachers(req: any, res: TeacherListResponse) {
    const role = LoginRoles.Teacher;
    const roleInstance: any = await Role.findOne({
        raw: true,
        where: {
            role,
        },
    });

    if (isNil(roleInstance)) {
        return res.status(404).json({ errors: 'Unable to find teacher role' });
    }

    const roleId = roleInstance?.id;
    const teachers: any = await User.findAll({
        raw: true,
        where: {
            role: roleId,
        },
    });

    teachers.forEach((el: any) => {
        delete el['password'];
        delete el['createdAt'];
        delete el['updatedAt'];
    });

    res.json(teachers);
}
