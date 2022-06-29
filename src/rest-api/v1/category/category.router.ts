import express from 'express';
import { body, param } from 'express-validator';
import { Permissions } from '../../../db/models';
import { checkPermission } from '../../middleware/check-permission';
import { checkValidation } from '../../middleware/check-validation';
import { checkJwtAuth } from '../../middleware/check-jwt-auth';
import { ApiMessages } from '../../shared/api-messages';
import { v1Methods } from '../endpoints';
import { SchemasV1 } from '../schemas';
import {
    handleDeleteCategory,
    handleGetCategoriesList,
    handleGetCategoryById,
    handlePostCategory,
    handlePatchCategory,
} from './category.controller';
import { titleRegex } from '../../shared/constants';
const categoryRouter = express.Router();

categoryRouter.get(
    '/' + v1Methods.category.categoriesById,
    param('id')
        .exists()
        .withMessage(ApiMessages.common.unableParseId)
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.GetCategory),
    handleGetCategoryById
);

categoryRouter.get(
    '/' + v1Methods.category.categories,
    checkJwtAuth,
    checkPermission(Permissions.GetCategoryList),
    handleGetCategoriesList
);

function categoryTitleValidation() {
    return body('title')
        .isString()
        .withMessage(ApiMessages.common.stringParameter)
        .isLength({
            min: SchemasV1.CategoryRequest.properties.title.minLength,
        })
        .withMessage(ApiMessages.category.wrongMinCategoryLength)
        .isLength({
            max: SchemasV1.CategoryRequest.properties.title.maxLength,
        })
        .withMessage(ApiMessages.category.wrongMaxCategoryLength)
        .custom((value) => {
            return value.match(titleRegex);
        })
        .withMessage(ApiMessages.common.onlyAlphabetAndDigitsAllowed)
        .custom((value) => {
            return !value.match(/^ *$/);
        })
        .withMessage(ApiMessages.common.onlySpacesNotAllowed);
}

categoryRouter.post(
    '/' + v1Methods.category.categories,
    body(SchemasV1.CategoryRequest.required)
        .exists()
        .withMessage(ApiMessages.common.requiredFields(SchemasV1.CategoryRequest.required.toString())),
    categoryTitleValidation(),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.CreateCategory),
    handlePostCategory
);

categoryRouter.patch(
    '/' + v1Methods.category.categories,
    body(SchemasV1.ChangeCategoryRequest.required)
        .exists()
        .withMessage(ApiMessages.common.requiredFields(SchemasV1.ChangeCategoryRequest.required.toString())),
    body('id').isNumeric().withMessage(ApiMessages.common.numericParameter),
    categoryTitleValidation(),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.ChangeCategory),
    handlePatchCategory
);

categoryRouter.delete(
    '/' + v1Methods.category.categoriesById,
    param('id')
        .exists()
        .withMessage(ApiMessages.common.unableParseId)
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.RemoveCategory),
    handleDeleteCategory
);

export default categoryRouter;
