import { Request } from 'express';
import { isNil, omit } from 'lodash';
import { Category } from '../../../db/models';
import { logger } from '../../../helpers/winston-logger';
import { ApiMessages } from '../../shared/api-messages';
import { DbFieldsToOmit } from '../../shared/constants';
import { DefaultResponse } from '../../shared/interfaces';
import { DbHelper } from '../db-helper';
import { Helper } from '../helper';
import { CategoryListResponse, CategoryRequest, CategoryResponse, ChangeCategoryRequest } from './category.interfaces';

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     tags:
 *       - Category
 *     summary: Allow to get list of categories
 *     description: "Allow to get list of categories. Available for roles: ALL"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 *         description: Return list of categories
 */
export async function handleGetCategoriesList(req: Request, res: CategoryListResponse) {
    try {
        const categories: any = await Category.findAll({
            raw: true,
            attributes: {
                exclude: DbFieldsToOmit,
            },
        });

        return res.status(200).json(categories);
    } catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.category.noCategory + err });
    }
}

/**
 * @swagger
 * /api/v1/categories/{categoryId}:
 *   get:
 *     tags:
 *       - Category
 *     summary: Allow to get category by id
 *     description: "Allow to get category by id. Available for roles: ALL"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *         description: Return requested category information
 */
export async function handleGetCategoryById(req: Request, res: CategoryResponse) {
    const categoryId = req.params.id;

    try {
        const category: any = await Category.findOne({
            raw: true,
            where: {
                id: categoryId,
            },
            attributes: {
                exclude: DbFieldsToOmit,
            },
        });

        if (isNil(category)) {
            return res.status(404).json({ errors: ApiMessages.category.noCategory });
        }

        return res.status(200).json(category);
    } catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.category.noCategory + ': ' + err });
    }
}

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     tags:
 *       - Category
 *     summary: Allow to add category
 *     description: "Allow to add category. Available for roles: admin"
 *     requestBody:
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *         description: Return created category information
 */
export async function handlePostCategory(req: CategoryRequest, res: CategoryResponse) {
    try {
        const { payload } = Helper.getJwtAndPayload(req);
        const username = await DbHelper.getUserIdentifier(payload.userId);

        const createdCategory: any = await Category.create({
            title: req.body.title,
            createdBy: username,
            updatedBy: null,
        });

        const result = omit(createdCategory.toJSON(), DbFieldsToOmit);

        res.status(200).json(result);
    } catch (err: any) {
        if (err.toString().includes('SequelizeUniqueConstraintError')) {
            return res.status(400).json({ errors: ApiMessages.category.uniqueFields });
        }

        logger.error(JSON.stringify(err));
        return res.status(500).json({
            errors: ApiMessages.category.unableCreateCategory + err,
        });
    }
}

/**
 * @swagger
 * /api/v1/categories:
 *   patch:
 *     tags:
 *       - Category
 *     summary: Allow to change the category
 *     description: "Allow to change category. Available for roles: admin"
 *     requestBody:
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeCategoryRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *         description: Return changed category information
 */
export async function handlePatchCategory(req: ChangeCategoryRequest, res: CategoryResponse) {
    const categoryId = req.body.id;
    try {
        const foundCategory = await Category.findByPk(categoryId);

        if (isNil(foundCategory)) {
            return res.status(404).json({ errors: ApiMessages.category.noCategory });
        }

        const { payload } = Helper.getJwtAndPayload(req);
        const username = await DbHelper.getUserIdentifier(payload.userId);

        await foundCategory.update({
            title: req.body.title,
            updatedBy: username,
        });

        const result: any = omit(foundCategory.toJSON(), DbFieldsToOmit);
        return res.status(200).json(result);
    } catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.category.unableChangeCategory + err });
    }
}

/**
 * @swagger
 * /api/v1/categories/{categoryId}:
 *   delete:
 *     tags:
 *       - Category
 *     summary: Allow to remove category by id
 *     description: "Allow to remove category by id. Available for roles: admin"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Return operation result or an error
 */
export async function handleDeleteCategory(req: Request, res: DefaultResponse) {
    const categoryId = req.params.id;

    try {
        await Category.destroy({
            where: {
                id: categoryId,
            },
        });
        return res.status(200).json({ result: ApiMessages.common.removeSuccess });
    } catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.category.unableRemoveCategory + err });
    }
}
