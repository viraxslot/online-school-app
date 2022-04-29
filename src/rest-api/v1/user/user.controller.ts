import { Request } from 'express';
import { isNil, omit } from 'lodash';
import { Op } from 'sequelize';
import { User, UserRoles } from '../../../db/models';
import { logger } from '../../../helpers/winston-logger';
import { ApiMessages } from '../../shared/api-messages';
import { DefaultResponse } from '../../shared/interfaces';
import { DbHelper } from '../db-helper';
import { Helper } from '../helper';
import { ChangeUserRequest, UserListResponse, UserRequest, UserResponse } from './user.interfaces';

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     tags:
 *       - User
 *     summary: 'Allow to register new user. User types: student, teacher'
 *     description: 'Allow to register new user. User types: student, teacher'
 *     requestBody:
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
export async function handlePostUser(req: UserRequest, res: UserResponse) {
    const body = req.body;

    if (body.role === UserRoles.Admin) {
        const { token, payload } = Helper.getJwtAndPayload(req);
        if (isNil(token)) {
            return res.status(401).json({ errors: ApiMessages.common.unauthorized });
        }

        try {
            if (!payload) {
                return res.status(401).json({ errors: ApiMessages.common.unauthorized });
            }

            const role = await DbHelper.getRoleName(payload?.roleId);
            const adminRoleId = await DbHelper.getRoleId(UserRoles.Admin);
            if (payload?.roleId !== adminRoleId) {
                return res.status(403).json({ errors: ApiMessages.common.forbiddenForRole(role) });
            }
        } catch (err) {
            logger.error(JSON.stringify(err));
            return res.status(500).json({ errors: ApiMessages.common.unexpectedError + `: ${err}` });
        }
    }

    const oldUser = await User.findOne({
        where: {
            [Op.or]: [{ login: body?.login }, { email: body?.email }],
        },
    });

    if (!isNil(oldUser)) {
        return res.status(400).json({ errors: ApiMessages.login.userExist });
    }

    try {
        const newUser = await User.create({
            login: body.login,
            email: body.email,
            firstName: body?.firstName ?? null,
            lastName: body?.lastName ?? null,
            password: body.password,
            role: body.role,
        });

        return res.json(omit(newUser.toJSON(), 'password') as any);
    } catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.login.unableCreateUser + err });
    }
}

/**
 * @swagger
 * /api/v1/teachers:
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
export async function handleGetTeachers(req: Request, res: UserListResponse) {
    const teacherRoleId = await DbHelper.getRoleId(UserRoles.Teacher);

    if (isNil(teacherRoleId)) {
        return res.status(404).json({ errors: ApiMessages.user.noTeacherRole });
    }

    const teachers: any = await User.findAll({
        raw: true,
        where: {
            role: teacherRoleId,
        },
    });

    teachers.forEach((el: any) => {
        Helper.removeRedundantFields(el, ['password', 'createdAt', 'updatedAt']);
    });

    res.json(teachers);
}

/**
 * @swagger
 * /api/v1/teachers:
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
    const body = req.body;
    const teacherId = body.id;
    const { payload } = Helper.getJwtAndPayload(req);

    const teacherRoleId = await DbHelper.getRoleId(UserRoles.Teacher);
    if (payload.roleId === teacherRoleId && teacherId !== payload.userId) {
        return res.status(403).json({ errors: ApiMessages.common.forbiddenForUser });
    }

    try {
        if (isNil(teacherRoleId)) {
            return res.status(404).json({ errors: ApiMessages.user.noTeacherRole });
        }

        const teacher = await searchForUserRecord(teacherId, teacherRoleId);
        if (isNil(teacher)) {
            return res.status(404).json({ errors: ApiMessages.user.noTeacher });
        }

        const valuesToChange = omit(body, ['id', 'password', 'role']);
        await teacher.update(valuesToChange);

        const result: any = teacher.toJSON();
        Helper.removeRedundantFields(result, ['password', 'createdAt', 'updatedAt']);
        return res.status(200).json(result);
    } catch (err: any) {
        if (err.toString().includes('SequelizeUniqueConstraintError')) {
            return res.status(400).json({ errors: ApiMessages.user.unableUpdateUser + ApiMessages.user.uniqueFields });
        }
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.user.unableUpdateUser + err });
    }
}

/**
 * @swagger
 * /api/v1/teachers/{userId}:
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
 *         description: Return removing result or an error
 */
export async function handleDeleteTeacher(req: Request, res: DefaultResponse) {
    const teacherId = parseInt(req.params?.id);
    const { payload } = Helper.getJwtAndPayload(req);

    const teacherRoleId = await DbHelper.getRoleId(UserRoles.Teacher);
    if (payload.roleId === teacherRoleId && teacherId !== payload.userId) {
        return res.status(403).json({ errors: ApiMessages.common.forbiddenForUser });
    }

    try {
        if (isNil(teacherRoleId)) {
            return res.status(404).json({ errors: ApiMessages.user.noTeacherRole });
        }

        const teacher = await searchForUserRecord(teacherId, teacherRoleId);
        if (isNil(teacher)) {
            return res.status(404).json({ errors: ApiMessages.user.noTeacher });
        }

        await User.destroy({
            where: {
                id: teacherId,
            },
        });
    } catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.user.unableRemoveUser + err });
    }

    return res.status(200).json({ result: ApiMessages.common.removeSuccess });
}

async function searchForUserRecord(userId: number, roleId: number) {
    return await User.findOne({
        where: {
            [Op.and]: [{ id: userId }, { role: roleId }],
        },
    });
}
