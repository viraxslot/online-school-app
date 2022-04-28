import swaggerJsdoc, { OAS3Options } from 'swagger-jsdoc';
import path from 'path';
import { SchemasV1 } from '../rest-api/v1/schemas';
import { logger } from './winston-logger';

/**
 * Analyzes contoller files in api folder and returns swagger information
 * @param currentVersion version that shown in swagger header
 * @param versionFolders get jsdoc information from the passed folders, search them in api folder
 * @returns
 */
export function getSwaggerData(currentVersion: string, versionFolders: string[]) {
    const apiFilesList = versionFolders.map((version) =>
        path.resolve(process.cwd(), 'src', 'rest-api', `${version}`, '**', '*controller.ts')
    );
    logger.log('info', 'Controllers list' + JSON.stringify(apiFilesList));

    const options: OAS3Options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Online school API',
                version: currentVersion,
            },
            components: {
                schemas: SchemasV1,
            },
        },
        apis: apiFilesList,
    };

    const swaggerData = swaggerJsdoc(options);
    return swaggerData;
}
