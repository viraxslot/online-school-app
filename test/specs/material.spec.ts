import { ApiMessages } from '../../src/api/shared/api-messages';
import { SchemasV1 } from '../../src/api/v1/schemas';
import { Course, User } from '../../src/db/models';
import { CourseRoute } from '../api/routes/course/course.route';
import { ApiHelper } from '../helpers/api-helper';
import { TestData } from '../helpers/test-data';

describe('API: material suite', function () {
    const createdUserIds: number[] = [];
    const createdCourseIds: number[] = [];

    // let studentToken: string;
    // let teacherToken: string;
    let adminToken: string;
    let courseId: number;

    beforeAll(async () => {
        // const student = await ApiHelper.getStudentToken();
        // const teacher = await ApiHelper.getTeacherToken();
        const admin = await ApiHelper.getAdminToken();

        // studentToken = student.token;
        // teacherToken = teacher.token;
        adminToken = admin.token;
        
        const course = await ApiHelper.createCourse(adminToken);
        courseId = course.courseId;

        createdUserIds.push(admin.userId);
        createdCourseIds.push(courseId);
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
    });

    describe('PUT: change material', function () {
        it.todo('test');
    });

    describe('DELETE: remove material', function () {
        it.todo('test');
    });

    afterAll(async () => {
        for (const id of createdCourseIds) {
            try {
                await Course.destroy({
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
