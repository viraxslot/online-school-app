import { ApiMessages } from '../../src/api/shared/api-messages';
import { SchemasV1 } from '../../src/api/v1/schemas';
import { AuthRoute } from '../api/routes/auth/auth.route';
import { SchemaValidator } from '../helpers/schema-validator';
const config = require('../../config/config');

describe('API: auth route suite', function () {
    describe('no-auth:', function () {
        it('should return result with no authentication', async () => {
            const result = await AuthRoute.getNoAuth();
            expect(result.status).toBe(200);
            expect(result.body.result).toBe(ApiMessages.auth.noAuthNeeded);
            SchemaValidator.check(result.body, SchemasV1.DefaultResponse);
        });
    });

    describe('api-key:', function () {
        it('should return 401 error if no api key passed', async () => {
            const result = await AuthRoute.getApiKeyAuth();
            expect(result.status).toBe(401);
            expect(result.body).toBe(ApiMessages.common.unauthorized);
        });

        it('should return correct response if api key were passed', async () => {
            const apiKey = config.apiKey;
            const result = await AuthRoute.getApiKeyAuth(apiKey);
            expect(result.status).toBe(200);
            expect(result.body.result).toBe(ApiMessages.auth.authPassed);
            SchemaValidator.check(result.body, SchemasV1.DefaultResponse);
        });
    });

    describe('basic:', function () {
        it('should return 401 error if no credentials passed', async () => {
            const result = await AuthRoute.getBasicAuth('test', 'test');
            expect(result.status).toBe(401);
        });

        it('should return correct response if no credentials passed', async () => {
            const basicCredentials = JSON.parse(config.basicAuth);

            const result = await AuthRoute.getBasicAuth(basicCredentials[0].username, basicCredentials[0].password);
            expect(result.status).toBe(200);
            expect(result.body.result).toBe(ApiMessages.auth.authPassed);
            SchemaValidator.check(result.body, SchemasV1.DefaultResponse);
        });
    });
});
