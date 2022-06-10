import { v1Methods } from '../../../../src/rest-api/v1/endpoints';
import { ApiRoute } from '../../api-route';
import { ApiDefaultResponse } from '../auth/auth.interfaces';
import {
    ApiCategoryListResponse,
    ApiCategoryRequest,
    ApiCategoryResponse,
    ApiChangeCategoryRequest,
} from './category.interfaces';

export class CategoryRoute extends ApiRoute {
    static async getCategoriesList(jwt?: string): Promise<ApiCategoryListResponse> {
        return this.getMethod({
            path: v1Methods.category.categories,
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async getCategory(id: number, jwt?: string): Promise<ApiCategoryResponse> {
        return this.getMethod({
            path: v1Methods.category.categoriesById.replace(':id', id.toString()),
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async postCategory(req: ApiCategoryRequest, jwt?: string): Promise<ApiCategoryResponse> {
        return this.postMethod({
            path: v1Methods.category.categories,
            body: req.body,
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async patchCategory(req?: ApiChangeCategoryRequest, jwt?: string): Promise<ApiCategoryResponse> {
        return this.patchMethod({
            path: v1Methods.category.categories,
            body: req?.body,
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

    static async deleteCategory(id: number, jwt?: string): Promise<ApiDefaultResponse> {
        return this.deleteMethod({
            path: v1Methods.category.categoriesById.replace(':id', id.toString()),
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }
}
