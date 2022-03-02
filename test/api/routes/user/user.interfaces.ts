import { UserRoles } from '../../../../src/api/v1/user/user.interfaces';
import { ApiRequest, ApiResponse } from '../../request-interfaces';

interface UserData {
    nickname: string;
    email: string;
    password: string;
    role: UserRoles.Student | UserRoles.Teacher;
    firstName?: string;
    lastName?: string;
}

export interface ApiUserRequest extends ApiRequest {
    body: UserData;
}

export interface ApiUserResponse extends ApiResponse {
    body: UserData & { id: number } & { errors?: any };
}

export interface ApiUserListResponse extends ApiResponse {
    body: {
        id: number;
        nickname: string;
        email: string;
        firstName: string;
        lastName: string;
        role: number;
    }[];
}
