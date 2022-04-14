import express from 'express';
import { body, param } from 'express-validator';
import { isNil } from 'lodash';
import { Category, Course, Material, Permissions } from '../../../db/models';
import { checkJwtAuth } from '../../middleware/check-jwt-auth';
import { checkPermission } from '../../middleware/check-permission';
import { checkValidation } from '../../middleware/check-validation';
import { ApiMessages } from '../../shared/api-messages';
import { v1Methods } from '../endpoints';
import { SchemasV1 } from '../schemas';
import {
    handleCourseById,
    handleDeleteCourse,
    handleEnrollCourse,
    handleGetCourseList,
    handleGetMineCourses,
    handleLeaveCourse,
    handlePostCourse,
    handlePutCourse,
} from './course.controller';
import {
    handleDeleteMaterial,
    handleGetMaterialById,
    handleGetMaterialsList,
    handlePostMaterial,
    handlePutMaterial,
} from './material.controller';
const courseRouter = express.Router();

/**
 * Course endpoints
 */

courseRouter.get(
    '/' + v1Methods.course.coursesById,
    param('courseId')
        .exists()
        .withMessage(ApiMessages.common.unableParseId)
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter),
    checkValidation,
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

courseRouter.get(
    '/' + v1Methods.course.mine,
    checkJwtAuth,
    checkPermission(Permissions.GetMineCourseList),
    handleGetMineCourses
);

courseRouter.post(
    '/' + v1Methods.course.courses,
    body(
        SchemasV1.CourseRequest.required,
        ApiMessages.common.requiredFields(SchemasV1.CourseRequest.required.toString())
    ).exists(),
    body('title')
        .isString()
        .withMessage(ApiMessages.common.stringParameter)
        .isLength({
            min: SchemasV1.CourseRequest.properties.title.minLength,
        })
        .withMessage(ApiMessages.course.wrongMinCourseTitleLength)
        .isLength({
            max: SchemasV1.CourseRequest.properties.title.maxLength,
        })
        .withMessage(ApiMessages.course.wrongMaxCourseTitleLength),
    body('description')
        .isString()
        .withMessage(ApiMessages.common.stringParameter)
        .isLength({
            min: SchemasV1.CourseRequest.properties.description.minLength,
        })
        .withMessage(ApiMessages.course.wrongMinCourseDescriptionLength)
        .isLength({
            max: SchemasV1.CourseRequest.properties.description.maxLength,
        })
        .withMessage(ApiMessages.course.wrongMaxCourseDescriptionLength),
    body('visible').isBoolean().withMessage(ApiMessages.common.booleanParameter),
    body('categoryId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (categoryId: number) => {
            const category = await Category.findByPk(categoryId);
            if (isNil(category)) {
                throw ApiMessages.category.noCategory;
            }
            return true;
        }),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.CreateCourse),
    handlePostCourse
);

courseRouter.post(
    '/' + v1Methods.course.enroll,
    param('courseId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (courseId: number) => {
            const course = await Course.findByPk(courseId);
            if (isNil(course)) {
                throw ApiMessages.course.noCourse;
            }
            return true;
        }),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.EnrollCourse),
    handleEnrollCourse
);

courseRouter.post(
    '/' + v1Methods.course.leave,
    param('courseId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (courseId: number) => {
            const course = await Course.findByPk(courseId);
            if (isNil(course)) {
                throw ApiMessages.course.noCourse;
            }
            return true;
        }),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.LeaveCourse),
    handleLeaveCourse
);

courseRouter.put(
    '/' + v1Methods.course.courses,
    body(
        SchemasV1.ChangeCourseRequest.required,
        ApiMessages.common.requiredFields(SchemasV1.ChangeCourseRequest.required.toString())
    ).exists(),
    body('id').isNumeric().withMessage(ApiMessages.common.numericParameter),
    body('title')
        .isString()
        .withMessage(ApiMessages.common.stringParameter)
        .isLength({
            min: SchemasV1.CourseRequest.properties.title.minLength,
        })
        .withMessage(ApiMessages.course.wrongMinCourseTitleLength)
        .isLength({
            max: SchemasV1.CourseRequest.properties.title.maxLength,
        })
        .withMessage(ApiMessages.course.wrongMaxCourseTitleLength),
    body('description')
        .isString()
        .withMessage(ApiMessages.common.stringParameter)
        .isLength({
            min: SchemasV1.CourseRequest.properties.description.minLength,
        })
        .withMessage(ApiMessages.course.wrongMinCourseDescriptionLength)
        .isLength({
            max: SchemasV1.CourseRequest.properties.description.maxLength,
        })
        .withMessage(ApiMessages.course.wrongMaxCourseDescriptionLength),
    body('visible').isBoolean().withMessage(ApiMessages.common.booleanParameter),
    body('categoryId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (categoryId: number) => {
            const category = await Category.findByPk(categoryId);
            if (isNil(category)) {
                throw ApiMessages.category.noCategory;
            }
            return true;
        }),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.ChangeCourse),
    handlePutCourse
);

courseRouter.delete(
    '/' + v1Methods.course.coursesById,
    param('courseId')
        .exists()
        .withMessage(ApiMessages.common.unableParseId)
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (courseId: number) => {
            const course = await Course.findByPk(courseId);
            if (isNil(course)) {
                throw ApiMessages.course.noCourse;
            }
            return true;
        }),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.RemoveCourse),
    handleDeleteCourse
);

/**
 * Materials endpoint
 */

courseRouter.get(
    '/' + v1Methods.course.materials,
    param('courseId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (courseId: number) => {
            const course = await Course.findByPk(courseId);
            if (isNil(course)) {
                throw ApiMessages.course.noCourse;
            }
            return true;
        }),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.GetMaterialList),
    handleGetMaterialsList
);

courseRouter.get(
    '/' + v1Methods.course.materialsById,
    param('courseId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (courseId: number) => {
            const course = await Course.findByPk(courseId);
            if (isNil(course)) {
                throw ApiMessages.course.noCourse;
            }
            return true;
        }),
    param('materialId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (materialId: number) => {
            const material = await Material.findByPk(materialId);
            if (isNil(material)) {
                throw ApiMessages.material.noMaterial;
            }
            return true;
        }),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.GetMaterial),
    handleGetMaterialById
);

courseRouter.post(
    '/' + v1Methods.course.materials,
    body(
        SchemasV1.MaterialRequest.required,
        ApiMessages.common.requiredFields(SchemasV1.MaterialRequest.required.toString())
    ).exists(),
    param('courseId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (courseId: number) => {
            const course = await Course.findByPk(courseId);
            if (isNil(course)) {
                throw ApiMessages.course.noCourse;
            }
            return true;
        }),
    body('title')
        .isString()
        .withMessage(ApiMessages.common.stringParameter)
        .isLength({ min: SchemasV1.MaterialRequest.properties.title.minLength })
        .withMessage(ApiMessages.material.wrongMinMaterialTitleLength)
        .isLength({ max: SchemasV1.MaterialRequest.properties.title.maxLength })
        .withMessage(ApiMessages.material.wrongMaxMaterialTitleLength),
    body('data')
        .isString()
        .withMessage(ApiMessages.common.stringParameter)
        .isLength({ min: SchemasV1.MaterialRequest.properties.data.minLength })
        .withMessage(ApiMessages.material.wrongMinMaterialDataLength)
        .isLength({ max: SchemasV1.MaterialRequest.properties.data.maxLength })
        .withMessage(ApiMessages.material.wrongMaxMaterialDataLength),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.CreateMaterial),
    handlePostMaterial
);

courseRouter.put(
    '/' + v1Methods.course.materials,
    body(
        SchemasV1.ChangeMaterialRequest.required,
        ApiMessages.common.requiredFields(SchemasV1.ChangeMaterialRequest.required.toString())
    ).exists(),
    param('courseId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (courseId: number) => {
            const course = await Course.findByPk(courseId);
            if (isNil(course)) {
                throw ApiMessages.course.noCourse;
            }

            return true;
        }),
    body('id')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (materialId: number) => {
            const material = await Material.findByPk(materialId);
            if (isNil(material)) {
                throw ApiMessages.material.noMaterial;
            }
            return true;
        }),
    body('title')
        .isString()
        .withMessage(ApiMessages.common.stringParameter)
        .isLength({ min: SchemasV1.ChangeMaterialRequest.properties.title.minLength })
        .withMessage(ApiMessages.material.wrongMinMaterialTitleLength)
        .isLength({ max: SchemasV1.ChangeMaterialRequest.properties.title.maxLength })
        .withMessage(ApiMessages.material.wrongMaxMaterialTitleLength),
    body('data')
        .isString()
        .withMessage(ApiMessages.common.stringParameter)
        .isLength({ min: SchemasV1.ChangeMaterialRequest.properties.data.minLength })
        .withMessage(ApiMessages.material.wrongMinMaterialDataLength)
        .isLength({ max: SchemasV1.ChangeMaterialRequest.properties.data.maxLength })
        .withMessage(ApiMessages.material.wrongMaxMaterialDataLength),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.ChangeMaterial),
    handlePutMaterial
);

courseRouter.delete(
    '/' + v1Methods.course.materialsById,
    param('courseId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (courseId: number) => {
            const course = await Course.findByPk(courseId);
            if (isNil(course)) {
                throw ApiMessages.course.noCourse;
            }
            return true;
        }),
    param('materialId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (materialId: number) => {
            const material = await Material.findByPk(materialId);
            if (isNil(material)) {
                throw ApiMessages.material.noMaterial;
            }
            return true;
        }),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.RemoveMaterial),
    handleDeleteMaterial
);

export default courseRouter;
