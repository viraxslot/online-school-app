import { omit } from 'lodash';
import { ApiMessages } from '../../src/api/shared/api-messages';
import { SchemasV1 } from '../../src/api/v1/schemas';
import { Category, Course, CreatedCourses, User, UserRoles } from '../../src/db/models';
import { CourseRoute } from '../api/routes/course/course.route';
import { ApiHelper } from '../helpers/api-helper';
import { SchemaValidator } from '../helpers/schema-validator';
import { TestData } from '../helpers/test-data';

describe('API: course suite', function () {
    const createdUserIds: number[] = [];
    const createdCategoryIds: number[] = [];

    const allRolesTestCases = [{ role: UserRoles.Student }, { role: UserRoles.Teacher }, { role: UserRoles.Admin }];
    const teacherAdminTestCases = [{ role: UserRoles.Teacher }, { role: UserRoles.Admin }];

    let studentToken: string;
    let teacherToken: string;
    let adminToken: string;

    let categoryId: number;

    beforeAll(async () => {
        const student = await ApiHelper.getStudentToken();
        const teacher = await ApiHelper.getTeacherToken();
        const admin = await ApiHelper.getAdminToken();

        studentToken = student.token;
        teacherToken = teacher.token;
        adminToken = admin.token;

        createdUserIds.push(student.userId, teacher.userId, admin.userId);

        const result = await ApiHelper.createCategory(adminToken);
        categoryId = result.categoryId;
        createdCategoryIds.push(categoryId);
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
            const courseData = TestData.getCourse({ categoryId });
            const result = await CourseRoute.postCourse(courseData);

            expect(result.status).toBe(401);
        });

        it('should not be possible to create course with student token', async () => {
            const courseData = TestData.getCourse({ categoryId });
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

        it('should return 400 error if category id is not exist', async () => {
            const courseData = TestData.getCourse();
            courseData.body.categoryId = -1;
            const changeResponse = await CourseRoute.postCourse(courseData, adminToken);

            expect(changeResponse.status).toBe(400);
            const error = changeResponse.body.errors[0];
            expect(error.msg).toBe('Unable to find category record(s)');
            expect(error.param).toBe('categoryId');
            expect(error.location).toBe('body');
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
                SchemaValidator.check(result.body, SchemasV1.CourseResponse);

                expect(result.body.title).toBe(courseData.body.title);
                expect(result.body.description).toBe(courseData.body.description);
                expect(result.body.visible).toBe(courseData.body.visible);
                expect(result.body.categoryId).toBe(courseData.body.categoryId);

                const createdCourse = await CreatedCourses.findOne({
                    raw: true,
                    where: {
                        userId,
                        courseId: result.body.id,
                    },
                });
                expect(createdCourse).not.toBeNull();
            });
        });
    });

    describe('PUT: change course', function () {
        it('should return 400 error if required input parameters are not set', async () => {
            const courseData = TestData.getCourse({ categoryId });

            const result = await CourseRoute.putCourse(courseData);
            expect(result.status).toBe(400);

            const errors = result.body.errors;
            expect(errors.length).toBe(2);
            expect(errors[0].param).toBe('id');
            expect(errors[0].msg).toBe('Please send required fields: id');

            expect(errors[1].param).toBe('id');
            expect(errors[1].msg).toBe('Parameter should be numeric');
        });

        it('should return 401 error if token is not passed', async () => {
            const courseData = TestData.getCourse({ courseId: -1, categoryId });

            const result = await CourseRoute.putCourse(courseData);
            expect(result.status).toBe(401);
            expect(result.body.errors).toBe('Unauthorized');
        });

        const changeTestCases = [
            { role: UserRoles.Teacher, field: 'title', newValue: 'test' },
            { role: UserRoles.Teacher, field: 'description', newValue: 'test description' },
            { role: UserRoles.Teacher, field: 'visible', newValue: false },
            { role: UserRoles.Admin, field: 'title', newValue: 'test' },
            { role: UserRoles.Admin, field: 'description', newValue: 'test description' },
            { role: UserRoles.Admin, field: 'visible', newValue: false },
        ];
        changeTestCases.forEach((test) => {
            it(`should be possible to change ${test.field} field in course with ${test.role} role`, async () => {
                const { categoryId } = await ApiHelper.createCategory(adminToken);
                createdCategoryIds.push(categoryId);

                const { token, userId } = await ApiHelper.getToken(test.role);
                createdUserIds.push(userId);

                const courseData = TestData.getCourse({ categoryId });
                const createResponse: any = await CourseRoute.postCourse(courseData, token);
                expect(createResponse.status).toBe(200);
                const courseId = createResponse.body.id;

                const newCourseData = { ...courseData };
                newCourseData.body[test.field] =
                    test.field !== 'visible' ? test.newValue + TestData.getRandomPrefix() : test.newValue;
                newCourseData.body.id = courseId;
                const changeResponse: any = await CourseRoute.putCourse(newCourseData, token);

                expect(changeResponse.status).toBe(200);
                SchemaValidator.check(changeResponse.body, SchemasV1.CourseResponse);

                const beforeChange = omit(createResponse.body, [test.field, 'createdAt', 'updatedAt']);
                const afterChange = omit(changeResponse.body, [test.field, 'createdAt', 'updatedAt']);

                expect(beforeChange).toMatchObject(afterChange);
                expect(createResponse.body[test.field]).not.toBe(changeResponse.body[test.field]);
                expect(changeResponse.body[test.field]).toBe(newCourseData.body[test.field]);
            });
        });

        it('should return 400 error if new category id is not exist', async () => {
            const { courseId, categoryId } = await ApiHelper.createCourse(adminToken);
            createdCategoryIds.push(categoryId);

            const courseData = TestData.getCourse();
            courseData.body.id = courseId;
            courseData.body.categoryId = -1;
            const changeResponse = await CourseRoute.putCourse(courseData, adminToken);

            expect(changeResponse.status).toBe(400);
            const error = changeResponse.body.errors[0];
            expect(error.msg).toBe('Unable to find category record(s)');
            expect(error.param).toBe('categoryId');
            expect(error.location).toBe('body');
        });

        it('should be possible to change category id', async () => {
            const { courseId, categoryId } = await ApiHelper.createCourse(adminToken);
            createdCategoryIds.push(categoryId);

            const newCategory = await ApiHelper.createCategory(adminToken);
            createdCategoryIds.push(newCategory.categoryId);

            const courseData = TestData.getCourse();
            courseData.body.id = courseId;
            courseData.body.categoryId = newCategory.categoryId;

            const changeResponse = await CourseRoute.putCourse(courseData, adminToken);

            expect(changeResponse.status).toBe(200);
            expect(changeResponse.body.id).toBe(courseId);
            expect(changeResponse.body.categoryId).toBe(newCategory.categoryId);
        });
    });

    describe('DELETE: remove course', function () {
        it('should return 401 error if token is not passed', async () => {
            const { courseId, categoryId } = await ApiHelper.createCourse(adminToken);
            createdCategoryIds.push(categoryId);

            const result = await CourseRoute.deleteCourse(courseId);
            expect(result.status).toBe(401);
        });

        it('should return 403 error if trying to remove course with student token', async () => {
            const { courseId, categoryId } = await ApiHelper.createCourse(adminToken);
            createdCategoryIds.push(categoryId);

            const result = await CourseRoute.deleteCourse(courseId, studentToken);
            expect(result.status).toBe(403);
            expect(result.body.errors).toBe('This action is forbidden for role student');
        });

        it('should not be possible for teacher to remove course that belongs to another teacher', async () => {
            const { token, userId } = await ApiHelper.getTeacherToken();
            createdUserIds.push(userId);

            const { categoryId } = await ApiHelper.createCategory(adminToken);
            createdCategoryIds.push(categoryId);

            const courseData = TestData.getCourse({ categoryId });
            const courseResponse = await CourseRoute.postCourse(courseData, teacherToken);
            expect(courseResponse.status).toBe(200);
            const courseId = courseResponse.body.id;

            const result = await CourseRoute.deleteCourse(courseId, token);
            expect(result.status).toBe(403);
            expect(result.body.errors).toBe("You're not owner of this course, you can't change/remove it");

            const course = await Course.findByPk(courseId);
            expect(course).not.toBeNull();
        });

        it('should not be possible for teacher to remove course that belongs to admin', async () => {
            const { courseId, categoryId } = await ApiHelper.createCourse(adminToken);
            createdCategoryIds.push(categoryId);

            const result = await CourseRoute.deleteCourse(courseId, teacherToken);
            expect(result.status).toBe(403);
            expect(result.body.errors).toBe("You're not owner of this course, you can't change/remove it");

            const course = await Course.findByPk(courseId);
            expect(course).not.toBeNull();
        });

        it('should be possible for teacher to remove its own course', async () => {
            const { categoryId } = await ApiHelper.createCategory(adminToken);
            createdCategoryIds.push(categoryId);

            const courseData = TestData.getCourse({ categoryId });
            const courseResponse = await CourseRoute.postCourse(courseData, teacherToken);
            expect(courseResponse.status).toBe(200);
            const courseId = courseResponse.body.id;

            const result = await CourseRoute.deleteCourse(courseId, teacherToken);
            expect(result.status).toBe(200);
            expect(result.body.result).toBe('Success: record was removed.');

            const course = await Course.findByPk(courseId);
            expect(course).toBeNull();
        });

        it('should be possible for admin remove any course record', async () => {
            const { token, userId } = await ApiHelper.getAdminToken();
            createdUserIds.push(userId);

            const { categoryId } = await ApiHelper.createCategory(adminToken);
            createdCategoryIds.push(categoryId);

            const courseData = TestData.getCourse({ categoryId });
            const courseResponse = await CourseRoute.postCourse(courseData, adminToken);
            expect(courseResponse.status).toBe(200);
            const courseId = courseResponse.body.id;

            const result = await CourseRoute.deleteCourse(courseId, token);
            expect(result.status).toBe(200);
            expect(result.body.result).toBe('Success: record was removed.');

            const course = await Course.findByPk(courseId);
            expect(course).toBeNull();
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
                console.log(ApiMessages.user.unableRemoveUser + err);
            }
        }
    });
});
