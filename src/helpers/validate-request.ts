import { RequestBody } from '../api/shared/interfaces';
import { validationResult } from 'express-validator';

export function validateRequest(request: any, res: any): boolean {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return false;
    }
    else {
        return true;
    }
}
