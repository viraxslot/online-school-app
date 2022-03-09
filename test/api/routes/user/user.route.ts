import { v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiDefaultResponse } from '../auth/auth.interfaces';
import { ApiChangeUserRequest, ApiUserListResponse, ApiUserResponse } from './user.interfaces';

export class UserRoute extends ApiRoute {
    static async getTeachersList(jwt?: string ): Promise<ApiUserListResponse> {
        return this.getMethod({
            path: v1Methods.user.teachers,
            options: {
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : ''
                }
            }
        });
    }

    static async putTeacher(req?: ApiChangeUserRequest, jwt?: string): Promise<ApiUserResponse> {
        return this.putMethod({
            path: v1Methods.user.teacher,
            body: req?.body,
            options: {
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : ''
                }
            }
        });
    }

    static async deleteTeacher(id?: number, jwt?: string): Promise<ApiDefaultResponse> {
        return this.deleteMethod({
            path: v1Methods.user.teacherId.replace(':id', id ? id.toString() : ''),
            options: {
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : ''
                }
            }
        });
    }
}
