import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { assign } from 'lodash';
import { ApiRequest, ApiResponse } from './request-interfaces';
import config from '../../config/config';

export class ApiRoute {
    private static instance: AxiosInstance;

    private static defaultConfig = {
        baseURL: config.apiUrl,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        withCredentials: true,
        validateStatus: (): boolean => true,
    };

    public static async commonHttpMethod(method: string, parameters: ApiRequest): Promise<ApiResponse> {
        const axiosConfig = this.mergeConfigs(this.defaultConfig, parameters.options ?? {});
        this.instance = axios.create(axiosConfig);

        let response: any;
        switch (method) {
            case 'GET':
                response = await this.instance.get(parameters.path ?? '', { params: parameters.queryParameters });
                break;

            case 'POST':
                response = await this.instance.post(parameters.path ?? '', parameters.body);
                break;
            case 'PUT':
                response = await this.instance.put(parameters.path ?? '', parameters.body);
                break;

            case 'DELETE':
                response = await this.instance.delete(parameters.path ?? '');
                break;
        }

        return assign(response, { body: response.data });
    }

    public static async getMethod(parameters: ApiRequest): Promise<ApiResponse> {
        return this.commonHttpMethod('GET', parameters);
    }

    public static async postMethod(parameters: ApiRequest): Promise<ApiResponse> {
        return this.commonHttpMethod('POST', parameters);
    }

    public static async putMethod(parameters: ApiRequest): Promise<ApiResponse> {
        return this.commonHttpMethod('PUT', parameters);
    }

    public static async deleteMethod(parameters: ApiRequest): Promise<ApiResponse> {
        return this.commonHttpMethod('DELETE', parameters);
    }

    private static mergeConfigs(config1: AxiosRequestConfig, config2: AxiosRequestConfig): AxiosRequestConfig {
        return assign({}, config1, config2);
    }
}
