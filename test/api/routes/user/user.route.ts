import { v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiDefaultResponse } from '../auth/auth.interfaces';
import { ApiChangeUserRequest, ApiUserListResponse, ApiUserResponse } from './user.interfaces';

export class UserRoute extends ApiRoute {
    static async getTeachersList(): Promise<ApiUserListResponse> {
        return this.getMethod({
            path: v1Methods.user.teachers,
        });
    }

    static async putTeacher(req?: ApiChangeUserRequest): Promise<ApiUserResponse> {
        return this.putMethod({
            path: v1Methods.user.teacher,
            body: req?.body,
        });
    }

    static async deleteTeacher(id?: number): Promise<ApiDefaultResponse> {
        return this.deleteMethod({
            path: v1Methods.user.teacherId.replace(':id', id ? id.toString() : ''),
        });
    }
}
