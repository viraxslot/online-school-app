import { Request } from 'express';
import { DefaultResponse } from '../../../shared/interfaces';
import { ApiMessages } from '../../../shared/api-messages';

/**
 * @swagger
 * /api/v1/jwt:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Jwt authentication endpoint
 *     description: Allow to authenticate with jwt
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Returns result message if authentication is passed and error message otherwise
 */
export function handleJwtAuth(req: Request, res: DefaultResponse) {
    res.json({ result: ApiMessages.auth.authPassed });
}
