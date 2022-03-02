import { ErrorResponseData } from '../../../../src/api/shared/interfaces';
import {
    UserListResponse,
    UserRequestData,
    UserResponseData
} from '../../../../src/api/v1/user/user.interfaces';
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
