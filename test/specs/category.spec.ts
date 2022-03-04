import { ApiMessages } from '../../src/api/shared/api-messages';
import { SchemasV1 } from '../../src/api/v1/schemas';
import { Category } from '../../src/db/models';
import { CategoryRoute } from '../api/routes/category/category.route';
import { SchemaValidator } from '../helpers/schema-validator';

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

        const allowedTitleTestCases = [
            { title: 'special characters', data: 'test!@#$' },
            { title: 'number', data: '123test' },
        ];
        allowedTitleTestCases.forEach((test) => {
            it(`should return validation error if title has ${test.title}`, async () => {
                const result = await CategoryRoute.postCategory({ body: { title: test.data } });

                expect(result.status).toBe(400);
                const error = result.body.errors[0];
                expect(error.msg).toBe('Only RU/EN alphabet symbols allowed, please change your request');
                expect(error.param).toBe('title');
                expect(error.location).toBe('body');
            });
        });

        const allowedLengthTestCases = [
            {
                title: 'less than minimum length',
                data: 'a'.repeat(SchemasV1.CategoryRequest.properties.title.minLength - 1),
                expectedError: `Minimum category length is: ` + SchemasV1.CategoryRequest.properties.title.minLength,
            },
            {
                title: 'greater than maximum length',
                data: 'a'.repeat(SchemasV1.CategoryRequest.properties.title.maxLength + 1),
                expectedError: `Maximum category length is: ` + SchemasV1.CategoryRequest.properties.title.maxLength,
            },
        ];

        allowedLengthTestCases.forEach((test) => {
            it(`should return validation error if title has ${test.title}`, async () => {
                const result = await CategoryRoute.postCategory({ body: { title: test.data } });

                expect(result.status).toBe(400);
                const error = result.body.errors[0];
                expect(error.param).toBe('title');
                expect(error.location).toBe('body');
                expect(error.msg).toBe(test.expectedError);
            });
        });

        it('should not be possible to create category with the same title', async () => {
            const category = {
                body: {
                    title: 'test category',
                },
            };
            const result1 = await CategoryRoute.postCategory(category);
            const categoryId1 = result1.body.id;
            createdCategoryIds.push(categoryId1);

            const result2 = await CategoryRoute.postCategory(category);
            expect(result2.status).toBe(400);
            expect(result2.body.errors).toBe('title should be unique');
        })

        const createCategoryTestCases = [
            { title: 'using en locale', data: 'Test Category Z' },
            { title: 'using ru locale', data: 'ТестоваЯ КатегориЯ А' },
            { title: 'with minimum length', data: 'a'.repeat(SchemasV1.CategoryRequest.properties.title.minLength) },
            { title: 'with maximum length', data: 'a'.repeat(SchemasV1.CategoryRequest.properties.title.maxLength) },
        ];

        createCategoryTestCases.forEach((test) => {
            it(`should be possible to create category ${test.title}`, async () => {
                const category = {
                    body: {
                        title: test.data,
                    },
                };
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
