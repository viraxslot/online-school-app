import { Request } from 'express';
import { isNil, omit } from 'lodash';
import { Category, Course, CreatedCourses, UserRoles } from '../../../db/models';
import { logger } from '../../../helpers/winston-logger';
import { ApiMessages } from '../../shared/api-messages';
import { DefaultResponse } from '../../shared/interfaces';
import { DbHelper } from '../db-helper';
import { Helper } from '../helper';
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
    try {
        const courses: any = await Course.findAll({
            raw: true,
        });

        const result = courses.map((el: any) => {
            return omit(el, ['createdAt', 'updatedAt']);
        });

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ errors: ApiMessages.course.noCourse + err });
    }
}

/**
 * @swagger
 * /api/v1/courses/{courseId}:
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
    const courseId = req.params.courseId;

    try {
        const course: any = await Course.findOne({
            raw: true,
            where: {
                id: courseId,
            },
        });

        if (isNil(course)) {
            return res.status(404).json({ errors: ApiMessages.course.noCourse });
        }

        return res.status(200).json(course);
    } catch (err) {
        return res.status(500).json({ errors: ApiMessages.course.noCourse + ': ' + err });
    }
}

/**
 * @swagger
 * /api/v1/courses:
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
    const { payload } = Helper.getJwtAndPayload(req);
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

        const result = createdCourse.toJSON();
        await CreatedCourses.create({
            userId: payload.userId,
            courseId: result.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(200).json(result);
    } catch (err: any) {
        if (err.toString().includes('SequelizeUniqueConstraintError')) {
            return res.status(400).json({ errors: ApiMessages.course.uniqueFields });
        }
        logger.error(err);

        return res.status(500).json({
            errors: ApiMessages.course.unableCreateCourse + err,
        });
    }
}

/**
 * @swagger
 * /api/v1/courses:
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
    const courseId = req.body.id;
    const { payload } = Helper.getJwtAndPayload(req);
    const userId = payload.userId;

    try {
        const createdCourse = await CreatedCourses.findOne({
            where: {
                userId,
                courseId,
            },
        });

        if (isNil(createdCourse)) {
            return res.status(404).json({ errors: ApiMessages.course.noCourse });
        }

        const foundCourse = await Course.findByPk(courseId);

        if (isNil(foundCourse)) {
            return res.status(404).json({ errors: ApiMessages.course.noCourse });
        }
        await foundCourse.update(req.body);

        const result: any = foundCourse.toJSON();
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ errors: ApiMessages.course.unableChangeCourse + err });
    }
}

/**
 * @swagger
 * /api/v1/courses/{courseId}:
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
    const courseId = req.params.courseId;

    const { payload } = Helper.getJwtAndPayload(req);
    const userId = payload.userId;

    try {
        const createdCourse = await CreatedCourses.findOne({
            where: {
                userId,
                courseId,
            },
        });

        const teacherRoleId = await DbHelper.getRoleId(UserRoles.Teacher);
        if (isNil(createdCourse) && payload.roleId == teacherRoleId) {
            return res.status(403).json({ errors: ApiMessages.course.notOwnerError });
        }

        await Course.destroy({
            where: {
                id: courseId,
            },
        });
        return res.status(200).json({ result: ApiMessages.common.removeSuccess });
    } catch (err) {
        return res.status(500).json({ errors: ApiMessages.course.unableRemoveCourse + err });
    }
}

/**
 * @swagger
 * /api/v1/courses/{courseId}/enroll:
 *   get:
 *     tags:
 *       - Course
 *     summary: Allow student to enroll the course
 *     description: "Allow to enroll to a course. Available for roles: student"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: 
 */
export async function handleEnrollCourse(req: Request, res: DefaultResponse) {
    return res.status(501).json({});
}

/**
 * @swagger
 * /api/v1/courses/{courseId}/leave:
 *   get:
 *     tags:
 *       - Course
 *     summary: Allow to leave the course that student previously joined
 *     description: "Allow to leave the course. Available for roles: student"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: 
 */
export async function handleLeaveCourse(req: Request, res: DefaultResponse) {
    return res.status(501).json({});
}