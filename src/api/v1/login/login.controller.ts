import * as bcrypt from 'bcryptjs';
import { isNil, omit } from 'lodash';
import { Op } from 'sequelize';
import { Role, User } from '../../../db/models';
import { validateRequest } from '../../../helpers/validate-request';
import { ApiErrors } from '../../shared/errors';
import { SignUpRequest, SignUpResponse } from './login.interfaces';

/**
 * @swagger
 * /api/v1/login/signup:
 *   post:
 *     tags:
 *       - Login
 *     summary: 'Allow to register a user. User types: student, teacher'
 *     description: 'Allow to register a user. User types: student, teacher'
 *     requestBody:
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/SignUpResponse'
 */
export async function handleSignUp(req: SignUpRequest, res: SignUpResponse) {
    if (!validateRequest(req, res)) return;
    const body = req.body;

    const role = await Role.findOne({
        where: {
            role: body.role,
        },
    });

    if (isNil(role)) {
        res.status(404).json({ errors: ApiErrors.common.noSuchRole });
        return;
    }

    const oldUser = await User.findOne({
        where: {
            [Op.and]: {
                [Op.or]: [{ nickname: body?.nickname }, { email: body?.email }],
                roleId: role.toJSON().id,
            },
        },
    });

    if (!isNil(oldUser)) {
        res.status(400).json({ errors: ApiErrors.login.userExist });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    const newUser = await User.create({
        nickname: body.nickname,
        email: body.email,
        firstName: body?.firstName ?? null,
        lastName: body?.lastName ?? null,
        passwordHash,
        roleId: role.toJSON().id!,
    });

    res.json(omit(newUser.toJSON(), 'passwordHash') as any);
}
