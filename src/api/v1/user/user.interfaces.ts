import { RequestBody, ResponseBody } from '../../shared/interfaces';

export enum UserRoles {
    Student = 'student',
    Teacher = 'teacher',
}

interface UserData {
    id: number;
    nickname: string;
    email: string;
    role: number;
    firstName: string;
    lastName: string;
}

export type UserRequest = RequestBody<Omit<UserData, 'id'> & { password: string }>;
export type ChangeUserRequest = RequestBody<Omit<UserData, 'role'>>;
export type UserResponse = ResponseBody<UserData>;
