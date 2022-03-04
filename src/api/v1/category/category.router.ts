import express from 'express';
import { v1Methods } from '../endpoints';
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
categoryRouter.post('/' + v1Methods.category.category, handlePostCategory);
categoryRouter.get('/' + v1Methods.category.category, handlePutCategory);
categoryRouter.get('/' + v1Methods.category.categoryId, handleDeleteCategory);

export default categoryRouter;
