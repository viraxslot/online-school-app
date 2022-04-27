import { ErrorResponseData } from "../../../../src/api/shared/interfaces";
import {
    BannedUser,
    ChangeUserBanRequestData,
    ChangeUserBanResponseData
} from "../../../../src/api/v1/ban-user/banned-users.interfaces";
import { ApiRequest, ApiResponse } from "../../request-interfaces";

export interface ApiBanUserRequest extends ApiRequest {
    body: ChangeUserBanRequestData;
}

export interface ApiBanUserResponse extends ApiResponse {
    body: ChangeUserBanResponseData & ErrorResponseData;
}

export interface ApiBannedUsersList extends ApiResponse {
    body: BannedUser[] & ErrorResponseData;
}