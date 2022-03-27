import { RequestBody, ResponseBody, ResponseData } from '../../shared/interfaces';

export interface CategoryRequestData {
    title: string;
}
export interface CategoryResponseData extends ResponseData {
    id: number;
    title: string;
}

export interface ChangeCategoryRequestData {
    id: number;
    title: string;
}

export type CategoryRequest = RequestBody<{}, CategoryRequestData>;
export type ChangeCategoryRequest = RequestBody<{}, ChangeCategoryRequestData>;
export type CategoryResponse = ResponseBody<CategoryResponseData>;
export type CategoryListResponse = ResponseBody<CategoryResponseData[]>;
