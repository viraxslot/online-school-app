import * as bcrypt from 'bcryptjs';
import express from 'express';
import { handleBasicAuth } from './basic-auth.controller';
const basicRouter = express.Router();
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { BasicAuth } from '../../../../db/models';
import { v1Methods } from '../../endpoints';

passport.use(
    new BasicStrategy(async function (username, password, cb) {
        const foundUser = await BasicAuth.findOne({
            raw: true,
            where: {
                username: username,
            },
        });

        let verified = false;
        if (foundUser) {
            verified = bcrypt.compareSync(password, (foundUser as any).password);
        }

        if (!verified) {
            return cb(null, false);
        }

        return cb(null, foundUser);
    })
);

basicRouter.use('/' + v1Methods.auth.basic, passport.authenticate('basic', { session: false }), handleBasicAuth);

export default basicRouter;
