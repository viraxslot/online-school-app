import { v1Methods } from '../../../../src/rest-api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiDefaultResponse } from '../auth/auth.interfaces';
import { ApiChangeUserRequest, ApiUserListResponse, ApiUserRequest, ApiUserResponse } from './user.interfaces';

export class UserRoute extends ApiRoute {
    static async getTeachersList(jwt?: string): Promise<ApiUserListResponse> {
        return this.getMethod({
            path: v1Methods.user.teachers,
            options: {
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
            },
        });
    }

    static async postUser(reqBody: ApiUserRequest, jwt?: string): Promise<ApiUserResponse> {
        return this.postMethod({
            path: v1Methods.user.users,
            body: reqBody.body,
            options: {
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
            },
        });
    }

    static async patchTeacher(req?: ApiChangeUserRequest, jwt?: string): Promise<ApiUserResponse> {
        return this.patchMethod({
            path: v1Methods.user.teachers,
            body: req?.body,
            options: {
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
            },
        });
    }

    static async deleteTeacher(id?: number, jwt?: string): Promise<ApiDefaultResponse> {
        return this.deleteMethod({
            path: v1Methods.user.teachersById.replace(':id', id ? id.toString() : ''),
            options: {
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
            },
        });
    }
}
