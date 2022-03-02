import { isNil, omit, pick } from 'lodash';
import { Op } from 'sequelize';
import { Role, User } from '../../../db/models';
import { validateRequest } from '../../../helpers/validate-request';
import { ApiErrors } from '../../shared/errors';
import { DefaultResponse } from '../../shared/interfaces';
import { Helper } from '../helper';
import { ChangeUserRequest, UserResponse, UserRoles } from './user.interfaces';

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
 *               $ref: '#/components/schemas/UserListResponse'
 *         description: Return list of teachers
 */
export async function handleGetTeachers(req: any, res: UserResponse) {
    const role = UserRoles.Teacher;
    const roleInstance: any = await Role.findOne({
        raw: true,
        where: {
            role,
        },
    });

    if (isNil(roleInstance)) {
        return res.status(404).json({ errors: ApiErrors.user.noTeacherRole });
    }

    const roleId = roleInstance?.id;
    const teachers: any = await User.findAll({
        raw: true,
        where: {
            role: roleId,
        },
    });

    teachers.forEach((el: any) => {
        Helper.removeRedundantFields(el, ['password', 'createdAt', 'updatedAt']);
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
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeUserRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *         description: Return changed information about the teacher
 */
export async function handlePutTeacher(req: ChangeUserRequest, res: UserResponse) {
    if (!validateRequest(req, res)) return;
    const body = req.body;
    const teacherId = body.id;

    const teacherRole: any = await Role.findOne({
        where: {
            role: UserRoles.Teacher,
        },
    });

    if (isNil(teacherRole)) {
        return res.status(404).json({ errors: ApiErrors.user.noTeacherRole });
    }

    const teacher = await User.findOne({
        where: {
            [Op.and]: [{ id: teacherId }, { role: teacherRole.id }],
        },
    });

    if (isNil(teacher)) {
        return res.status(404).json({ errors: ApiErrors.user.noTeacher });
    }

    const valuesToChange = omit(body, ['id', 'password', 'role']);
    await teacher.update(valuesToChange);

    const result: any = teacher.toJSON();
    Helper.removeRedundantFields(result, ['password', 'createdAt', 'updatedAt']);
    res.status(200).json(result);
}

/**
 * @swagger
 * /api/v1/user/teacher/{id}:
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
