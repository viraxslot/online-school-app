import { RequestBody, ResponseBody, ResponseData } from '../../shared/interfaces';

export interface SessionRequestData {
    username: string;
    password: string;
}
export interface SessionResponseData extends ResponseData {
    accessToken: string;
}

export type SessionRequest = RequestBody<{}, SessionRequestData>;
export type SessionResponse = ResponseBody<SessionResponseData>;
