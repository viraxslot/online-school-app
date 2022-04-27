import { NextFunction, Request } from 'express';
import { validationResult } from 'express-validator';
import { DefaultResponse } from '../shared/interfaces';

export async function checkValidation(req: Request, res: DefaultResponse, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    return next();
}
