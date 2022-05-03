import { RequestBody, ResponseBody, ResponseData } from '../../shared/interfaces';

export interface ChangeUserBanRequestData {
    reason: string;
}
export interface ChangeUserBanResponseData extends ResponseData {
    result: string;
    userId: number;
    isBanned: boolean;
    createdBy: string;
    reason: string;
}

export interface BannedUserResponse extends ResponseData {
    userId: number;
    reason: string;
    createdBy: string;
}

export type ChangeUserBanRequest = RequestBody<{}, ChangeUserBanRequestData>;
export type ChangeUserBanResponse = ResponseBody<ChangeUserBanResponseData>;
export type BannedUsersListResponse = ResponseBody<BannedUserResponse[]>;
