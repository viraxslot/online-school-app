import { ErrorResponseData } from '../../../../src/rest-api/shared/interfaces';
import {
    BannedUserResponse,
    ChangeUserBanRequestData,
    ChangeUserBanResponseData,
} from '../../../../src/rest-api/v1/ban-user/banned-users.interfaces';
import { ApiRequest, ApiResponse } from '../../request-interfaces';

export interface ApiBanUserRequest extends ApiRequest {
    body: ChangeUserBanRequestData;
}

export interface ApiBanUserResponse extends ApiResponse {
    body: ChangeUserBanResponseData & ErrorResponseData;
}

export interface ApiBannedUsersList extends ApiResponse {
    body: BannedUserResponse[] & ErrorResponseData;
}
