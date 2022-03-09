import { UserRoles } from '../../../db/models';
import { RequestBody, ResponseBody, ResponseData } from '../../shared/interfaces';

export interface UserRequestData {
    login: string;
    email: string;
    password: string
    role: UserRoles;
    firstName: string;
    lastName: string;
}
export interface UserResponseData extends ResponseData {
    id: number;
    login: string;
    email: string;
    password: string
    role: number;
    firstName: string;
    lastName: string;
}

export interface ChangeUserRequestData {
    id: number;
    login?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

export type UserRequest = RequestBody<UserRequestData>;
export type ChangeUserRequest = RequestBody<ChangeUserRequestData>;
export type UserResponse = ResponseBody<UserResponseData>;
export type UserListResponse = ResponseBody<UserResponseData[]>;
