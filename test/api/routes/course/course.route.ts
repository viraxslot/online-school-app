import { v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiDefaultResponse } from '../auth/auth.interfaces';
import { ApiChangeCourseRequest, ApiCourseListResponse, ApiCourseRequest, ApiCourseResponse } from './course.interfaces';

export class CourseRoute extends ApiRoute {
    static async getCourseList(jwt?: string): Promise<ApiCourseListResponse> {
        return this.getMethod({
            path: v1Methods.course.courses,
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async getCourse(id: number, jwt?: string): Promise<ApiCourseResponse> {
        return this.getMethod({
            path: v1Methods.course.courseId.replace(':id', id.toString()),
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async postCourse(req: ApiCourseRequest, jwt?: string): Promise<ApiCourseResponse> {
        return this.postMethod({
            path: v1Methods.course.course,
            body: req.body,
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async putCourse(req?: ApiChangeCourseRequest, jwt?: string): Promise<ApiCourseResponse> {
        return this.putMethod({
            path: v1Methods.course.course,
            body: req?.body,
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async deleteCourse(id: number, jwt?: string): Promise<ApiDefaultResponse> {
        return this.deleteMethod({
            path: v1Methods.course.courseId.replace(':id', id.toString()),
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }
}
