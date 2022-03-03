import { Request } from 'express';
import { DefaultResponse } from '../../../shared/interfaces';
import { ApiMessages } from '../../../shared/api-messages';

/**
 * @swagger
 * /api/v1/auth/basic:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Basic authentication endpoint
 *     description: Allow to authenticate with credentials stored in the database table "basicAuth"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Returns result message if authentication is passed and error message otherwise
 */
export function handleBasicAuth(req: Request, res: DefaultResponse) {
    res.json({ result: ApiMessages.auth.authPassed });
}
