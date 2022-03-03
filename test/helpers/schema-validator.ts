import Ajv from 'ajv';
export class SchemaValidator {
    static check(data: any, schema: any) {
        const ajv = new Ajv();

        const validate = ajv.compile(schema);
        const valid = validate(data);

        if (!valid) {
            console.log(data);
        }

        expect(validate?.errors).toBeNull();
    }
}
