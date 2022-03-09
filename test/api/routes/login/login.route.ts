import { v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiUserRequest, ApiUserResponse } from '../user/user.interfaces';
import { ApiSignInRequest, ApiSignInResponse } from './login.interfaces';

export class LoginRoute extends ApiRoute {
    static async postSignUp(reqBody: ApiUserRequest, jwt?: string): Promise<ApiUserResponse> {
        return this.postMethod({
            path: v1Methods.login.signup,
            body: reqBody.body,
            options: {
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : ''
                }
            }
        });
    }

    static async postSignIn(reqBody: ApiSignInRequest): Promise<ApiSignInResponse> {
        return this.postMethod({
            path: v1Methods.login.signin,
            body: reqBody.body,
        });
    }
}
