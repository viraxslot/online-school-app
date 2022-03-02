import { isNil, omit } from 'lodash';
import { Op } from 'sequelize';
import { User } from '../../../db/models';
import { validateRequest } from '../../../helpers/validate-request';
import { ApiErrors } from '../../shared/errors';
import { UserRequest, UserResponse } from '../user/user.interfaces';

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
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
export async function handleSignUp(req: UserRequest, res: UserResponse) {
    if (!validateRequest(req, res)) return;
    const body = req.body;

    const oldUser = await User.findOne({
        where: {
            [Op.or]: [{ nickname: body?.nickname }, { email: body?.email }],
        },
    });

    if (!isNil(oldUser)) {
        res.status(400).json({ errors: ApiErrors.login.userExist });
        return;
    }

    let newUser;
    try {
        newUser = await User.create({
            nickname: body.nickname,
            email: body.email,
            firstName: body?.firstName ?? null,
            lastName: body?.lastName ?? null,
            password: body.password,
            role: body.role,
        });
    } catch (err) {
        res.status(500).json({ errors: ApiErrors.login.unableToCreateUser + err });
    }

    if (newUser) {
        res.json(omit(newUser.toJSON(), 'password') as any);
    }
}
