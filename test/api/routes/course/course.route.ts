import { v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiDefaultResponse } from '../auth/auth.interfaces';
import {
    ApiChangeCourseRequest,
    ApiCourseListResponse,
    ApiCourseRequest,
    ApiCourseResponse,
} from './course.interfaces';
import { ApiMaterialRequest, ApiMaterialResponse } from './material.interfaces';

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
            path: v1Methods.course.coursesById.replace(':id', id.toString()),
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async postCourse(req: ApiCourseRequest, jwt?: string): Promise<ApiCourseResponse> {
        return this.postMethod({
            path: v1Methods.course.courses,
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
            path: v1Methods.course.courses,
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
            path: v1Methods.course.coursesById.replace(':id', id.toString()),
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async getMaterialsList(courseId: number, jwt?: string): Promise<ApiMaterialResponse> {
        const path = v1Methods.course.materials.replace(':courseId', courseId.toString());
        
        return this.getMethod({
            path,
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async getMaterial(courseId: number, materialId: number, jwt?: string): Promise<ApiMaterialResponse> {
        let path = v1Methods.course.materialsById.replace(':courseId', courseId.toString());
        path = path.replace(':materialId', materialId.toString());
        
        return this.getMethod({
            path,
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async postMaterial(courseId: number, req: ApiMaterialRequest, jwt?: string): Promise<ApiMaterialResponse> {
        return this.postMethod({
            path: v1Methods.course.materials.replace(':courseId', courseId.toString()),
            body: req.body,
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }
}
