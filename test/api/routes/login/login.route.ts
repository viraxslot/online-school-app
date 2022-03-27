import { v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiSignInRequest, ApiSignInResponse } from './login.interfaces';

export class LoginRoute extends ApiRoute {
    static async postSession(reqBody: ApiSignInRequest): Promise<ApiSignInResponse> {
        return this.postMethod({
            path: v1Methods.login.session,
            body: reqBody.body,
        });
    }
}
