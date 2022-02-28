import { LoginRoles } from '../../../../src/api/v1/login/login.interfaces';
import { ApiRequest, ApiResponse } from '../../request-interfaces';

interface SignUpData {
    nickname: string;
    email: string;
    password: string;
    role: LoginRoles.Student | LoginRoles.Teacher;
    firstName?: string;
    lastName?: string;
}

export interface LoginRequest extends ApiRequest {
    body: SignUpData;
}

export interface LoginResponse extends ApiResponse {
    body: SignUpData & { id: number } & { errors?: any };
}
