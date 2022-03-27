import { ParamsDictionary } from 'express-serve-static-core';
import { RequestBody, ResponseBody, ResponseData } from '../../shared/interfaces';
export interface MaterialRequestData {
    title: string;
    data: string;
    order?: number | null;
}
export interface MaterialResponseData extends ResponseData {
    id: number;
    title: string;
    data: string;
    order: number;
    courseId: number;
}

export interface ChangeMaterialRequestData {
    id: number;
    title?: string;
    data?: string;
    order?: number | null;
}

interface MaterialParameters extends ParamsDictionary {
    courseId: string;
}

interface GetMaterialParameters extends MaterialParameters {
    materialId: string;
}

export type GetMaterialRequest = RequestBody<GetMaterialParameters, {}>;
export type MaterialRequest = RequestBody<MaterialParameters, MaterialRequestData>;
export type ChangeMaterialRequest = RequestBody<{}, ChangeMaterialRequestData>;
export type MaterialResponse = ResponseBody<MaterialResponseData>;
export type MaterialListResponse = ResponseBody<MaterialResponseData[]>;
