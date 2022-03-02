import { v1Endpoints, v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiUserRequest, ApiUserResponse } from '../user/user.interfaces';

export class LoginRoute extends ApiRoute {
    static async postSignUp(reqBody: ApiUserRequest): Promise<ApiUserResponse> {
        return this.postMethod({
            path: v1Endpoints.login + '/' + v1Methods.login.signup,
            body: reqBody.body
        });
    }
}
