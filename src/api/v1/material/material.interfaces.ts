import { RequestBody, ResponseBody, ResponseData } from '../../shared/interfaces';

export interface MaterialRequestData {
    title: string;
    courseId: number;
    data: string;
    order?: number | null;
}
export interface MaterialResponseData extends ResponseData {
    id: number;
    title: string;
    data: string;
    order: number;
}

export interface ChangeMaterialRequestData {
    id: number;
    title?: string;
    data?: string;
    order?: number | null;
    courseId?: number;
}

export type MaterialRequest = RequestBody<MaterialRequestData>;
export type ChangeMaterialRequest = RequestBody<ChangeMaterialRequestData>;
export type MaterialResponse = ResponseBody<MaterialResponseData>;
export type MaterialListResponse = ResponseBody<MaterialResponseData[]>;
