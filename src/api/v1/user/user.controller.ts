import { isNil, omit } from 'lodash';
import { Role, User } from '../../../db/models';
import { DefaultResponse } from '../../shared/interfaces';
import { LoginRoles } from '../login/login.interfaces';
import { TeacherListResponse, TeacherResponse } from './user.interfaces';

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

/**
 * @swagger
 * /api/v1/user/teacher:
 *   put:
 *     tags:
 *       - User
 *     summary: Allow to change teacher data by id
 *     description: Allow to change teacher data by id
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherResponse'
 *         description: Return changed information about the teacher 
 */
export async function handlePutTeacher(req: any, res: TeacherResponse) {
    res.status(501).json({});
}

/**
 * @swagger
 * /api/v1/user/teacher:
 *   delete:
 *     tags:
 *       - User
 *     summary: Allow to remove teacher data by id
 *     description: Allow to remove teacher data by id
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Return information about removing result or an error
 */
export async function handleDeleteTeacher(req: any, res: DefaultResponse) {
    res.status(501).json({});
}
