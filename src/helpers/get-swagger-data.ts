import swaggerJsdoc, { OAS3Options } from 'swagger-jsdoc';
import path from 'path';
import { SchemasV1 } from '../api/v1/schemas';

export function getSwaggerData(version: 'v1') {
    const options: OAS3Options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Online school API',
                version: '1.0.0',
            },
            components: {
                schemas: {
                    DefaultResponse: SchemasV1.DefaultResponse,
                },
            },
        },
        apis: [path.resolve(__dirname, `../api/${version}/**/*controller.ts`)],
    };

    const swaggerData = swaggerJsdoc(options);
    return swaggerData;
}
