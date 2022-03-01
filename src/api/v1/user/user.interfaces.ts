import { ResponseBody } from "../../shared/interfaces";

interface TeacherData { 
    id: number;
    nickname: string;
    email: string;
    role: number;
    firstName: string;
    lastName: string;
}

export type TeacherResponse = ResponseBody<TeacherData>;
export type TeacherListResponse = ResponseBody<TeacherData[]>;