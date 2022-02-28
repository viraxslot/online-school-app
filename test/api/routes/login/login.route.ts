import { v1Endpoints, v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { LoginRequest, LoginResponse } from './login.interfaces';

export class LoginRoute extends ApiRoute {
    static async postSignUp(reqBody: LoginRequest): Promise<LoginResponse> {
        return this.postMethod({
            path: v1Endpoints.login + '/' + v1Methods.login.signup,
            body: reqBody.body
        });
    }
}
