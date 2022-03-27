import { ApiMessages } from '../../src/api/shared/api-messages';
import { SchemasV1 } from '../../src/api/v1/schemas';
import { Category, User } from '../../src/db/models';
import { CourseRoute } from '../api/routes/course/course.route';
import { ApiHelper } from '../helpers/api-helper';
import { SchemaValidator } from '../helpers/schema-validator';
import { TestData } from '../helpers/test-data';

describe('API: material suite', function () {
    const createdUserIds: number[] = [];
    const createdCategoryIds: number[] = [];

    // let studentToken: string;
    let teacherToken: string;
    let adminToken: string;
    let courseId: number;

    beforeAll(async () => {
        // const student = await ApiHelper.getStudentToken();
        const teacher = await ApiHelper.getTeacherToken();
        const admin = await ApiHelper.getAdminToken();

        // studentToken = student.token;
        teacherToken = teacher.token;
        adminToken = admin.token;

        const result = await ApiHelper.createCourse(adminToken);
        courseId = result.courseId;

        createdUserIds.push(teacher.userId, admin.userId);
        createdCategoryIds.push(result.categoryId);
    });

    describe('GET: materials by course id', function () {
        it.todo('test');
    });

    describe('GET: material by id', function () {
        it.todo('test');
    });

    describe('POST: create material', function () {
        const validationTestCases = [
            {
                title: 'type of title field',
                field: 'title',
                value: 123,
                expectedMessage: 'Parameter should be a string',
            },
            {
                title: 'min length of title field',
                field: 'title',
                value: 'a'.repeat(SchemasV1.MaterialRequest.properties.title.minLength - 1),
                expectedMessage: 'Minimum material title length is: 3',
            },
            {
                title: 'max length of title field',
                field: 'title',
                value: 'a'.repeat(SchemasV1.MaterialRequest.properties.title.maxLength + 1),
                expectedMessage: 'Maximum material title length is: 100',
            },
            {
                title: 'type of data field',
                field: 'data',
                value: 123,
                expectedMessage: 'Parameter should be a string',
            },
            {
                title: 'min length of data field',
                field: 'data',
                value: 'a'.repeat(SchemasV1.MaterialRequest.properties.data.minLength - 1),
                expectedMessage: 'Minimum material data length is: 10',
            },
            {
                title: 'max length of data field',
                field: 'data',
                value: 'a'.repeat(SchemasV1.MaterialRequest.properties.data.maxLength + 1),
                expectedMessage: 'Maximum material data length is: 1000',
            },
        ];

        validationTestCases.forEach((test) => {
            it(`should validate ${test.title}`, async () => {
                const material = TestData.getMaterial();
                material.body[test.field] = test.value;

                const result = await CourseRoute.postMaterial(courseId, material);
                expect(result.status).toBe(400);

                const error = result.body.errors[0];
                expect(error.msg).toBe(test.expectedMessage);
                expect(error.param).toBe(test.field);
                expect(error.value).toBe(test.value);
            });
        });

        it('should return 401 error if no token passed', async () => {
            const material = TestData.getMaterial();
            const result = await CourseRoute.postMaterial(courseId, material);
            expect(result.status).toBe(401);
        });

        it('should return 403 error if trying to add material for other owner course', async () => {
            const material = TestData.getMaterial();

            const result = await CourseRoute.postMaterial(courseId, material, teacherToken);
            expect(result.status).toBe(403);
            expect(result.body.errors).toBe("You're not owner of this course, you can't change/remove it");
        });

        const materialTestCases = [
            { title: 'not null order', value: 100 },
            { title: 'null order', value: null },
        ];

        materialTestCases.forEach((test) => {
            it(`should be possible to create material with ${test.title}`, async () => {
                const material = TestData.getMaterial();
                material.body.order = test.value;

                const result = await CourseRoute.postMaterial(courseId, material, adminToken);
                expect(result.status).toBe(200);
                SchemaValidator.check(result.body, SchemasV1.MaterialResponse);

                expect(result.body.title).toBe(material.body.title);
                expect(result.body.data).toBe(material.body.data);
                expect(result.body.order).toBe(material.body.order);
                expect(result.body.courseId).toBe(courseId);
            });
        });

        it('should be possible to create material with teacher role', async () => {
            const { categoryId } = await ApiHelper.createCategory(adminToken);
            createdCategoryIds.push(categoryId);
            const course = TestData.getCourse({
                categoryId,
            });

            const createdCourse = await CourseRoute.postCourse(course, teacherToken);
            const courseId = createdCourse.body.id;

            const material = TestData.getMaterial();
            const createdMaterial = await CourseRoute.postMaterial(courseId, material, teacherToken);
            expect(createdMaterial.status).toBe(200);
            SchemaValidator.check(createdMaterial.body, SchemasV1.MaterialResponse);

            expect(createdMaterial.body.title).toBe(material.body.title);
            expect(createdMaterial.body.data).toBe(material.body.data);
            expect(createdMaterial.body.order).toBe(material.body.order);
            expect(createdMaterial.body.courseId).toBe(courseId);
        });
    });

    describe('PUT: change material', function () {
        it.todo('test');
    });

    describe('DELETE: remove material', function () {
        it.todo('test');
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
                console.log(ApiMessages.user.unableRemoveUser + err);
            }
        }
    });
});
