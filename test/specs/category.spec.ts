import { ApiMessages } from '../../src/api/shared/api-messages';
import { SchemasV1 } from '../../src/api/v1/schemas';
import { Category, User } from '../../src/db/models';
import { ApiCategoryRequest, ApiChangeCategoryRequest } from '../api/routes/category/category.interfaces';
import { CategoryRoute } from '../api/routes/category/category.route';
import { ApiHelper } from '../helpers/api-helper';
import { SchemaValidator } from '../helpers/schema-validator';
import { TestData } from '../helpers/test-data';

describe('API: category suite', function () {
    const createdUserIds: number[] = [];
    const createdCategoryIds: number[] = [];

    let studentToken: string;
    let teacherToken: string;
    let adminToken: string;

    beforeAll(async () => {
        const student = await ApiHelper.getStudentToken();
        const teacher = await ApiHelper.getTeacherToken();
        const admin = await ApiHelper.getAdminToken();

        studentToken = student.token;
        teacherToken = teacher.token;
        adminToken = admin.token;

        createdUserIds.push(student.userId, teacher.userId, admin.userId);
    });

    describe('GET, category list', function () {
        it('should return 401 error if no token passed', async () => {
            const result = await CategoryRoute.getCategoriesList();
            expect(result.status).toBe(401);
        });

        it('should be possible to get category list with student role', async () => {
            const category: ApiCategoryRequest = TestData.getCategory();
            const result = await CategoryRoute.postCategory(category, adminToken);
            expect(result.status).toBe(200);
            createdCategoryIds.push(result.body.id);

            const categories = await CategoryRoute.getCategoriesList(studentToken);
            expect(categories.status).toBe(200);
        });

        it('should be possible to get category list with teacher role', async () => {
            const category: ApiCategoryRequest = TestData.getCategory();
            const result = await CategoryRoute.postCategory(category, adminToken);
            expect(result.status).toBe(200);
            createdCategoryIds.push(result.body.id);

            const categories = await CategoryRoute.getCategoriesList(teacherToken);
            expect(categories.status).toBe(200);
        });

        it('should be possible to get category list with admin role', async () => {
            const category: ApiCategoryRequest = TestData.getCategory();
            const result = await CategoryRoute.postCategory(category, adminToken);
            expect(result.status).toBe(200);
            createdCategoryIds.push(result.body.id);

            const categories = await CategoryRoute.getCategoriesList(adminToken);
            expect(categories.status).toBe(200);
        });

        it('should return categories list', async () => {
            const category1: ApiCategoryRequest = TestData.getCategory();
            const category2: ApiCategoryRequest = TestData.getCategory();

            const result1 = await CategoryRoute.postCategory(category1, adminToken);
            const result2 = await CategoryRoute.postCategory(category2, adminToken);
            expect(result1.status).toBe(200);
            expect(result2.status).toBe(200);
            createdCategoryIds.push(result1.body.id, result2.body.id);

            const categories = await CategoryRoute.getCategoriesList(teacherToken);
            expect(categories.status).toBe(200);
            expect(categories.body.length).toBeGreaterThanOrEqual(2);

            expect(categories.body.find((el) => el.title === category1.body.title)).not.toBeNull();
            expect(categories.body.find((el) => el.title === category2.body.title)).not.toBeNull();
        });
    });

    describe('GET, category', function () {
        it('should return 401 error if no token passed', async () => {
            const result = await CategoryRoute.getCategory(1);
            expect(result.status).toBe(401);
        });

        it('should return validation error if id is not number', async () => {
            const result = await CategoryRoute.getCategory('test' as any);

            expect(result.status).toBe(400);
            const error = result.body.errors[0];
            expect(error.msg).toBe('Parameter should be numeric');
            expect(error.param).toBe('id');
            expect(error.location).toBe('params');
        });

        it('should return error if category is not found', async () => {
            const result = await CategoryRoute.getCategory(-1, teacherToken);

            expect(result.status).toBe(404);
            expect(result.body.errors).toBe('Unable to find category record(s)');
        });

        it('should be possible to get category with student role', async () => {
            const category = TestData.getCategory();
            const result = await CategoryRoute.postCategory(category, adminToken);
            expect(result.status).toBe(200);
            const categoryId = result.body.id;
            createdCategoryIds.push(categoryId);

            const createdCategory = await CategoryRoute.getCategory(categoryId, studentToken);
            expect(createdCategory.status).toBe(200);
        });

        it('should be possible to get category', async () => {
            const category = TestData.getCategory();

            const result = await CategoryRoute.postCategory(category, adminToken);
            expect(result.status).toBe(200);
            const categoryId = result.body.id;
            createdCategoryIds.push(categoryId);

            const createdCategory = await CategoryRoute.getCategory(categoryId, teacherToken);
            expect(createdCategory.status).toBe(200);
            SchemaValidator.check(createdCategory.body, SchemasV1.CategoryResponse);

            expect(createdCategory.body.id).toBe(categoryId);
            expect(createdCategory.body.title).toBe(category.body.title);
        });
    });

    describe('POST, add category', function () {
        it('should return 401 error if no token passed', async () => {
            const category = TestData.getCategory();
            const result = await CategoryRoute.postCategory(category);
            expect(result.status).toBe(401);
        });
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
                data: TestData.getCategory({ titleLength: SchemasV1.CategoryRequest.properties.title.minLength - 1 }),
                expectedError: `Minimum category length is: ` + SchemasV1.CategoryRequest.properties.title.minLength,
            },
            {
                title: 'greater than maximum length',
                data: TestData.getCategory({ titleLength: SchemasV1.CategoryRequest.properties.title.maxLength + 1 }),
                expectedError: `Maximum category length is: ` + SchemasV1.CategoryRequest.properties.title.maxLength,
            },
        ];

        allowedLengthTestCases.forEach((test) => {
            it(`should return validation error if title has ${test.title}`, async () => {
                const result = await CategoryRoute.postCategory(test.data);

                expect(result.status).toBe(400);
                const error = result.body.errors[0];
                expect(error.param).toBe('title');
                expect(error.location).toBe('body');
                expect(error.msg).toBe(test.expectedError);
            });
        });

        it('should return 403 error if trying to create category with student role', async () => {
            const category = TestData.getCategory();
            const result = await CategoryRoute.postCategory(category, studentToken);

            expect(result.status).toBe(403);
            expect(result.body.errors).toBe('This action is forbidden for role student');
        });

        it('should return 403 error if trying to create category with teacher role', async () => {
            const category = TestData.getCategory();
            const result = await CategoryRoute.postCategory(category, teacherToken);

            expect(result.status).toBe(403);
            expect(result.body.errors).toBe('This action is forbidden for role teacher');
        });

        it('should not be possible to create category with the same title', async () => {
            const category = TestData.getCategory();

            const result1 = await CategoryRoute.postCategory(category, adminToken);
            const categoryId1 = result1.body.id;
            createdCategoryIds.push(categoryId1);

            const result2 = await CategoryRoute.postCategory(category, adminToken);
            expect(result2.status).toBe(400);
            expect(result2.body.errors).toBe('title should be unique');
        });

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
                const result = await CategoryRoute.postCategory(category, adminToken);
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
    });

    describe('PUT, change category', function () {
        it('should return 401 error if no token passed', async () => {
            const result = await CategoryRoute.putCategory({
                body: {
                    id: 1,
                    title: 'test',
                },
            });
            expect(result.status).toBe(401);
        });
        it('should return validation error if required parameters is not passed', async () => {
            const result = await CategoryRoute.putCategory();
            expect(result.status).toBe(400);
            const errors = result.body.errors.filter((el: any) => el.msg === 'Please send required fields: id,title');
            expect(errors.length).toBe(2);
        });

        it('should return validation error if id is not a number', async () => {
            const testData = 'test';
            const result = await CategoryRoute.putCategory({
                body: {
                    id: testData as any,
                    title: testData,
                },
            });
            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.value).toBe(testData);
            expect(error.msg).toBe('Parameter should be numeric');
            expect(error.param).toBe('id');
            expect(error.location).toBe('body');
        });

        it('should return validation error if title is not a string', async () => {
            const testData = 123;
            const result = await CategoryRoute.putCategory({
                body: {
                    id: testData,
                    title: testData as any,
                },
            });
            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.value).toBe(testData);
            expect(error.msg).toBe('Parameter should be a string');
            expect(error.param).toBe('title');
            expect(error.location).toBe('body');
        });

        it('should return error if category is not found', async () => {
            const result = await CategoryRoute.putCategory(
                {
                    body: {
                        id: -1,
                        title: 'test',
                    },
                },
                adminToken
            );

            expect(result.status).toBe(404);
            expect(result.body.errors).toBe('Unable to find category record(s)');
        });

        it('should return 403 error if trying to change category with student role', async () => {
            const category = TestData.getCategory();
            const createResult = await CategoryRoute.postCategory(category, adminToken);
            expect(createResult.status).toBe(200);

            const categoryId = createResult.body.id;
            createdCategoryIds.push(categoryId);

            const newCategory: ApiChangeCategoryRequest = TestData.getCategory({
                categoryId,
            });
            const changeResult = await CategoryRoute.putCategory(newCategory, studentToken);
            expect(changeResult.status).toBe(403);
            expect(changeResult.body.errors).toBe('This action is forbidden for role student');
        });

        it('should return 403 error if trying to change category with teacher role', async () => {
            const category = TestData.getCategory();
            const createResult = await CategoryRoute.postCategory(category, adminToken);
            expect(createResult.status).toBe(200);

            const categoryId = createResult.body.id;
            createdCategoryIds.push(categoryId);

            const newCategory: ApiChangeCategoryRequest = TestData.getCategory({
                categoryId,
            });
            const changeResult = await CategoryRoute.putCategory(newCategory, teacherToken);
            expect(changeResult.status).toBe(403);
            expect(changeResult.body.errors).toBe('This action is forbidden for role teacher');
        });

        it('should be possible to change category', async () => {
            const category = TestData.getCategory();
            const createResult = await CategoryRoute.postCategory(category, adminToken);
            expect(createResult.status).toBe(200);

            const categoryId = createResult.body.id;
            createdCategoryIds.push(categoryId);

            const newCategory: ApiChangeCategoryRequest = TestData.getCategory({
                categoryId,
            });
            expect(category.body.title).not.toBe(newCategory.body.title);

            const changeResult = await CategoryRoute.putCategory(newCategory, adminToken);
            expect(changeResult.status).toBe(200);
            expect(changeResult.body.id).toBe(newCategory.body.id);
            expect(changeResult.body.title).toBe(newCategory.body.title);

            const dbRecord: any = await Category.findOne({
                raw: true,
                where: {
                    id: categoryId,
                },
            });

            expect(dbRecord.title).toBe(newCategory.body.title);
        });
    });

    describe('DELETE, remove category', function () {
        it('should return 401 error if no token passed', async () => {
            const result = await CategoryRoute.deleteCategory(1);
            expect(result.status).toBe(401);
        });

        it('should return validation error if id is not number', async () => {
            const result = await CategoryRoute.deleteCategory('test' as any);

            expect(result.status).toBe(400);
            const error = result.body.errors[0];
            expect(error.msg).toBe('Parameter should be numeric');
            expect(error.param).toBe('id');
            expect(error.location).toBe('params');
        });

        it('should return 403 error if trying to delete category with student role', async () => {
            const category = TestData.getCategory();
            const result = await CategoryRoute.postCategory(category, adminToken);
            expect(result.status).toBe(200);

            const categoryId = result.body.id;
            createdCategoryIds.push(categoryId);

            const removeResult = await CategoryRoute.deleteCategory(categoryId, studentToken);
            expect(removeResult.status).toBe(403);
            expect(removeResult.body.errors).toBe('This action is forbidden for role student');
        });

        it('should return 403 error if trying to delete category with teacher role', async () => {
            const category = TestData.getCategory();
            const result = await CategoryRoute.postCategory(category, adminToken);
            expect(result.status).toBe(200);

            const categoryId = result.body.id;
            createdCategoryIds.push(categoryId);

            const removeResult = await CategoryRoute.deleteCategory(categoryId, teacherToken);
            expect(removeResult.status).toBe(403);
            expect(removeResult.body.errors).toBe('This action is forbidden for role teacher');
        });

        it('should be possible to remove category', async () => {
            const category = TestData.getCategory();
            const result = await CategoryRoute.postCategory(category, adminToken);
            expect(result.status).toBe(200);

            const categoryId = result.body.id;
            let getResult = await CategoryRoute.getCategory(categoryId, adminToken);
            expect(getResult.status).toBe(200);

            const removeResult = await CategoryRoute.deleteCategory(categoryId, adminToken);
            expect(removeResult.status).toBe(200);
            getResult = await CategoryRoute.getCategory(categoryId, adminToken);
            expect(getResult.status).toBe(404);

            const dbRecord = await Category.findOne({
                where: {
                    id: categoryId,
                },
            });
            expect(dbRecord).toBeNull();
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

        for (const id of createdUserIds) {
            try {
                await User.destroy({
                    where: {
                        id,
                    },
                });
            } catch (err) {
                console.log(ApiMessages.user.unableToRemove + err);
            }
        }
    });
});
