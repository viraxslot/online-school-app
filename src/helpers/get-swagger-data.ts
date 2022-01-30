import swaggerJsdoc, { OAS3Options } from 'swagger-jsdoc';
import path from 'path';
import { SchemasV1 } from '../api/v1/schemas';

/**
 * Analyzes contoller files in api folder and returns swagger information
 * @param currentVersion version that shown in swagger header
 * @param versionFolders get jsdoc information from the passed folders, search them in api folder
 * @returns 
 */
export function getSwaggerData(currentVersion: string, versionFolders: string[]) {
    const apiFilesList = versionFolders.map((version) =>
        path.resolve(__dirname, '..', 'api', `${version}`, '**', '*controller.ts')
    );
    
    const options: OAS3Options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Online school API',
                version: currentVersion,
            },
            components: {
                schemas: {
                    DefaultResponse: SchemasV1.DefaultResponse,
                },
            },
        },
        apis: apiFilesList,
    };

    const swaggerData = swaggerJsdoc(options);
    return swaggerData;
}
