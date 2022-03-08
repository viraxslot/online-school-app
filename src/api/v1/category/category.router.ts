import express from 'express';
import { body, param } from 'express-validator';
import { checkValidation } from '../../middleware/check-validation';
import { ApiMessages } from '../../shared/api-messages';
import { v1Methods } from '../endpoints';
import { SchemasV1 } from '../schemas';
import {
    handleDeleteCategory,
    handleGetCategoriesList,
    handleGetCategoryById,
    handlePostCategory,
    handlePutCategory
} from './category.controller';
const categoryRouter = express.Router();

categoryRouter.get(
    '/' + v1Methods.category.categoryId,
    param('id', ApiMessages.common.unableToParseId).exists(),
    param('id', ApiMessages.common.numericParameter).isNumeric(),
    checkValidation,
    handleGetCategoryById
);

categoryRouter.get('/' + v1Methods.category.categories, handleGetCategoriesList);

categoryRouter.post(
    '/' + v1Methods.category.category,
    body(
        SchemasV1.CategoryRequest.required,
        ApiMessages.common.requiredFields(SchemasV1.CategoryRequest.required.toString())
    ).exists(),
    body('title', ApiMessages.common.stringParameter).isString(),
    body('title', ApiMessages.category.wrongMinCategoryLength).isLength({
        min: SchemasV1.CategoryRequest.properties.title.minLength,
    }),
    body('title', ApiMessages.category.wrongMaxCategoryLength).isLength({
        max: SchemasV1.CategoryRequest.properties.title.maxLength,
    }),
    body('title', ApiMessages.common.onlyAlphabetAllowed).custom((value) => {
        return value.match(/^[A-Za-z\u0410-\u044F ]+$/);
    }),
    checkValidation,
    handlePostCategory
);

categoryRouter.put(
    '/' + v1Methods.category.category,
    body(
        SchemasV1.ChangeCategoryRequest.required,
        ApiMessages.common.requiredFields(SchemasV1.ChangeCategoryRequest.required.toString())
    ).exists(),
    body('id', ApiMessages.common.numericParameter).isNumeric(),
    body('title', ApiMessages.common.stringParameter).isString(),
    checkValidation,
    handlePutCategory
);

categoryRouter.delete(
    '/' + v1Methods.category.categoryId,
    param('id', ApiMessages.common.unableToParseId).exists(),
    param('id', ApiMessages.common.numericParameter).isNumeric(),
    checkValidation,
    handleDeleteCategory
);

export default categoryRouter;
