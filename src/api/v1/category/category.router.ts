import express from 'express';
import { body } from 'express-validator';
import { ApiMessages } from '../../shared/api-messages';
import { v1Methods } from '../endpoints';
import { SchemasV1 } from '../schemas';
import {
    handleDeleteCategory,
    handleGetCategoriesList,
    handleGetCategoryById,
    handlePostCategory,
    handlePutCategory,
} from './category.controller';
const categoryRouter = express.Router();

categoryRouter.get('/' + v1Methods.category.categoryId, handleGetCategoryById);
categoryRouter.get('/' + v1Methods.category.category, handleGetCategoriesList);

categoryRouter.post(
    '/' + v1Methods.category.category,
    body(SchemasV1.CategoryRequest.required, ApiMessages.category.requiredFields).exists(),
    body('title', ApiMessages.common.stringParameter).isString(),
    handlePostCategory
);

categoryRouter.get('/' + v1Methods.category.category, handlePutCategory);
categoryRouter.get('/' + v1Methods.category.categoryId, handleDeleteCategory);

export default categoryRouter;
