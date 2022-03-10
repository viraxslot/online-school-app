import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
    userId: number;
    roleId: number;
}

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
// eslint-disable-next-line @typescript-eslint/ban-types
export type RequestBody<T> = Request<{}, {}, T>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type ResponseBody<T> = Response<((T & ResponseData) | ErrorResponseData), {}>;
export type DefaultResponse = ResponseBody<DefaultResponseData>;
