import { v1Endpoints, v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { TeachersListResponse } from './user.interfaces';

export class UserRoute extends ApiRoute {
    static async getTeachersList(): Promise<TeachersListResponse> {
        return this.getMethod({
            path: v1Endpoints.user + '/' + v1Methods.user.teachersList,
        });
    }
}
