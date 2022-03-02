import { DefaultResponseData } from '../../../../src/api/shared/interfaces';
import { ApiResponse } from '../../request-interfaces';

export interface ApiDefaultResponse extends ApiResponse {
    body: DefaultResponseData
}
