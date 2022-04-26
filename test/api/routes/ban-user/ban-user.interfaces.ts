import { ErrorResponseData } from "../../../../src/api/shared/interfaces";
import { ChangeUserBanRequestData, ChangeUserBanResponseData } from "../../../../src/api/v1/ban-user/ban-user.interfaces";
import { ApiRequest, ApiResponse } from "../../request-interfaces";

export interface ApiBanUserRequest extends ApiRequest {
    body: ChangeUserBanRequestData;
}

export interface ApiBanUserResponse extends ApiResponse {
    body: ChangeUserBanResponseData & ErrorResponseData;
}
