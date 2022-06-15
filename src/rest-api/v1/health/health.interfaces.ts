import { ResponseBody, ResponseData } from '../../shared/interfaces';

interface HealthResponseData extends ResponseData {
    result: {
        status: string;
        currentDate: string;
        version: string;
    };
}

export type HealthResponse = ResponseBody<HealthResponseData>;
