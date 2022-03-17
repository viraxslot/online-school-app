import express from 'express';
import { Permissions } from '../../../db/models';
import { checkJwtAuth } from '../../middleware/check-jwt-auth';
import { checkPermission } from '../../middleware/check-permission';
import { v1Methods } from '../endpoints';
import { handleCourseById, handleDeleteCourse, handleGetCourseList, handlePostCourse, handlePutCourse } from './course.controller';
const courseRouter = express.Router();


courseRouter.get(
    '/' + v1Methods.course.course,
    checkJwtAuth,
    checkPermission(Permissions.GetCourse),
    handleCourseById
);

courseRouter.get(
    '/' + v1Methods.course.courses,
    checkJwtAuth,
    checkPermission(Permissions.GetCourseList),
    handleGetCourseList
);

courseRouter.post(
    '/' + v1Methods.course.course,
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