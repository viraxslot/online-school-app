import { ApiMessages } from '../../src/api/shared/api-messages';
import { SchemasV1 } from '../../src/api/v1/schemas';
import { Category } from '../../src/db/models';
import { CategoryRoute } from '../api/routes/category/category.route';
import { SchemaValidator } from '../helpers/schema-validator';
import { TestData } from '../helpers/test-data';

describe('API: category suite', function () {
    describe('GET, category list', function () {
        //
    });

    describe('GET, category', function () {
        //
    });

    describe('POST, add category', function () {
        const createdCategoryIds: number[] = [];
        it('should return validation error if there is no title passed', async () => {
            const result = await CategoryRoute.postCategory({} as any);

            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.msg).toBe('Please send required fields: title');
            expect(error.param).toBe('title');
            expect(error.location).toBe('body');
        });

        it('should return validation error if title is not a string', async () => {
            const result = await CategoryRoute.postCategory({ body: { title: 123 } } as any);

            expect(result.status).toBe(400);
            const error = result.body.errors[0];
            expect(error.msg).toBe('Parameter should be a string');
            expect(error.param).toBe('title');
            expect(error.location).toBe('body');
        });

        it('should be possible to create category', async () => {
            const category = TestData.getCategory();
            const result = await CategoryRoute.postCategory(category);

            expect(result.status).toBe(200);

            const categoryId = result.body.id;
            createdCategoryIds.push(categoryId);

            SchemaValidator.check(result.body, SchemasV1.CategoryResponse);
            expect(typeof result.body.id).toBe('number');
            expect(result.body.title).toBe(category.body.title);
            expect(typeof result.body.createdAt).toBe('string');
            expect(typeof result.body.updatedAt).toBe('string');

            const createdCategory = await Category.findOne({
                where: {
                    id: categoryId,
                },
            });
            expect(createdCategory).not.toBeNull();
        });

        afterAll(async () => {
            for (const id of createdCategoryIds) {
                try {
                    await Category.destroy({
                        where: {
                            id,
                        },
                    });
                } catch (err) {
                    console.log(ApiMessages.category.unableRemoveCategory + err);
                }
            }
        });
    });

    describe('PUT, change category', function () {
        //
    });

    describe('DELETE, remove category', function () {
        //
    });
});
