import { Request } from 'express';
import { HealthResponse } from './health.interfaces';
import * as packageJson from '../../../../package.json';

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     tags:
 *       - Technical
 *     summary: Return server status
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
export function handleGetHealth(req: Request, res: HealthResponse) {
    const now = new Date();

    return res.status(200).json({
        result: {
            status: 'OK',
            currentDate: now.toISOString(),
            version: packageJson?.version ?? 'unknown',
        },
    });
}
