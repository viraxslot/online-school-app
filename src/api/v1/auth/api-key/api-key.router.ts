import express from 'express';
const apiKeyRouter = express.Router();

import passport from 'passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { ApiKey } from '../../../../db/models';
import { v1Methods } from '../../endpoints';
import { handleApiKeyAuth } from './api-key.controller';

passport.use(
    new HeaderAPIKeyStrategy({ header: 'X-Api-Key', prefix: '' }, true, async function (apiKey, cb) {
        const foundKey = await ApiKey.findOne({
            where: {
                apiKey: apiKey
            }
        });

        if (!foundKey) {
            return cb(null, false);
        }

        return cb(null, foundKey);
    })
);

apiKeyRouter.use('/' + v1Methods.auth.apiKey, passport.authenticate('headerapikey', { session: false }), handleApiKeyAuth);

export default apiKeyRouter;
