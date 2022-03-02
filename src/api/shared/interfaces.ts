import { Request, Response } from 'express';

export interface ErrorResponseData {
    errors?: any;
}

export interface ResponseData {
    createdAt?: string;
    updatedAt?: string;
}
export interface DefaultResponseData extends ResponseData {
    result: string;
}

export type RequestBody<T> = Request<{}, {}, T>;
export type ResponseBody<T> = Response<((T & ResponseData) | ErrorResponseData), {}>;
export type DefaultResponse = ResponseBody<DefaultResponseData>;
