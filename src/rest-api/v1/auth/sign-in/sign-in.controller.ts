import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DefaultResponse } from '../../../shared/interfaces';
import { ApiMessages } from '../../../shared/api-messages';
import { BasicAuth } from '../../../../db/models';
import * as bcrypt from 'bcryptjs';
import { CookieSession } from '../../../../db/models/cookie-session.model';
import { isNil } from 'lodash';
import appConfig from '../../../../../config/app-config';

/**
 * @swagger
 * /api/v1/sign-in:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authenticate with username/password and get a cookie
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Returns cookie for authenticated user
 */
export async function handleSignIn(req: Request, res: DefaultResponse) {
    const { username, password } = req.body;

    const foundUser = await BasicAuth.findOne({
        raw: true,
        where: {
            username,
        },
    });

    if (!foundUser) {
        return res.status(401).json({ result: ApiMessages.login.wrongCredentials });
    }

    if (foundUser) {
        const verified = await bcrypt.compare(password, (foundUser as any).password);
        if (!verified) {
            return res.status(401).json({ result: ApiMessages.common.unauthorized });
        }
    }

    const foundSession: any = await CookieSession.findOne({
        raw: true,
        where: {
            username,
        },
    });

    if (!isNil(foundSession)) {
        await CookieSession.destroy({
            where: {
                username,
            },
        });
    }

    const session = await createNewSession(username);
    return res
        .status(200)
        .cookie('token', session.token, { expires: new Date(session.expiresAt) })
        .json({ result: ApiMessages.auth.authPassed });
}

async function createNewSession(username: string): Promise<{ token: string; expiresAt: string }> {
    const now = new Date();
    const session = uuidv4();

    const expiresAt = new Date(+now + appConfig.cookieExpiresIn * 1000).toUTCString();
    await CookieSession.create({
        username,
        session,
        expiresAt,
    });

    return {
        token: session,
        expiresAt,
    };
}
