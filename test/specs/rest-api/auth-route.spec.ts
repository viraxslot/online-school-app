import appConfig from '../../../config/app-config';
import { ApiMessages } from '../../../src/rest-api/shared/api-messages';
import { SchemasV1 } from '../../../src/rest-api/v1/schemas';
import { User } from '../../../src/db/models';
import { AuthRoute } from '../../rest-api/routes/auth/auth.route';
import { LoginRoute } from '../../rest-api/routes/login/login.route';
import { SchemaValidator } from '../../helpers/schema-validator';
import { TestData } from '../../helpers/test-data';
import jwt from 'jsonwebtoken';
import { UserRoute } from '../../rest-api/routes/user/user.route';

describe('REST API: auth route suite', function () {
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
            const apiKey = appConfig.apiKey;
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

        it('should return correct response if credentials passed', async () => {
            const basicCredentials = JSON.parse(appConfig.basicAuth);
            const result = await AuthRoute.getBasicAuth(basicCredentials[0].username, basicCredentials[0].password);

            expect(result.status).toBe(200);
            expect(result.body.result).toBe(ApiMessages.auth.authPassed);
            SchemaValidator.check(result.body, SchemasV1.DefaultResponse);
        });
    });

    describe('jwt:', function () {
        const createdUserIds: number[] = [];
        it('should return 401 error if no jwt passed', async () => {
            const result = await AuthRoute.getJwtAuth();
            expect(result.status).toBe(401);
            expect(result.body.errors).toBe('Unauthorized');
        });

        it('should return 401 error if jwt cannot be decoded', async () => {
            const result = await AuthRoute.getJwtAuth('test');
            expect(result.status).toBe(401);
            expect(result.body.errors).toBe('Unauthorized');
        });

        it('should return 401 error if jwt is not found', async () => {
            const fakeJwt = jwt.sign({ test: 'test' }, appConfig.jwtSecret);
            const result = await AuthRoute.getJwtAuth(fakeJwt);
            expect(result.status).toBe(401);
            expect(result.body.errors).toBe('Unauthorized');
        });

        it('should be possible to authenticate with a valid jwt', async () => {
            const user = await TestData.getUserData();
            const signUpResponse = await UserRoute.postUser(user);
            expect(signUpResponse.status).toBe(200);
            createdUserIds.push(signUpResponse.body.id);

            const signInResponse = await LoginRoute.postSession({
                body: {
                    username: user.body.login,
                    password: user.body.password,
                },
            });
            expect(signInResponse.status).toBe(200);

            const token = signInResponse.body.accessToken;
            const jwtResponse = await AuthRoute.getJwtAuth(token);
            expect(jwtResponse.status).toBe(200);
            expect(jwtResponse.body.result).toBe('Authentication passed!');
        });

        afterAll(async () => {
            for (const userId of createdUserIds) {
                await User.destroy({
                    where: {
                        id: userId,
                    },
                });
            }
        });
    });
});
