import { omit } from 'lodash';
import { ApiMessages } from '../../src/api/shared/api-messages';
import { SchemasV1 } from '../../src/api/v1/schemas';
import { Category, Course, User } from '../../src/db/models';
import { CategoryRoute } from '../api/routes/category/category.route';
import { CourseRoute } from '../api/routes/course/course.route';
import { ApiHelper } from '../helpers/api-helper';
import { SchemaValidator } from '../helpers/schema-validator';
import { TestData } from '../helpers/test-data';

describe('API: course suite', function () {
    const createdUserIds: number[] = [];
    const createdCourseIds: number[] = [];
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

    describe('GET: course by id', function () {
        it.todo('test');
    });

    describe('GET: course list', function () {
        it.todo('test');
    });

    describe('POST: create course', function () {
        it('should return 401 error if no token passed', async () => {
            const courseData = TestData.getCourse();
            const result = await CourseRoute.postCourse(courseData);

            expect(result.status).toBe(401);
        });

        it('should not be possible to create course with student token', async () => {
            const courseData = TestData.getCourse();
            const result = await CourseRoute.postCourse(courseData, studentToken);
            expect(result.status).toBe(403);
            expect(result.body.errors).toBe('This action is forbidden for role student');
        });

        const requiredFieldsTestCases = [
            { field: 'title', expectedMessage: 'Please send required fields: title,categoryId' },
            { field: 'categoryId', expectedMessage: 'Please send required fields: title,categoryId' },
        ];

        requiredFieldsTestCases.forEach((test) => {
            it(`should check required field: ${test.field}`, async () => {
                let courseData = TestData.getCourse();
                courseData = omit(courseData, `body.${test.field}`);

                const result = await CourseRoute.postCourse(courseData);
                expect(result.status).toBe(400);

                const errors = result.body.errors;
                expect(errors[0].msg).toBe(test.expectedMessage);
                expect(errors[0].param).toBe(test.field);
                expect(errors[0].location).toBe('body');
            });
        });

        const fieldTypesTestCases = [
            { field: 'title', expectedMessage: 'Parameter should be a string' },
            { field: 'description', expectedMessage: 'Parameter should be a string' },
            { field: 'visible', expectedMessage: 'Parameter should be boolean' },
        ];

        fieldTypesTestCases.forEach((test) => {
            it(`should check field type: ${test.field}`, async () => {
                const courseData = TestData.getCourse();
                courseData.body[test.field] = null;
                const result = await CourseRoute.postCourse(courseData);
                expect(result.status).toBe(400);

                const errors = result.body.errors;
                expect(errors[0].msg).toBe(test.expectedMessage);
                expect(errors[0].param).toBe(test.field);
                expect(errors[0].location).toBe('body');
            });
        });

        const fieldLengthTestCases = [
            {
                title: 'minimum length',
                field: 'title',
                data: 'a'.repeat(SchemasV1.CourseRequest.properties.title.minLength - 1),
                expectedMessage: 'Minimum course title length is: 3',
            },
            {
                title: 'maximum length',
                field: 'title',
                data: 'a'.repeat(SchemasV1.CourseRequest.properties.title.maxLength + 1),
                expectedMessage: 'Maximum course title length is: 100',
            },
            {
                title: 'minimum length',
                field: 'description',
                data: 'a'.repeat(SchemasV1.CourseRequest.properties.description.minLength - 1),
                expectedMessage: 'Minimum course description length is: 3',
            },
            {
                title: 'maximum length',
                field: 'description',
                data: 'a'.repeat(SchemasV1.CourseRequest.properties.description.maxLength + 1),
                expectedMessage: 'Maximum course description length is: 500',
            },
        ];

        fieldLengthTestCases.forEach((test) => {
            it(`should check field ${test.title}: ${test.field}`, async () => {
                const courseData = TestData.getCourse();
                courseData.body[test.field] = test.data;
                const result = await CourseRoute.postCourse(courseData);
                expect(result.status).toBe(400);

                const errors = result.body.errors;
                expect(errors[0].msg).toBe(test.expectedMessage);
                expect(errors[0].param).toBe(test.field);
                expect(errors[0].location).toBe('body');
            });
        });

        it('should be possible to create course with teacher role', async () => {
            const categoryData = await TestData.getCategory();
            const categoryResponse = await CategoryRoute.postCategory(categoryData, adminToken);
            expect(categoryResponse.status).toBe(200);
            const categoryId = categoryResponse.body.id;
            createdCategoryIds.push(categoryId);

            const courseData = TestData.getCourse({ categoryId });
            const result = await CourseRoute.postCourse(courseData, teacherToken);
            expect(result.status).toBe(200);
            const courseId = result.body.id;
            createdCourseIds.push(courseId);

            SchemaValidator.check(result.body, SchemasV1.CourseResponse);

            expect(result.body.title).toBe(courseData.body.title);
            expect(result.body.description).toBe(courseData.body.description);
            expect(result.body.visible).toBe(courseData.body.visible);
            expect(result.body.categoryId).toBe(courseData.body.categoryId);
        });

        it('should be possible to create course with admin role', async () => {
            const categoryData = await TestData.getCategory();
            const categoryResponse = await CategoryRoute.postCategory(categoryData, adminToken);
            expect(categoryResponse.status).toBe(200);
            const categoryId = categoryResponse.body.id;
            createdCategoryIds.push(categoryId);

            const courseData = TestData.getCourse({ categoryId });
            const result = await CourseRoute.postCourse(courseData, adminToken);
            expect(result.status).toBe(200);
            const courseId = result.body.id;
            createdCourseIds.push(courseId);

            SchemaValidator.check(result.body, SchemasV1.CourseResponse);

            expect(result.body.title).toBe(courseData.body.title);
            expect(result.body.description).toBe(courseData.body.description);
            expect(result.body.visible).toBe(courseData.body.visible);
            expect(result.body.categoryId).toBe(courseData.body.categoryId);
        });
    });

    describe('PUT: change course', function () {
        it.todo('test');
    });

    describe('DELETE: remove course', function () {
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

        for (const id of createdCourseIds) {
            try {
                await Course.destroy({
                    where: {
                        id,
                    },
                });
            } catch (err) {
                console.log(ApiMessages.course.unableRemoveCourse + err);
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
