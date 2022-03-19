import { omit } from 'lodash';
import { ApiMessages } from '../../src/api/shared/api-messages';
import { SchemasV1 } from '../../src/api/v1/schemas';
import { Category, Course, User, UserRoles } from '../../src/db/models';
import { CourseRoute } from '../api/routes/course/course.route';
import { ApiHelper } from '../helpers/api-helper';
import { SchemaValidator } from '../helpers/schema-validator';
import { TestData } from '../helpers/test-data';

describe('API: course suite', function () {
    const createdUserIds: number[] = [];
    const createdCourseIds: number[] = [];
    const createdCategoryIds: number[] = [];

    const allRolesTestCases = [{ role: UserRoles.Student }, { role: UserRoles.Teacher }, { role: UserRoles.Admin }];
    const teacherAdminTestCases = [{ role: UserRoles.Teacher }, { role: UserRoles.Admin }];

    let studentToken: string;
    let adminToken: string;

    beforeAll(async () => {
        const student = await ApiHelper.getStudentToken();
        const admin = await ApiHelper.getAdminToken();

        studentToken = student.token;
        adminToken = admin.token;

        createdUserIds.push(student.userId, admin.userId);
    });

    describe('GET: course by id', function () {
        it('should return 401 error if no token passed', async () => {
            const result = await CourseRoute.getCourse(-1);
            expect(result.status).toBe(401);
        });

        it('should return 404 error if no course found', async () => {
            const result = await CourseRoute.getCourse(-1, studentToken);
            expect(result.status).toBe(404);
            expect(result.body.errors).toBe('Unable to find course record(s)');
        });

        allRolesTestCases.forEach((test) => {
            it(`should be possible to get course by id with ${test.role} role`, async () => {
                const { token, userId } = await ApiHelper.getToken(test.role);
                createdUserIds.push(userId);

                const { categoryId, courseId } = await ApiHelper.createCourse(adminToken);
                createdCategoryIds.push(categoryId);
                createdCourseIds.push(courseId);

                const result = await CourseRoute.getCourse(courseId, token);
                expect(result.status).toBe(200);

                SchemaValidator.check(result.body, SchemasV1.CourseResponse);
                expect(result.body.id).toBe(courseId);
                expect(result.body.categoryId).toBe(categoryId);
            });
        });
    });

    describe('GET: course list', function () {
        it('should return 401 error if no token passed', async () => {
            const result = await CourseRoute.getCourseList();
            expect(result.status).toBe(401);
        });

        allRolesTestCases.forEach((test) => {
            it(`should be possible to get courses list with ${test.role} role`, async () => {
                const { token, userId } = await ApiHelper.getToken(test.role);
                createdUserIds.push(userId);

                const { courseId, categoryId } = await ApiHelper.createCourse(adminToken);
                createdCategoryIds.push(categoryId);
                createdCourseIds.push(courseId);

                const result = await CourseRoute.getCourseList(token);
                expect(result.status).toBe(200);

                SchemaValidator.check(result.body, SchemasV1.CourseListResponse);
                const foundCourse = result.body.find((el) => el.id === courseId);
                expect(foundCourse).not.toBeNull();
            });
        });
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

        teacherAdminTestCases.forEach((test) => {
            it(`should be possible to create course with ${test.role} role`, async () => {
                const { token, userId } = await ApiHelper.getToken(test.role);
                createdUserIds.push(userId);

                const { categoryId } = await ApiHelper.createCategory(adminToken);
                createdCategoryIds.push(categoryId);

                const courseData = TestData.getCourse({ categoryId });
                const result = await CourseRoute.postCourse(courseData, token);
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
    });

    describe('PUT: change course', function () {
        it.todo('test');
    });

    describe('DELETE: remove course', function () {
        it.todo('test');
    });

    afterEach(async () => {
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
    });

    afterAll(async () => {
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
