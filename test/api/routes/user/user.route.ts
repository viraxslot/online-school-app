import { v1Endpoints, v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiChangeUserRequest, ApiUserListResponse, ApiUserResponse } from './user.interfaces';

export class UserRoute extends ApiRoute {
    static async getTeachersList(): Promise<ApiUserListResponse> {
        return this.getMethod({
            path: v1Endpoints.user + '/' + v1Methods.user.teachers,
        });
    }

    static async putTeacher(reqBody?: ApiChangeUserRequest): Promise<ApiUserResponse> {
        return this.putMethod({
            path: v1Endpoints.user + '/' + v1Methods.user.teacher,
            body: reqBody?.body
        });
    }
}
