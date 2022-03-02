import { RequestBody, ResponseBody, ResponseData } from '../../shared/interfaces';

export enum UserRoles {
    Student = 'student',
    Teacher = 'teacher',
}

export interface UserRequestData {
    nickname: string;
    email: string;
    password: string
    role: number;
    firstName: string;
    lastName: string;
}
export interface UserResponseData extends ResponseData {
    id: number;
    nickname: string;
    email: string;
    password: string
    role: number;
    firstName: string;
    lastName: string;
}

export interface ChangeUserRequestData {
    id: number;
    nickname?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

export type UserRequest = RequestBody<UserRequestData>;
export type ChangeUserRequest = RequestBody<ChangeUserRequestData>;
export type UserResponse = ResponseBody<UserResponseData>;
export type UserListResponse = ResponseBody<UserResponseData[]>;
