import { RequestBody, ResponseBody, ResponseData } from '../../shared/interfaces';

export interface CourseRequestData {
    title: string;
    categoryId: number;
    description?: string;
    visible?: boolean;
}
export interface CourseResponseData extends ResponseData {
    id: number;
    title: string;
    description: string;
    visible: boolean;
    categoryId: number;
}

export interface ChangeCourseRequestData {
    id: number;
    title?: string;
    description?: string;
    visible?: boolean;
    categoryId: number;
}

export type CourseRequest = RequestBody<CourseRequestData>;
export type ChangeCourseRequest = RequestBody<ChangeCourseRequestData>;
export type CourseResponse = ResponseBody<CourseResponseData>;
export type CourseListResponse = ResponseBody<CourseResponseData[]>;
