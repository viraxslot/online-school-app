import { Request, Response } from 'express';

export type RequestBody<T> = Request<{}, {}, T>;
export type ResponseBody<T> = Response<T, {}>;

export type DefaultResponse = ResponseBody<{ result: string }>;
