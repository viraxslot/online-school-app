import { RequestBody, ResponseBody, ResponseData } from '../../shared/interfaces';

export interface ChangeUserBanRequestData {
    reason: string;
}
export interface ChangeUserBanResponseData extends ResponseData {
    result: string;
    userId: number;
    isBanned: boolean;
    bannedBy: string;
    reason: string;
}

export interface BannedUser extends ResponseData {
    userId: number;
    bannedBy: string;
    reason: string;
}

export type ChangeUserBanRequest = RequestBody<{}, ChangeUserBanRequestData>;
export type ChangeUserBanResponse = ResponseBody<ChangeUserBanResponseData>;
export type BannedUsersListResponse = ResponseBody<BannedUser[]>;
