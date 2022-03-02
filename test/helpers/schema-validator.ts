import Ajv from 'ajv';
export class SchemaValidator {
    static check(data: any, schema: any) {
        const ajv = new Ajv();

        const validate = ajv.compile(schema);
        validate(data);
        expect(validate?.errors).toBeNull();
    }
}
