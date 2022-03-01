import { ApiResponse } from '../../request-interfaces';

export interface TeachersListResponse extends ApiResponse {
    body: {
        id: number;
        nickname: string;
        email: string;
        firstName: string;
        lastName: string;
        role: number;
    }[];
}
