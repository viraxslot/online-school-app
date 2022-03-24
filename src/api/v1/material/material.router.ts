import express from 'express';
import { body } from 'express-validator';
import { isNil } from 'lodash';
import { Course, Permissions } from '../../../db/models';
import { checkJwtAuth } from '../../middleware/check-jwt-auth';
import { checkPermission } from '../../middleware/check-permission';
import { checkValidation } from '../../middleware/check-validation';
import { ApiMessages } from '../../shared/api-messages';
import { v1Methods } from '../endpoints';
import { SchemasV1 } from '../schemas';
import {
    handleDeleteMaterial,
    handleGetMaterialById,
    handleGetMaterialsList,
    handlePostMaterial,
    handlePutMaterial
} from './material.controller';
const materialRouter = express.Router();

materialRouter.get(
    '/' + v1Methods.material.materialId,
    checkJwtAuth,
    checkPermission(Permissions.GetMaterial),
    handleGetMaterialById
);

materialRouter.get(
    '/' + v1Methods.material.materialsByCourseId,
    checkJwtAuth,
    checkPermission(Permissions.GetMaterialList),
    handleGetMaterialsList
);

materialRouter.post(
    '/' + v1Methods.material.material,
    body(
        SchemasV1.MaterialRequest.required,
        ApiMessages.common.requiredFields(SchemasV1.MaterialRequest.required.toString())
    ).exists(),
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
    body('courseId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async courseId => {
            const course = await Course.findByPk(courseId);
            if (isNil(course)) {
                throw ApiMessages.course.noCourse;
            }
            return true;
        }),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.CreateMaterial),
    handlePostMaterial
);

materialRouter.put(
    '/' + v1Methods.material.material,
    checkJwtAuth,
    checkPermission(Permissions.ChangeMaterial),
    handlePutMaterial
);

materialRouter.delete(
    '/' + v1Methods.category.categoryId,
    checkPermission(Permissions.RemoveMaterial),
    handleDeleteMaterial
);

export default materialRouter;
