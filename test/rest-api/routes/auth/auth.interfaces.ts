import { DefaultResponseData, ErrorResponseData } from '../../../../src/rest-api/shared/interfaces';
import { ApiResponse } from '../../request-interfaces';

export interface ApiDefaultResponse extends ApiResponse {
    body: DefaultResponseData & ErrorResponseData;
}
