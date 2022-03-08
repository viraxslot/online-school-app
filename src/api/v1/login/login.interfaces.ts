import { RequestBody, ResponseBody, ResponseData } from '../../shared/interfaces';

export interface SignInRequestData {
    username: string;
    password: string
}
export interface SignInResponseData extends ResponseData {
    accessToken: string;
}

export type SignInRequest = RequestBody<SignInRequestData>;
export type SignInResponse = ResponseBody<SignInResponseData>;
