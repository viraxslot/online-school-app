import { ApiErrors } from '../../src/api/shared/errors';
import { ApiMessages } from '../../src/api/shared/messages';
import { AuthRoute } from '../api/routes/auth/auth.route';
const config = require('../../config/config');

describe('API: auth route suite', function () {
    describe('no-auth:', function () {
        it('should return result with no authentication', async () => {
            // const result = await AuthRoute.getNoAuth();
            AuthRoute.getNoAuth().then((result) => {
                expect(result.status).toBe(200);
                expect(result.body.result).toBe(ApiMessages.noAuthNeeded);
            });
        });
    });

    describe('api-key:', function () {
        it('should return 401 error if no api key passed', async () => {
            // const result = await AuthRoute.getApiKeyAuth();

            AuthRoute.getApiKeyAuth()
                .then((result) => {
                    expect(result.status).toBe(401);
                    expect(result.body).toBe(ApiErrors.common.unauthorized);
                })
                .catch((err) => {
                    console.log(err.toJSON());
                });
        });

        it('should return correct response if api key were passed', () => {
            const apiKey = config.apiKey;
            // const result = await AuthRoute.getApiKeyAuth(apiKey);
            AuthRoute.getApiKeyAuth(apiKey)
                .then((result) => {
                    expect(result.status).toBe(200);
                    expect(result.body.result).toBe(ApiMessages.authPassed);
                })
                .catch((err) => {
                    console.log(err.toJSON());
                });
        });
    });
});
