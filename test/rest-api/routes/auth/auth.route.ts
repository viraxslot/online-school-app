import { v1Methods } from '../../../../src/rest-api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiDefaultResponse } from './auth.interfaces';

export class AuthRoute extends ApiRoute {
    static async getNoAuth(): Promise<ApiDefaultResponse> {
        return this.getMethod({
            path: v1Methods.auth.noAuth,
        });
    }

    static async getApiKeyAuth(apiKey?: string): Promise<ApiDefaultResponse> {
        return this.getMethod({
            path: v1Methods.auth.apiKey,
            options: {
                headers: {
                    'X-Api-Key': apiKey ?? '',
                },
            },
        });
    }

    static async getBasicAuth(username: string, password: string): Promise<ApiDefaultResponse> {
        return this.getMethod({
            path: v1Methods.auth.basic,
            options: {
                auth: {
                    username,
                    password,
                },
            },
        });
    }

    static async getJwtAuth(jwtToken?: string): Promise<ApiDefaultResponse> {
        return this.getMethod({
            path: v1Methods.auth.jwt,
            options: {
                headers: {
                    Authorization: jwtToken ? `Bearer ` + jwtToken : '',
                },
            },
        });
    }

    static async getCookieAuth(cookie: string): Promise<ApiDefaultResponse> {
        return this.getMethod({
            path: v1Methods.auth.cookie,
            options: {
                headers: {
                    cookie: cookie,
                },
            },
        });
    }

    static async signIn(username: string, password: string): Promise<ApiDefaultResponse> {
        return this.postMethod({
            path: v1Methods.auth.signIn,
            body: {
                username,
                password,
            },
        });
    }
}
