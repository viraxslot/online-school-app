import { ErrorResponseData } from '../../../../src/rest-api/shared/interfaces';
import {
    ChangeMaterialRequestData,
    MaterialRequestData,
    MaterialResponseData,
} from '../../../../src/rest-api/v1/course/material.interfaces';
import { ApiRequest, ApiResponse } from '../../request-interfaces';

export interface ApiMaterialRequest extends ApiRequest {
    body: MaterialRequestData;
}

export interface ApiMaterialResponse extends ApiResponse {
    body: MaterialResponseData & ErrorResponseData;
}

export interface ApiMaterialListResponse extends ApiResponse {
    body: MaterialResponseData[] & ErrorResponseData;
}

export interface ApiChangeMaterialRequest extends ApiRequest {
    body: ChangeMaterialRequestData;
}
