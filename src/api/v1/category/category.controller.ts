import { Request, Response } from "express";

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
export function handleGetCategoriesList(req: Request, res: Response) {
    res.status(501).json({})    
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
export function handleGetCategoryById(req: Request, res: Response) {
    res.status(501).json({})    
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
export function handlePostCategory(req: Request, res: Response) {
    res.status(501).json({})    
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
export function handlePutCategory(req: Request, res: Response) {
    res.status(501).json({})    
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
export function handleDeleteCategory(req: Request, res: Response) {
    res.status(501).json({})    
}