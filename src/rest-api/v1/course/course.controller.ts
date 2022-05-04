import { Request } from 'express';
import { isNil, merge, omit } from 'lodash';
import { Category, Course, CreatedCourses, Like, LikeValue, StudentCourses, UserRoles } from '../../../db/models';
import sequelize from '../../../db/sequelize';
import { logger } from '../../../helpers/winston-logger';
import { ApiMessages } from '../../shared/api-messages';
import { DbFieldsToOmit } from '../../shared/constants';
import { DefaultResponse } from '../../shared/interfaces';
import { DbHelper } from '../db-helper';
import { Helper } from '../helper';
import { ChangeCourseRequest, CourseListResponse, CourseRequest, CourseResponse, UserCourseListResponse } from './course.interfaces';

async function countLikes(courseId: number): Promise<{ likes: number; dislikes: number; }> {
    const likes = await Like.count({
        where: {
            courseId,
            like: LikeValue.Yes,
        },
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('like')), 'n_likes']
            ]
        }
    });
    const dislikes = await Like.count({
        where: {
            courseId,
            like: LikeValue.No
        },
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('like')), 'n_dislikes']
            ]
        }
    });

    return {
        likes,
        dislikes
    };
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

    try {
        const courseId = parseInt(req.params.courseId);
        const course: any = await Course.findOne({
            raw: true,
            attributes: {
                exclude: DbFieldsToOmit
            },
            where: {
                id: courseId,
            },
        });

        if (isNil(course)) {
            return res.status(404).json({ errors: ApiMessages.course.noCourse });
        }

        const { likes, dislikes } = await countLikes(courseId);
        course.likes = likes;
        course.dislikes = dislikes;
        return res.status(200).json(course);
    } catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.course.noCourse + ': ' + err });
    }
}

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
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*) as likes
                            FROM likes AS l
                            WHERE
                                l."courseId" = course.id
                                AND
                                l.like = 'yes'
                        )`),
                        'likes'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*) as likes
                            FROM likes AS l
                            WHERE
                                l."courseId" = course.id
                                AND
                                l.like = 'no'
                        )`),
                        'dislikes'
                    ],
                ],
                exclude: DbFieldsToOmit
            },
        });

        courses.forEach((el: any) => {
            el.likes = parseInt(el.likes);
            el.dislikes = parseInt(el.dislikes);

        });

        return res.status(200).json(courses);
    } catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.course.noCourse + err });
    }
}

/**
 * @swagger
 * /api/v1/courses/mine:
 *   get:
 *     tags:
 *       - Course
 *     summary: Allow to get created courses for teacher/admin and enrolled courses for student
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/UserCourseListResponse'
 */
export async function handleGetMineCourses(req: Request, res: UserCourseListResponse) {
    const { payload } = Helper.getJwtAndPayload(req);
    const studentRoleId = await DbHelper.getRoleId(UserRoles.Student);

    if (payload.roleId === studentRoleId) {
        try {
            const result: any = await StudentCourses.findAll({
                raw: true,
                where: {
                    userId: payload.userId,
                },
                attributes: {
                    exclude: DbFieldsToOmit
                }
            });
            return res.json(result);
        }
        catch (err) {
            logger.error(JSON.stringify(err));
            return res.status(500).json({ errors: ApiMessages.course.unableFindCourse });
        }
    }

    try {
        const result: any = await CreatedCourses.findAll({
            raw: true,
            where: {
                userId: payload.userId,
            },
            attributes: {
                exclude: DbFieldsToOmit
            }
        });
        return res.json(result);
    }
    catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.course.unableFindCourse });
    }

}

/**
 * @swagger
 * /api/v1/courses/{courseId}/enroll:
 *   post:
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
 */
export async function handleEnrollCourse(req: Request, res: DefaultResponse) {
    const { payload } = Helper.getJwtAndPayload(req);
    const courseId = req.params.courseId;

    const enrollRecord = await StudentCourses.findOne({
        raw: true,
        where: {
            userId: payload.userId,
            courseId
        }
    });

    if (!isNil(enrollRecord)) {
        return res.status(200).json({ result: ApiMessages.course.alreadyEnrolled });
    }

    try {
        await StudentCourses.create({
            userId: payload.userId,
            courseId: parseInt(courseId),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return res.status(200).json({ result: ApiMessages.course.successEnroll });
    }
    catch (err: any) {
        logger.error(err);
        return res.status(500).json({ errors: ApiMessages.course.unableEnrollCourse + JSON.stringify(err) });
    }
}

/**
 * @swagger
 * /api/v1/courses/{courseId}/leave:
 *   post:
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
 */
export async function handleLeaveCourse(req: Request, res: DefaultResponse) {
    const { payload } = Helper.getJwtAndPayload(req);
    const courseId = req.params.courseId;

    try {
        const enrolledCourse = await StudentCourses.findOne({
            raw: true,
            where: {
                userId: payload.userId,
                courseId
            }
        });

        if (isNil(enrolledCourse)) {
            return res.status(404).json({ errors: ApiMessages.course.noCourseForUser });
        }

        await StudentCourses.destroy({
            where: {
                userId: payload.userId,
                courseId: parseInt(courseId)
            }
        });

        return res.status(200).json({ result: ApiMessages.course.successLeave });
    }
    catch (err: any) {
        logger.error(err);
        return res.status(500).json({ errors: ApiMessages.course.unableEnrollCourse + JSON.stringify(err) });
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

        const username = await DbHelper.getUserIdentifier(payload.userId);
        const createdCourse: any = await Course.create({
            title: body.title,
            categoryId: body.categoryId,
            description: body.description as string,
            visible: body.visible as boolean,
            createdBy: username
        });

        let result = createdCourse.toJSON();
        await CreatedCourses.create({
            userId: payload.userId,
            courseId: result.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        result = omit(result, DbFieldsToOmit);

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
            }
        });

        if (isNil(createdCourse)) {
            return res.status(404).json({ errors: ApiMessages.course.noCourse });
        }

        const foundCourse = await Course.findByPk(courseId);

        if (isNil(foundCourse)) {
            return res.status(404).json({ errors: ApiMessages.course.noCourse });
        }

        const username = await DbHelper.getUserIdentifier(userId);
        const updateData = merge(req.body, { updatedBy: username });
        await foundCourse.update(omit(updateData, 'id'));

        const result: any = omit(foundCourse.toJSON(), DbFieldsToOmit);
        return res.status(200).json(result);
    } catch (err) {
        logger.error(JSON.stringify(err));
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
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.course.unableRemoveCourse + err });
    }
}