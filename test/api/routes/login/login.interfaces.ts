import { ErrorResponseData } from '../../../../src/api/shared/interfaces';
import { SignInRequestData, SignInResponseData } from '../../../../src/api/v1/login/login.interfaces';
import { ApiRequest, ApiResponse } from '../../request-interfaces';

export interface ApiSignInRequest extends ApiRequest {
    body: SignInRequestData;
}

export interface ApiSignInResponse extends ApiResponse {
    body: SignInResponseData & ErrorResponseData;
}
