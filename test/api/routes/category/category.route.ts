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
    static async getCategoriesList(): Promise<ApiCategoryListResponse> {
        return this.getMethod({
            path: v1Methods.category.categories,
        });
    }

    static async getCategory(id: number): Promise<ApiCategoryResponse> {
        return this.getMethod({
            path: v1Methods.category.categoryId.replace(':id', id.toString()),
        });
    }

    static async postCategory(req: ApiCategoryRequest): Promise<ApiCategoryResponse> {
        return this.postMethod({
            path: v1Methods.category.category,
            body: req.body,
        });
    }

    static async putCategory(req: ApiChangeCategoryRequest): Promise<ApiCategoryResponse> {
        return this.putMethod({
            path: v1Methods.category.category,
            body: req.body,
        });
    }

    static async deleteCategory(id: number): Promise<ApiDefaultResponse> {
        return this.deleteMethod({
            path: v1Methods.category.categoryId.replace(':id', id.toString()),
        });
    }
}
