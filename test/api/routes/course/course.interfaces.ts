import { ErrorResponseData } from '../../../../src/api/shared/interfaces';
import {
    ChangeCourseRequestData,
    CourseRequestData,
    CourseResponseData,
    UserCourseResponseData,
} from '../../../../src/api/v1/course/course.interfaces';
import { ApiRequest, ApiResponse } from '../../request-interfaces';

export interface ApiCourseRequest extends ApiRequest {
    body: CourseRequestData;
}

export interface ApiCourseResponse extends ApiResponse {
    body: CourseResponseData & ErrorResponseData;
}

export interface ApiCourseListResponse extends ApiResponse {
    body: CourseResponseData[] & ErrorResponseData;
}

export interface ApiUserCourseListResponse extends ApiResponse {
    body: UserCourseResponseData[] & ErrorResponseData;
}

export interface ApiChangeCourseRequest extends ApiRequest {
    body: ChangeCourseRequestData;
}
