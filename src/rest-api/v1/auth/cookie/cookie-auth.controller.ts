import { Request } from 'express';
import { DefaultResponse } from '../../../shared/interfaces';
import { ApiMessages } from '../../../shared/api-messages';

/**
 * @swagger
 * /api/v1/cookie:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Cookie authentication endpoint
 *     description: Allow to authenticate with cookie
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Returns result message if authentication is passed and error message otherwise
 */
export function handleCookieAuth(req: Request, res: DefaultResponse) {
    res.json({ result: ApiMessages.auth.authPassed });
}
