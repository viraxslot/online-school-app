import jwt from 'jsonwebtoken';
import { RequestBody, TokenPayload } from '../shared/interfaces';

export class Helper {
    /**
     * Remove fields from the object
     * @param user
     * @param fields
     */
    static removeRedundantFields(user: any, fields: string[]): void {
        fields.forEach((field) => {
            delete user[field];
        });
    }

    /**
     * Get jwt and its payload from Autorization header from express request 
     * @param req 
     * @returns 
     */
    static getJwtAndPayload(req: RequestBody<any, any>): { token: string; payload: TokenPayload; } {
        const authHeader = req.headers.authorization?.replace('Bearer ', '') as string;
        const decoded = jwt.decode(authHeader) as TokenPayload;

        return {
            token: authHeader,
            payload: decoded,
        };
    }
}
