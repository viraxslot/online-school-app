import { v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiCourseListResponse, ApiCourseRequest, ApiCourseResponse } from './course.interfaces';

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

    // static async putCategory(req?: ApiChangeCategoryRequest, jwt?: string): Promise<ApiCategoryResponse> {
    //     return this.putMethod({
    //         path: v1Methods.category.category,
    //         body: req?.body,
    //         options: {
    //             headers: {
    //                 Authorization: jwt ?? '',
    //             },
    //         },
    //     });
    // }

    // static async deleteCategory(id: number, jwt?: string): Promise<ApiDefaultResponse> {
    //     return this.deleteMethod({
    //         path: v1Methods.category.categoryId.replace(':id', id.toString()),
    //         options: {
    //             headers: {
    //                 Authorization: jwt ?? '',
    //             },
    //         },
    //     });
    // }
}
