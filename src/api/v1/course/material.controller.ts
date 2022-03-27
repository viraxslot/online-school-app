import { Request, Response } from 'express';
import { isNil } from 'lodash';
import { CreatedCourses, Material } from '../../../db/models';
import { ApiMessages } from '../../shared/api-messages';
import { Helper } from '../helper';
import { GetMaterialRequest, MaterialRequest, MaterialResponse } from './material.interfaces';
// import { MaterialRequest, MaterialResponse } from './material.interfaces';

/**
 * @swagger
 * /api/v1/courses/{courseId}/materials:
 *   get:
 *     tags:
 *       - Course
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
 * /api/v1/courses/{courseId}/materials/{materialId}:
 *   get:
 *     tags:
 *       - Course
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
export async function handleGetMaterialById(req: GetMaterialRequest, res: MaterialResponse) {
    const { courseId, materialId } = req.params;

    try {
        const material: any = await Material.findOne({
            raw: true,
            where: {
                id: materialId,
                courseId: courseId,
            },
        });

        return res.json(material);
    } catch (err) {
        return res.status(500).json({ errors: ApiMessages.material.noMaterial + err });
    }
}

/**
 * @swagger
 * /api/v1/courses/{courseId}/materials:
 *   post:
 *     tags:
 *       - Course
 *     summary: Allow to add material
 *     description: "Allow to add material. Available for roles: teacher, admin"
 *     requestBody:
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/MaterialRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/MaterialResponse'
 *         description: Return created material information
 */
export async function handlePostMaterial(req: MaterialRequest, res: MaterialResponse) {
    const courseId = req.params.courseId;
    const { payload } = Helper.getJwtAndPayload(req);
    const userId = payload.userId;

    const body = req.body;
    try {
        const createdCourse = await CreatedCourses.findOne({
            where: {
                userId,
                courseId,
            },
        });

        if (isNil(createdCourse)) {
            return res.status(403).json({ errors: ApiMessages.course.notOwnerError });
        }

        const material = await Material.create({
            title: body.title,
            data: body.data,
            order: body.order ?? null,
            courseId: parseInt(courseId),
        });

        const result = material.toJSON();
        return res.json(result as any);
    } catch (err) {
        return res.status(500).json({ errors: ApiMessages.material.unableCreateMaterial + err });
    }
}

/**
 * @swagger
 * /api/v1/courses/{courseId}/materials:
 *   put:
 *     tags:
 *       - Course
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
 * /api/v1/courses/{courseId}/materials/{materialId}:
 *   delete:
 *     tags:
 *       - Course
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
