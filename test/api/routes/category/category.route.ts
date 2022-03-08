import { v1Methods } from '../../../../src/api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiDefaultResponse } from '../auth/auth.interfaces';
import {
    ApiCategoryListResponse,
    ApiCategoryRequest,
    ApiCategoryResponse,
    ApiChangeCategoryRequest,
} from './category.interfaces';

export class CategoryRoute extends ApiRoute {
    static async getCategoriesList(jwtToken?: string): Promise<ApiCategoryListResponse> {
        return this.getMethod({
            path: v1Methods.category.categories,
            options: {
                headers: {
                    Authorization: jwtToken ?? '',
                },
            },
        });
    }

    static async getCategory(id: number, jwtToken?: string): Promise<ApiCategoryResponse> {
        return this.getMethod({
            path: v1Methods.category.categoryId.replace(':id', id.toString()),
            options: {
                headers: {
                    Authorization: jwtToken ?? '',
                },
            },
        });
    }

    static async postCategory(req: ApiCategoryRequest, jwtToken?: string): Promise<ApiCategoryResponse> {
        return this.postMethod({
            path: v1Methods.category.category,
            body: req.body,
            options: {
                headers: {
                    Authorization: jwtToken ?? '',
                },
            },
        });
    }

    static async putCategory(req?: ApiChangeCategoryRequest, jwtToken?: string): Promise<ApiCategoryResponse> {
        return this.putMethod({
            path: v1Methods.category.category,
            body: req?.body,
            options: {
                headers: {
                    Authorization: jwtToken ?? '',
                },
            },
        });
    }

    static async deleteCategory(id: number, jwtToken?: string): Promise<ApiDefaultResponse> {
        return this.deleteMethod({
            path: v1Methods.category.categoryId.replace(':id', id.toString()),
            options: {
                headers: {
                    Authorization: jwtToken ?? '',
                },
            },
        });
    }
}
