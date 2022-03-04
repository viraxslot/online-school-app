import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { isNil } from 'lodash';
import { Category } from '../../../db/models';
import { ApiMessages } from '../../shared/api-messages';
import { CategoryRequest, CategoryResponse } from './category.interfaces';

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     tags:
 *       - Category
 *     summary: Allow to get list of categories
 *     description: Allow to get list of categories
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 *         description: Return list of categories
 */
export async function handleGetCategoriesList(req: Request, res: Response) {
    res.status(501).json({});
}

/**
 * @swagger
 * /api/v1/category/{id}:
 *   get:
 *     tags:
 *       - Category
 *     summary: Allow to get category by id
 *     description: Allow to get category by id
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *         description: Return requested category information
 */
export async function handleGetCategoryById(req: Request, res: CategoryResponse) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const categoryId = req.params.id;

    try {
        const category: any = await Category.findOne({
            raw: true,
            where: {
                id: categoryId,
            },
        });

        if (isNil(category)) {
            return res.status(404).json({ errors: ApiMessages.category.unableGetCategory });
        }

        return res.status(200).json(category);
    } catch (err) {
        return res.status(500).json({ errors: ApiMessages.category.unableGetCategory + ': ' + err });
    }
}

/**
 * @swagger
 * /api/v1/category:
 *   post:
 *     tags:
 *       - Category
 *     summary: Allow to add category
 *     description: Allow to add category
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const createdCategory: any = await Category.create({
            title: req.body.title,
        });

        res.status(200).json(createdCategory.toJSON());
    } catch (err: any) {
        if (err.toString().includes('SequelizeUniqueConstraintError')) {
            return res.status(400).json({ errors: ApiMessages.category.uniqueFields });
        }

        return res.status(500).json({
            errors: ApiMessages.category.unableCreateCategory + err,
        });
    }
}

/**
 * @swagger
 * /api/v1/category:
 *   put:
 *     tags:
 *       - Category
 *     summary: Allow to change category
 *     description: Allow to change category
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
 *         description: Return changed category information
 */
export async function handlePutCategory(req: Request, res: Response) {
    res.status(501).json({});
}

/**
 * @swagger
 * /api/v1/category/{id}:
 *   delete:
 *     tags:
 *       - Category
 *     summary: Allow to remove category by id
 *     description: Allow to remove category by id
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: Return operation result or an error
 */
export async function handleDeleteCategory(req: Request, res: Response) {
    res.status(501).json({});
}
