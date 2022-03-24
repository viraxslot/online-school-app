import { v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiMaterialRequest, ApiMaterialResponse } from './material.interfaces';

export class MaterialRoute extends ApiRoute {
    // static async getCourseList(jwt?: string): Promise<ApiCourseListResponse> {
    //     return this.getMethod({
    //         path: v1Methods.course.courses,
    //         options: {
    //             headers: {
    //                 Authorization: jwt ?? '',
    //             },
    //         },
    //     });
    // }

    // static async getCourse(id: number, jwt?: string): Promise<ApiCourseResponse> {
    //     return this.getMethod({
    //         path: v1Methods.course.courseId.replace(':id', id.toString()),
    //         options: {
    //             headers: {
    //                 Authorization: jwt ?? '',
    //             },
    //         },
    //     });
    // }

    static async postMaterial(req: ApiMaterialRequest, jwt?: string): Promise<ApiMaterialResponse> {
        return this.postMethod({
            path: v1Methods.material.material,
            body: req.body,
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    // static async putCourse(req?: ApiChangeCourseRequest, jwt?: string): Promise<ApiCourseResponse> {
    //     return this.putMethod({
    //         path: v1Methods.course.course,
    //         body: req?.body,
    //         options: {
    //             headers: {
    //                 Authorization: jwt ?? '',
    //             },
    //         },
    //     });
    // }

    // static async deleteCourse(id: number, jwt?: string): Promise<ApiDefaultResponse> {
    //     return this.deleteMethod({
    //         path: v1Methods.course.courseId.replace(':id', id.toString()),
    //         options: {
    //             headers: {
    //                 Authorization: jwt ?? '',
    //             },
    //         },
    //     });
    // }
}
