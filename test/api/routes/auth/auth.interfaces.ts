import { ApiResponse } from '../../request-interfaces';

export interface ApiDefaultResponse extends ApiResponse {
    body: {
        result: string;
    }
}
