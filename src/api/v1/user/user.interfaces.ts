import { ResponseBody } from "../../shared/interfaces";

export type TeacherListResponse = ResponseBody<{ 
    id: number;
    nickname: string;
    email: string;
    role: number;
    firstName: string;
    lastName: string;
}[]>;