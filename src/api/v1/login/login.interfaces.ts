import { RequestBody, ResponseBody } from "../../shared/interfaces";

export enum LoginRoles {
    Student = 'student',
    Teacher = 'teacher'
}

export type SignUpRequest = RequestBody<{ 
    nickname: string;
    email: string;
    password: string;
    role: LoginRoles.Student | LoginRoles.Teacher;
    firstName?: string;
    lastName?: string;
}>;

export type SignUpResponse = ResponseBody<{ 
    id: number;
    nickname: string;
    email: string;
    roleId: number;
    firstName: string;
    lastName: string;
}>;