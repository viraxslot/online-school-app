import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiRequest {
    path?: string;
    body?: Record<string, any>;
    queryParameters?: Record<string, any>;
    options?: AxiosRequestConfig;
}

export type ApiResponse = AxiosResponse & { body: any };