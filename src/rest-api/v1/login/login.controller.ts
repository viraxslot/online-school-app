import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isNil } from 'lodash';
import { Op } from 'sequelize';
import config from '../../../../config/config';
import { BannedUser, JwtAuth, User } from '../../../db/models';
import { logger } from '../../../helpers/winston-logger';
import { ApiMessages } from '../../shared/api-messages';
import { SessionRequest, SessionResponse } from './login.interfaces';

/**
 * @swagger
 * /api/v1/session:
 *   post:
 *     tags:
 *       - Login
 *     summary: Allow to sign into the app.
 *     requestBody:
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/SignInResponse'
 *         description: return jwt token if credentials are correct
 */
export async function handlePostSession(req: SessionRequest, res: SessionResponse) {
    const { username, password } = req.body;

    let existentUser: any;
    let bannedUser: any;
    try {
        existentUser = await User.findOne({
            raw: true,
            where: {
                [Op.or]: [
                    {
                        login: username,
                    },
                    {
                        email: username,
                    },
                ],
            },
        });

        if (isNil(existentUser)) {
            return res.status(404).json({ errors: ApiMessages.user.noUser });
        }

        bannedUser = await BannedUser.findOne({
            raw: true,
            where: {
                userId: existentUser.id
            }
        });
    } catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.common.unexpectedError + `: ${err}` });
    }

    if (!isNil(bannedUser)) {
        return res.status(200).json({ errors: ApiMessages.login.userBanned });
    }

    const verifiedPassword = await bcrypt.compare(password, (existentUser as any).password);
    if (!verifiedPassword) {
        return res.status(400).json({ errors: ApiMessages.login.wrongCredentials });
    }

    let createdToken: any;
    try {
        createdToken = await JwtAuth.findOne({
            raw: true,
            where: {
                userId: existentUser.id,
            },
        });

        if (!isNil(createdToken)) {
            const valid = jwt.verify(createdToken.jwt, config.jwtSecret);
            if (valid) {
                return res.status(200).json({ accessToken: createdToken.jwt });
            }
        }
    } catch (err: any) {
        if (err.toString().includes('TokenExpiredError')) {
            await JwtAuth.destroy({
                where: {
                    id: createdToken.id,
                },
            });
        } else {
            logger.error({ errors: ApiMessages.common.unexpectedError + `: ${err}` });
        }
    }

    let token: string;
    try {
        token = jwt.sign({ userId: existentUser.id, roleId: existentUser.role }, config.jwtSecret, {
            expiresIn: config.jwtExpiresIn,
        });

        await JwtAuth.create({
            jwt: token,
            userId: existentUser?.id,
        });
    } catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.common.unexpectedError + `: ${err}` });
    }

    return res.status(200).json({ accessToken: token });
}
