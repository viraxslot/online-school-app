import { Request, Response } from 'express';

export type RequestBody<T> = Request<{}, {}, T>;
export type ResponseBody<T> = Response<(T & { createdAt?: string; updatedAt?: string }) | { errors?: any }, {}>;

export type DefaultResponse = ResponseBody<{ result: string }>;
