import express from 'express';
import { body } from 'express-validator';
import { Permissions } from '../../../db/models';
import { checkJwtAuth } from '../../middleware/check-jwt-auth';
import { checkPermission } from '../../middleware/check-permission';
import { checkValidation } from '../../middleware/check-validation';
import { ApiMessages } from '../../shared/api-messages';
import { v1Methods } from '../endpoints';
import { SchemasV1 } from '../schemas';
import {
    handleCourseById,
    handleDeleteCourse,
    handleGetCourseList,
    handlePostCourse,
    handlePutCourse,
} from './course.controller';
const courseRouter = express.Router();

courseRouter.get('/' + v1Methods.course.course, checkJwtAuth, checkPermission(Permissions.GetCourse), handleCourseById);

courseRouter.get(
    '/' + v1Methods.course.courses,
    checkJwtAuth,
    checkPermission(Permissions.GetCourseList),
    handleGetCourseList
);

courseRouter.post(
    '/' + v1Methods.course.course,
    body(
        SchemasV1.CourseRequest.required,
        ApiMessages.common.requiredFields(SchemasV1.CourseRequest.required.toString())
    ).exists(),
    body('title', ApiMessages.common.stringParameter).isString(),
    body('title', ApiMessages.course.wrongMinCourseTitleLength).isLength({
        min: SchemasV1.CourseRequest.properties.title.minLength,
    }),
    body('title', ApiMessages.course.wrongMaxCourseTitleLength).isLength({
        max: SchemasV1.CourseRequest.properties.title.maxLength,
    }),
    body('description', ApiMessages.common.stringParameter).isString(),
    body('description', ApiMessages.course.wrongMinCourseDescriptionLength).isLength({
        min: SchemasV1.CourseRequest.properties.description.minLength,
    }),
    body('description', ApiMessages.course.wrongMaxCourseDescriptionLength).isLength({
        max: SchemasV1.CourseRequest.properties.description.maxLength,
    }),
    body('visible', ApiMessages.common.booleanParameter).isBoolean(),
    body('categoryId', ApiMessages.common.numericParameter).isNumeric(),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.CreateCourse),
    handlePostCourse
);

courseRouter.put(
    '/' + v1Methods.course.course,
    checkJwtAuth,
    checkPermission(Permissions.ChangeCourse),
    handlePutCourse
);

courseRouter.delete(
    '/' + v1Methods.course.courseId,
    checkJwtAuth,
    checkPermission(Permissions.RemoveCourse),
    handleDeleteCourse
);

export default courseRouter;
