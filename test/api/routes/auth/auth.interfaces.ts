import { ApiResponse } from '../../request-interfaces';

export interface DefaultResponse extends ApiResponse {
    body: {
        result: string;
    }
}
