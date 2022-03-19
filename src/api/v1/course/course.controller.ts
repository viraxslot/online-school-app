import { Request } from 'express';
import { isNil } from 'lodash';
import { Category, Course } from '../../../db/models';
import { ApiMessages } from '../../shared/api-messages';
import { DefaultResponse } from '../../shared/interfaces';
import { ChangeCourseRequest, CourseListResponse, CourseRequest, CourseResponse } from './course.interfaces';

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     tags:
 *       - Course
 *     summary: Allow to get courses list
 *     description: "Allow to get courses list. Available for roles: ALL"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/CourseListResponse'
 *         description:
 */
export async function handleGetCourseList(req: Request, res: CourseListResponse) {
    res.status(501).json({});
}

/**
 * @swagger
 * /api/v1/course/{id}:
 *   get:
 *     tags:
 *       - Course
 *     summary: Allow to get course by id
 *     description: "Allow to get course by id. Available for roles: ALL"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/CourseResponse'
 *         description:
 */
export async function handleCourseById(req: Request, res: CourseResponse) {
    res.status(501).json({});
}

/**
 * @swagger
 * /api/v1/course:
 *   post:
 *     tags:
 *       - Course
 *     summary: Allow to add a course
 *     description: "Allow to add a course. Available for roles: teacher, admin"
 *     requestBody:
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/CourseRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/CourseResponse'
 *         description:
 */
export async function handlePostCourse(req: CourseRequest, res: CourseResponse) {
    const body = req.body;
    try {
        const foundCategory = await Category.findOne({
            raw: true,
            where: {
                id: body.categoryId,
            },
        });
        if (isNil(foundCategory)) {
            return res.status(400).json({ errors: ApiMessages.category.noCategory });
        }

        const createdCourse: any = await Course.create({
            title: body.title,
            categoryId: body.categoryId,
            description: body.description as string,
            visible: body.visible as boolean,
        });

        res.status(200).json(createdCourse.toJSON());
    } catch (err: any) {
        if (err.toString().includes('SequelizeUniqueConstraintError')) {
            return res.status(400).json({ errors: ApiMessages.course.uniqueFields });
        }

        return res.status(500).json({
            errors: ApiMessages.course.unableCreateCourse + err,
        });
    }
}

/**
 * @swagger
 * /api/v1/course:
 *   put:
 *     tags:
 *       - Course
 *     summary: Allow to change a course
 *     description: "Allow to change a course. Available for roles: teacher, admin"
 *     requestBody:
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeCourseRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/CourseResponse'
 *         description:
 */
export async function handlePutCourse(req: ChangeCourseRequest, res: CourseResponse) {
    res.status(501).json({});
}

/**
 * @swagger
 * /api/v1/course/{id}:
 *   delete:
 *     tags:
 *       - Course
 *     summary: Allow to remove a course
 *     description: "Allow to remove a course. Available for roles: teacher, admin"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description:
 */
export async function handleDeleteCourse(req: Request, res: DefaultResponse) {
    res.status(501).json({});
}
