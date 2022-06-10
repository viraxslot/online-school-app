import { ErrorResponseData } from '../../../../src/rest-api/shared/interfaces';
import {
    ChangeUserRequestData,
    UserRequestData,
    UserResponseData,
} from '../../../../src/rest-api/v1/user/user.interfaces';
import { ApiRequest, ApiResponse } from '../../request-interfaces';

export interface ApiUserRequest extends ApiRequest {
    body: UserRequestData;
}

export interface ApiUserResponse extends ApiResponse {
    body: UserResponseData & ErrorResponseData;
}

export interface ApiUserListResponse extends ApiResponse {
    body: UserResponseData[] & ErrorResponseData;
}

export interface ApiChangeUserRequest extends ApiRequest {
    body: ChangeUserRequestData;
}
