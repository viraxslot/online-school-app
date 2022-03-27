import { ErrorResponseData } from '../../../../src/api/shared/interfaces';
import { SessionRequestData, SessionResponseData } from '../../../../src/api/v1/login/login.interfaces';
import { ApiRequest, ApiResponse } from '../../request-interfaces';

export interface ApiSignInRequest extends ApiRequest {
    body: SessionRequestData;
}

export interface ApiSignInResponse extends ApiResponse {
    body: SessionResponseData & ErrorResponseData;
}
