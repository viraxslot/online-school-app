import { Helper } from "../../../src/rest-api/v1/helper";
import { Course, Like, LikeValue, User, UserRoles } from "../../../src/db/models";
import { CourseRoute } from "../../rest-api/routes/course/course.route";
import { ApiHelper } from "../../helpers/api-helper";

describe('REST API: likes suites', () => {
    const createdUserIds: number[] = [];
    const createdCourseIds: number[] = [];

    let courseId: number;
    let adminToken: string;
    let studentToken: string;

    beforeAll(async () => {
        const admin = await ApiHelper.createAdmin();
        adminToken = admin.token;
        const student = await ApiHelper.createStudent();
        studentToken = student.token;
        createdUserIds.push(admin.userId, student.userId);

        const course = await ApiHelper.createCourse(adminToken);
        courseId = course.courseId;
        createdCourseIds.push(courseId);
    });

    describe('POST: change like', () => {
        it('should check that course id path parameter is numeric', async () => {
            const result = await CourseRoute.changeLike('test' as any);
            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('params');
            expect(error.msg).toBe('Parameter should be numeric');
            expect(error.param).toBe('courseId');
        });

        it('should return validation error if there is no such course', async () => {
            const result = await CourseRoute.changeLike(-1);
            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('params');
            expect(error.msg).toBe('Unable to find course record(s)');
            expect(error.param).toBe('courseId');
        });

        it('should check that like parameter has correct value', async () => {
            const result = await CourseRoute.changeLike(courseId, 'test' as any);
            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('params');
            expect(error.msg).toBe('Wrong like parameter value, please use one of these: yes, no, remove');
            expect(error.param).toBe('like');
        });

        it('should return 401 error if no token passed', async () => {
            const result = await CourseRoute.changeLike(courseId, LikeValue.Yes);
            expect(result.status).toBe(401);
        });

        const testCases = [
            {
                title: 'like a course',
                expectedMessage: 'You\'ve liked the course',
                value: LikeValue.Yes
            },
            {
                title: 'dislike a course',
                expectedMessage: 'You\'ve disliked the course',
                value: LikeValue.No
            }
        ];

        testCases.forEach(test => {
            it(`should be possible to ${test.title} for student`, async () => {
                const { courseId } = await ApiHelper.createCourse(adminToken);
                createdCourseIds.push(courseId);

                const result = await CourseRoute.changeLike(courseId, test.value, studentToken);
                expect(result.status).toBe(200);
                expect(result.body.result).toBe(test.expectedMessage);

                const payload = Helper.getTokenPayload(studentToken);
                const likedCourse: any = await Like.findOne({
                    raw: true,
                    where: {
                        userId: payload.userId,
                        courseId,
                    }
                });

                expect(likedCourse).not.toBeNull();
                expect(likedCourse.like).toBe(test.value);
            });
        });

        it('should be possible to remove the like action', async () => {
            const addLikeResult = await CourseRoute.changeLike(courseId, LikeValue.Yes, studentToken);
            expect(addLikeResult.status).toBe(200);

            const payload = Helper.getTokenPayload(studentToken);
            const likedCourse: any = await Like.findOne({
                raw: true,
                where: {
                    userId: payload.userId,
                    courseId,
                }
            });
            expect(likedCourse).not.toBeNull();

            const removeLikeResult = await CourseRoute.changeLike(courseId, LikeValue.Remove, studentToken);
            expect(removeLikeResult.status).toBe(200);

            const likedCourse2: any = await Like.findOne({
                raw: true,
                where: {
                    userId: payload.userId,
                    courseId,
                }
            });
            expect(likedCourse2).toBeNull();
        });

        const negativeRoleTestCases = [
            {
                title: 'teacher role',
                role: UserRoles.Teacher,
                expectedMessage: 'This action is forbidden for role teacher'
            },
            {
                title: 'admin role',
                role: UserRoles.Admin,
                expectedMessage: 'This action is forbidden for role admin'
            }
        ];

        negativeRoleTestCases.forEach(test => {
            it(`should not be possible to change like for ${test.title}`, async () => {
                const { token } = await ApiHelper.createUser({ role: test.role });

                const result = await CourseRoute.changeLike(courseId, LikeValue.Yes, token);
                expect(result.status).toBe(403);
                expect(result.body.errors).toBe(test.expectedMessage);
            });
        });
    });

    afterAll(async () => {
        try {
            for (const id of createdUserIds) {
                await User.destroy({
                    where: {
                        id
                    }
                });
            }
            for (const id of createdCourseIds) {
                await Course.destroy({
                    where: {
                        id
                    }
                });
            }
        }
        catch (err: any) {
            console.log(JSON.stringify(err));
        }
    });
});