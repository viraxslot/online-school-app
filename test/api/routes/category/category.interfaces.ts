import { ErrorResponseData } from '../../../../src/api/shared/interfaces';
import {
    CategoryRequestData,
    CategoryResponseData,
    ChangeCategoryRequestData
} from '../../../../src/api/v1/category/category.interfaces';
import { ApiRequest, ApiResponse } from '../../request-interfaces';

export interface ApiCategoryRequest extends ApiRequest {
    body: CategoryRequestData;
}

export interface ApiCategoryResponse extends ApiResponse {
    body: CategoryResponseData & ErrorResponseData;
}

export interface ApiCategoryListResponse extends ApiResponse {
    body: CategoryResponseData[] & ErrorResponseData;
}

export interface ApiChangeCategoryRequest extends ApiRequest {
    body: ChangeCategoryRequestData;
}
