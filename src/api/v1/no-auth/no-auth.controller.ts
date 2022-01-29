import { DefaultResponse } from "../../shared/interfaces";

/**
 * @swagger
 * /api/v1/auth/no-auth:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Test endpoint with no authorization.
 *     description: Test endpoint with no authorization.
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Returns "No authentication needed" message
 */
export function handleNoAuth(req: any, res: DefaultResponse) {
    res.json({ result: 'No authentication needed' });
}
