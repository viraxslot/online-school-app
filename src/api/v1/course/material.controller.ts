import { Request, Response } from 'express';
import { MaterialRequest, MaterialResponse } from './material.interfaces';
// import { MaterialRequest, MaterialResponse } from './material.interfaces';

/**
 * @swagger
 * /api/v1/materials/{courseId}:
 *   get:
 *     tags:
 *       - Material
 *     summary: Allow to get list of materials by course id
 *     description: "Allow to get list of materials by course id. Available for roles: ALL"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Return list of materials
 */
export async function handleGetMaterialsList(req: Request, res: Response) {
    res.status(501).json({});
}

/**
 * @swagger
 * /api/v1/material/{id}:
 *   get:
 *     tags:
 *       - Material
 *     summary: Allow to get material by id
 *     description: "Allow to get material by id. Available for roles: ALL"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Return requested material information
 */
export async function handleGetMaterialById(req: Request, res: Response) {
    res.status(501).json({});
}

/**
 * @swagger
 * /api/v1/material:
 *   post:
 *     tags:
 *       - Material
 *     summary: Allow to add material
 *     description: "Allow to add material. Available for roles: teacher, admin"
 *     requestBody:
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/DefaultRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Return created material information
 */
export async function handlePostMaterial(req: MaterialRequest, res: MaterialResponse) {
    const { courseId } = req.query;
    console.log(courseId);

    res.status(501).json({});
}

/**
 * @swagger
 * /api/v1/material:
 *   put:
 *     tags:
 *       - Material
 *     summary: Allow to change material
 *     description: "Allow to change material. Available for roles: teacher, admin"
 *     requestBody:
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/DefaultRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Return changed material information
 */
export async function handlePutMaterial(req: Request, res: Response) {
    res.status(501).json({});
}

/**
 * @swagger
 * /api/v1/material/{id}:
 *   delete:
 *     tags:
 *       - Material
 *     summary: Allow to remove material by id
 *     description: "Allow to remove material by id. Available for roles: teacher, admin"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Return operation result or an error
 */
export async function handleDeleteMaterial(req: Request, res: Response) {
    res.status(501).json({});
}
