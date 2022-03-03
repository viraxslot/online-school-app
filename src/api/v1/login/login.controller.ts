import { validationResult } from 'express-validator';
import { isNil, omit } from 'lodash';
import { Op } from 'sequelize';
import { User } from '../../../db/models';
import { ApiMessages } from '../../shared/api-messages';
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;

    const oldUser = await User.findOne({
        where: {
            [Op.or]: [{ login: body?.login }, { email: body?.email }],
        },
    });

    if (!isNil(oldUser)) {
        return res.status(400).json({ errors: ApiMessages.login.userExist });
    }

    let newUser;
    try {
        newUser = await User.create({
            login: body.login,
            email: body.email,
            firstName: body?.firstName ?? null,
            lastName: body?.lastName ?? null,
            password: body.password,
            role: body.role,
        });
    } catch (err) {
        return res.status(500).json({ errors: ApiMessages.login.unableToCreateUser + err });
    }

    if (newUser) {
        res.json(omit(newUser.toJSON(), 'password') as any);
    }
}
