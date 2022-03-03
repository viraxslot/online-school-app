import { Request } from 'express';
import { DefaultResponse } from '../../../shared/interfaces';
import { ApiMessages } from '../../../shared/api-messages';

/**
 * @swagger
 * /api/v1/auth/api-key:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Api key authentication endpoint
 *     description: Allow to authenticate with api key stored in the database table "apiKeys"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Returns result message if authentication is passed and error message otherwise
 */
export function handleApiKeyAuth(req: Request, res: DefaultResponse) {
    res.json({ result: ApiMessages.auth.authPassed });
}
