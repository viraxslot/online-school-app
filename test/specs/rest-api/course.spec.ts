import { omit } from 'lodash';
import jwt from 'jsonwebtoken';
import { ApiMessages } from '../../../src/rest-api/shared/api-messages';
import { SchemasV1 } from '../../../src/rest-api/v1/schemas';
import { Category, Course, CreatedCourses, LikeValue, StudentCourses, User, UserRoles } from '../../../src/db/models';
import { logger } from '../../../src/helpers/winston-logger';
import { CourseRoute } from '../../rest-api/routes/course/course.route';
import { ApiHelper } from '../../helpers/api-helper';
import { SchemaValidator } from '../../helpers/schema-validator';
import { TestData } from '../../helpers/test-data';
import { TokenPayload } from '../../../src/rest-api/shared/interfaces';
import { DbFieldsToOmit } from '../../../src/rest-api/shared/constants';

describe('REST API: course suite', function () {
    const createdUserIds: number[] = [];
    const createdCategoryIds: number[] = [];

    const allRolesTestCases = [{ role: UserRoles.Student }, { role: UserRoles.Teacher }, { role: UserRoles.Admin }];
    const teacherAdminTestCases = [{ role: UserRoles.Teacher }, { role: UserRoles.Admin }];

    let studentToken: string;
    let teacherToken: string;
    let adminToken: string;

    let categoryId: number;
    let courseId: number;

    beforeAll(async () => {
        const student = await ApiHelper.createStudent();
        const teacher = await ApiHelper.createTeacher();
        const admin = await ApiHelper.createAdmin();

        studentToken = student.token;
        teacherToken = teacher.token;
        adminToken = admin.token;

        createdUserIds.push(student.userId, teacher.userId, admin.userId);

        const createdCourse = await ApiHelper.createCourse(adminToken);
        categoryId = createdCourse.categoryId;
        courseId = createdCourse.courseId;
        createdCategoryIds.push(categoryId);
    });

    describe('GET: course by id', function () {
        it('should return 401 error if no token passed', async () => {
            const maxId: number = await Course.max('id');

            const result = await CourseRoute.getCourse(maxId + 1);
            expect(result.status).toBe(401);
        });

        it('should return 404 error if no course found', async () => {
            const maxId: number = await Course.max('id');

            const result = await CourseRoute.getCourse(maxId + 10, studentToken);
            expect(result.status).toBe(404);
            expect(result.body.errors).toBe('Unable to find course record(s)');
        });

        allRolesTestCases.forEach((test) => {
            it(`should be possible to get course by id with ${test.role} role`, async () => {
                const { token, userId } = await ApiHelper.createUser({ role: test.role });
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

        it('should not return hidden course', async () => {
            const hiddenCourse = TestData.getCourse({
                categoryId,
                visible: false,
            });

            const createdCourse = await CourseRoute.postCourse(hiddenCourse, teacherToken);
            expect(createdCourse.status).toBe(200);

            const courseId = createdCourse.body.id;
            const course = await Course.findOne({
                raw: true,
                where: {
                    id: courseId,
                },
            });

            expect(course).not.toBeNull();

            const result = await CourseRoute.getCourse(courseId, studentToken);
            expect(result.status).toBe(404);
            expect(result.body.errors).toBe('Unable to find course record(s)');
        });

        it('should return amount of likes and dislikes for the course', async () => {
            const { courseId, categoryId } = await ApiHelper.createCourse(adminToken);
            createdCategoryIds.push(categoryId);

            const likeResponse = await CourseRoute.changeLike(courseId, LikeValue.Yes, studentToken);
            expect(likeResponse.status).toBe(200);

            const courseResponse = await CourseRoute.getCourse(courseId, studentToken);
            expect(courseResponse.status).toBe(200);

            expect(courseResponse.body.likes).toBe(1);
            expect(courseResponse.body.dislikes).toBe(0);

            const dislikeResponse = await CourseRoute.changeLike(courseId, LikeValue.No, studentToken);
            expect(dislikeResponse.status).toBe(200);

            const courseResponse2 = await CourseRoute.getCourse(courseId, studentToken);
            expect(courseResponse2.status).toBe(200);

            expect(courseResponse2.body.likes).toBe(0);
            expect(courseResponse2.body.dislikes).toBe(1);
        });
    });

    describe('GET: course list', function () {
        it('should return 401 error if no token passed', async () => {
            const result = await CourseRoute.getCourseList();
            expect(result.status).toBe(401);
        });

        allRolesTestCases.forEach((test) => {
            it(`should be possible to get courses list with ${test.role} role`, async () => {
                const { token, userId } = await ApiHelper.createUser({ role: test.role });
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

        it('should not return hidden courses', async () => {
            const hiddenCourse = TestData.getCourse({
                categoryId,
                visible: false,
            });

            const createdCourse = await CourseRoute.postCourse(hiddenCourse, teacherToken);
            expect(createdCourse.status).toBe(200);

            const courseId = createdCourse.body.id;
            const course = await Course.findOne({
                raw: true,
                where: {
                    id: courseId,
                },
            });

            expect(course).not.toBeNull();

            const result = await CourseRoute.getCourseList(studentToken);
            expect(result.status).toBe(200);

            const hiddenCoursesList = result.body.filter((el) => !el.visible);
            expect(hiddenCoursesList.length).toBe(0);
        });

        it('should return likes and dislikes for the course', async () => {
            const { courseId, categoryId } = await ApiHelper.createCourse(adminToken);
            createdCategoryIds.push(categoryId);

            const student1 = await ApiHelper.createStudent();
            const student2 = await ApiHelper.createStudent();
            createdUserIds.push(student1.userId, student2.userId);

            const likeResponse1 = await CourseRoute.changeLike(courseId, LikeValue.Yes, student1.token);
            const likeResponse2 = await CourseRoute.changeLike(courseId, LikeValue.Yes, student2.token);
            expect(likeResponse1.status).toBe(200);
            expect(likeResponse2.status).toBe(200);

            const coursesList = await CourseRoute.getCourseList(student1.token);
            expect(coursesList.status).toBe(200);

            const course = coursesList.body.find((el) => el.id === courseId);
            expect(course).not.toBeNull();
            expect(course?.likes).toBe(2);
            expect(course?.dislikes).toBe(0);
        });
    });

    describe('GET: mine course list', function () {
        it('should return 401 error if no token passed', async () => {
            const result = await CourseRoute.getMineCourseList();
            expect(result.status).toBe(401);
        });

        it('should be possible for student get list of enrolled courses', async () => {
            const { userId, token } = await ApiHelper.createStudent();
            createdUserIds.push(userId);

            let mineCourses = await CourseRoute.getMineCourseList(token);
            expect(mineCourses.status).toBe(200);
            expect(mineCourses.body).toMatchObject([]);

            const enrollResponse = await CourseRoute.enrollCourse(courseId, token);
            expect(enrollResponse.status).toBe(200);

            mineCourses = await CourseRoute.getMineCourseList(token);
            expect(mineCourses.body.length).toBe(1);
            expect(mineCourses.body[0].userId).toBe(userId);
            expect(mineCourses.body[0].courseId).toBe(courseId);
        });

        it('should be possible for teacher get list of created courses', async () => {
            const { userId, token } = await ApiHelper.createTeacher();
            createdUserIds.push(userId);

            let mineCourses = await CourseRoute.getMineCourseList(token);
            expect(mineCourses.status).toBe(200);
            expect(mineCourses.body).toMatchObject([]);

            const courseData = TestData.getCourse({ categoryId });
            const createResponse = await CourseRoute.postCourse(courseData, token);
            expect(createResponse.status).toBe(200);
            const createdCourseId = createResponse.body.id;

            mineCourses = await CourseRoute.getMineCourseList(token);
            expect(mineCourses.body.length).toBe(1);
            expect(mineCourses.body[0].userId).toBe(userId);
            expect(mineCourses.body[0].courseId).toBe(createdCourseId);
        });
    });

    const negativeRoleTestCases = [
        { title: 'admin role', role: UserRoles.Admin, expectedMessage: 'This action is forbidden for role admin' },
        {
            title: 'teacher role',
            role: UserRoles.Teacher,
            expectedMessage: 'This action is forbidden for role teacher',
        },
    ];

    describe('POST: enroll the course', function () {
        it('should check type of courseId query parameter', async () => {
            const result = await CourseRoute.enrollCourse('test' as any);
            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('params');
            expect(error.msg).toBe('Parameter should be numeric');
            expect(error.param).toBe('courseId');
        });

        it('should check that course with such id exists', async () => {
            const result = await CourseRoute.enrollCourse(-1);
            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('params');
            expect(error.msg).toBe('Unable to find course record(s)');
            expect(error.param).toBe('courseId');
        });

        it('should return 401 error if no token passed', async () => {
            const result = await CourseRoute.enrollCourse(courseId);
            expect(result.status).toBe(401);
        });

        it('should not be possible to join hidden course', async () => {
            const courseData = TestData.getCourse({
                categoryId,
                visible: false,
            });
            expect(courseData.body.visible).toBe(false);

            const createdCourse = await CourseRoute.postCourse(courseData, teacherToken);
            expect(createdCourse.status).toBe(200);
            const courseId = createdCourse.body.id;

            const result = await CourseRoute.enrollCourse(courseId, studentToken);
            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('params');
            expect(error.msg).toBe('Unable to enroll the hidden course');
            expect(error.value).toBe(courseId.toString());
        });

        negativeRoleTestCases.forEach((test) => {
            it(`should not be possible to enroll course for ${test.title}`, async () => {
                const { userId, token } = await ApiHelper.createUser({ role: test.role });
                createdUserIds.push(userId);

                const result = await CourseRoute.enrollCourse(courseId, token);
                expect(result.status).toBe(403);
                expect(result.body.errors).toBe(test.expectedMessage);
            });
        });

        it('should be possible for student to enroll the course', async () => {
            const payload = jwt.decode(studentToken) as TokenPayload;
            let enrolledCourse = await StudentCourses.findOne({
                raw: true,
                where: {
                    userId: payload.userId,
                    courseId,
                },
            });

            expect(enrolledCourse).toBeNull();
            const result = await CourseRoute.enrollCourse(courseId, studentToken);

            expect(result.status).toBe(200);
            expect(result.body.result).toBe("You've successfully enrolled the course");

            enrolledCourse = await StudentCourses.findOne({
                raw: true,
                where: {
                    userId: payload.userId,
                    courseId,
                },
            });
            expect(enrolledCourse).not.toBeNull();
        });

        it('should show info message if student already enrolled the course', async () => {
            const payload = jwt.decode(studentToken) as TokenPayload;

            const firstEnroll = await CourseRoute.enrollCourse(courseId, studentToken);
            expect(firstEnroll.status).toBe(200);

            const enrolledCourse = await StudentCourses.findOne({
                raw: true,
                where: {
                    userId: payload.userId,
                    courseId,
                },
            });
            expect(enrolledCourse).not.toBeNull();

            const secondEnroll = await CourseRoute.enrollCourse(courseId, studentToken);
            expect(secondEnroll.status).toBe(200);
            expect(secondEnroll.body.result).toBe("You've already enrolled to this course");
        });
    });

    describe('POST: leave the course', function () {
        it('should check type of courseId query parameter', async () => {
            const result = await CourseRoute.leaveCourse('test' as any);
            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('params');
            expect(error.msg).toBe('Parameter should be numeric');
            expect(error.param).toBe('courseId');
        });

        it('should check that course with such id exists', async () => {
            const result = await CourseRoute.leaveCourse(-1);
            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('params');
            expect(error.msg).toBe('Unable to find course record(s)');
            expect(error.param).toBe('courseId');
        });

        it('should return 401 error if no token passed', async () => {
            const result = await CourseRoute.leaveCourse(courseId);
            expect(result.status).toBe(401);
        });

        negativeRoleTestCases.forEach((test) => {
            it(`should not be possible to leave the course for ${test.title}`, async () => {
                const { userId, token } = await ApiHelper.createUser({ role: test.role });
                createdUserIds.push(userId);

                const result = await CourseRoute.leaveCourse(courseId, token);
                expect(result.status).toBe(403);
                expect(result.body.errors).toBe(test.expectedMessage);
            });
        });

        it('should return 404 error if user did not enroll the course', async () => {
            const { userId, token } = await ApiHelper.createStudent();
            createdUserIds.push(userId);

            const leaveResponse = await CourseRoute.leaveCourse(courseId, token);
            expect(leaveResponse.status).toBe(404);
            expect(leaveResponse.body.errors).toBe("You didn't enroll this course");
        });

        it('should be possible to leave the course', async () => {
            const payload = jwt.decode(studentToken) as TokenPayload;

            const enrollResponse = await CourseRoute.enrollCourse(courseId, studentToken);
            expect(enrollResponse.status).toBe(200);

            let enrolledCourse = await StudentCourses.findOne({
                raw: true,
                where: {
                    userId: payload.userId,
                    courseId,
                },
            });
            expect(enrolledCourse).not.toBeNull();
            const leaveResponse = await CourseRoute.leaveCourse(courseId, studentToken);
            expect(leaveResponse.status).toBe(200);
            expect(leaveResponse.body.result).toBe("You've successfully left the course");

            enrolledCourse = await StudentCourses.findOne({
                raw: true,
                where: {
                    userId: payload.userId,
                    courseId,
                },
            });
            expect(enrolledCourse).toBeNull();
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
                title: 'spaces only',
                field: 'title',
                data: ' '.repeat(10),
                expectedMessage: 'You are not allowed to use spaces only',
            },
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

        const maxLengthPositiveCases = [
            {
                title: 'maximum length title',
                field: 'title',
                data: 'a'.repeat(SchemasV1.CourseRequest.properties.title.maxLength),
            },
            {
                title: 'maximum length description',
                field: 'description',
                data: 'a'.repeat(SchemasV1.CourseRequest.properties.description.maxLength),
            },
        ];

        maxLengthPositiveCases.forEach((test) => {
            it(`should be possible to create a course with ${test.title}`, async () => {
                const { categoryId } = await ApiHelper.createCategory(adminToken);
                createdCategoryIds.push(categoryId);

                const courseData = TestData.getCourse({ categoryId });
                courseData.body[test.field] = test.data;

                const result = await CourseRoute.postCourse(courseData, teacherToken);
                expect(result.status).toBe(200);
                SchemaValidator.check(result.body, SchemasV1.CourseResponse);
            });
        });

        teacherAdminTestCases.forEach((test) => {
            it(`should be possible to create course with ${test.role} role`, async () => {
                const { token, userId } = await ApiHelper.createUser({ role: test.role });
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

    describe('PATCH: change course', function () {
        it('should return 400 error if required input parameters are not set', async () => {
            const courseData = TestData.getCourse({ categoryId });

            const result = await CourseRoute.patchCourse(courseData);
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

            const result = await CourseRoute.patchCourse(courseData);
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

                const { token, userId } = await ApiHelper.createUser({ role: test.role });
                createdUserIds.push(userId);

                const courseData = TestData.getCourse({ categoryId });
                const createResponse: any = await CourseRoute.postCourse(courseData, token);
                expect(createResponse.status).toBe(200);
                const courseId = createResponse.body.id;

                const newCourseData = { ...courseData };
                newCourseData.body[test.field] =
                    test.field !== 'visible' ? test.newValue + TestData.getRandomPrefix() : test.newValue;
                newCourseData.body.id = courseId;
                const changeResponse: any = await CourseRoute.patchCourse(newCourseData, token);

                expect(changeResponse.status).toBe(200);
                SchemaValidator.check(changeResponse.body, SchemasV1.CourseResponse);

                const beforeChange = omit(createResponse.body, [test.field, ...DbFieldsToOmit]);
                const afterChange = omit(changeResponse.body, [test.field, ...DbFieldsToOmit]);

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
            const changeResponse = await CourseRoute.patchCourse(courseData, adminToken);

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

            const changeResponse = await CourseRoute.patchCourse(courseData, adminToken);

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
            const { token, userId } = await ApiHelper.createTeacher();
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
            const { token, userId } = await ApiHelper.createAdmin();
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
                logger.error(ApiMessages.category.unableRemoveCategory + err);
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
                logger.error(ApiMessages.user.unableRemoveUser + err);
            }
        }
    });
});
