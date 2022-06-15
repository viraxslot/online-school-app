import express from 'express';
import { isNil } from 'lodash';
import passport from 'passport';
import CookieStrategy from 'passport-cookie';
import { CookieSession } from '../../../../db/models/cookie-session.model';
import { v1Methods } from '../../endpoints';
import { handleCookieAuth } from './cookie-auth.controller';
const cookieRouter = express.Router();

passport.use(
    new CookieStrategy(async function (token: string, cb: any) {
        const foundSession: any = await CookieSession.findOne({
            raw: true,
            where: {
                session: token,
            },
        });

        if (isNil(foundSession)) {
            return cb(null, false);
        }

        const now = new Date();
        const expiresAt = new Date(foundSession.expiresAt);
        if (expiresAt.getTime() < now.getTime()) {
            await CookieSession.destroy({
                where: {
                    session: token,
                },
            });
            return cb(null, false);
        }

        return cb(null, true);
    })
);

cookieRouter.use('/' + v1Methods.auth.cookie, passport.authenticate('cookie', { session: false }), handleCookieAuth);
export default cookieRouter;
