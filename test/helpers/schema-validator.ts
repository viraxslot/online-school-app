import Ajv from 'ajv';
import { logger } from '../../src/helpers/winston-logger';
export class SchemaValidator {
    static check(data: any, schema: any) {
        const ajv = new Ajv();

        const validate = ajv.compile(schema);
        const valid = validate(data);

        if (!valid) {
            logger.error(data);
        }

        expect(validate?.errors).toBeNull();
    }
}
