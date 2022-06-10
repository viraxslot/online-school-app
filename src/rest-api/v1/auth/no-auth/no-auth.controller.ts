import { Request } from 'express';
import { DefaultResponse } from '../../../shared/interfaces';
import { ApiMessages } from '../../../shared/api-messages';

/**
 * @swagger
 * /api/v1/no-auth:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Test endpoint with no authentication.
 *     description: Test endpoint with no authentication.
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Returns "No authentication needed" message
 */
export function handleNoAuth(req: Request, res: DefaultResponse) {
    res.json({ result: ApiMessages.auth.noAuthNeeded });
}
