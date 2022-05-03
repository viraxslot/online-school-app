import { Request } from "express";
import { filter, isNil } from "lodash";
import { BannedUser, JwtAuth } from "../../../db/models";
import { logger } from "../../../helpers/winston-logger";
import { ApiMessages } from "../../shared/api-messages";
import { DbFieldsToOmit } from "../../shared/constants";
import { DbHelper } from "../db-helper";
import { Helper } from "../helper";
import { BannedUsersListResponse, ChangeUserBanRequest, ChangeUserBanResponse } from "./banned-users.interfaces";

/**
 * @swagger
 * /api/v1/change-user-ban?userId={number}&ban={boolean}:
 *   post:
 *     tags:
 *       - Banned users
 *     summary: Allow to ban/unban a user
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the existent user
 *       - in: query
 *         name: ban
 *         schema:
 *           type: boolean
 *         required: true
 *         description: pass "true" to ban the user and "false" to unban him/her
*     requestBody:
 *       content:
 *         json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeUserBanRequest'
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/ChangeUserBanResponse'
 *         description: 
 */
export async function handleChangeUserBanRequest(req: ChangeUserBanRequest, res: ChangeUserBanResponse) {
    let banUserId;
    try {
        banUserId = parseInt(req.query.userId as string);
    }
    catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.common.unableParseId });
    }

    const ban = req.query.ban === 'true';
    const reason = req.body.reason;
    const user: any = await BannedUser.findOne({
        raw: true,
        where: {
            userId: banUserId
        }
    });

    const { payload } = Helper.getJwtAndPayload(req);
    const adminName = await DbHelper.getUserIdentifier(payload.userId);

    if (payload.userId === banUserId) {
        return res.status(400).json({ errors: ApiMessages.bannedUsers.unableToBanYourself });
    }

    const body = {
        result: '',
        isBanned: false,
        userId: banUserId,
        reason: 'empty',
        createdBy: ''
    };

    try {
        if (isNil(user)) {
            if (ban) {
                await BannedUser.create({
                    reason,
                    userId: banUserId,
                    createdBy: adminName,
                });

                await JwtAuth.destroy({
                    where: {
                        userId: banUserId
                    }
                });

                body.result = ApiMessages.bannedUsers.bannedSuccessfully;
                body.isBanned = true;
                body.reason = reason;
                body.createdBy = adminName as any;
            }
            else {
                body.result = ApiMessages.bannedUsers.wasNotBanned;
            }
        }
        else {
            if (ban) {
                body.result = ApiMessages.bannedUsers.alreadyBanned;
                body.reason = user.reason;
                body.isBanned = true;
                body.createdBy = user.bannedBy;
            }
            else {
                await BannedUser.destroy({
                    where: {
                        userId: banUserId
                    }
                });
                body.result = ApiMessages.bannedUsers.unBannedSuccessfully;
            }
        }
    }
    catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.bannedUsers.unableChangeBanStatus });
    }

    return res.status(200).json(body);
}

/**
 * @swagger
 * /api/v1/banned-users:
 *   get:
 *     tags:
 *       - Banned users
 *     summary: Allow to get list of banned users
 *     description: "Roles: admin only"
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/BannedUsersListResponse'
 *         description: 
 */
export async function handleGetBannedUsersListRequest(req: Request, res: BannedUsersListResponse) {
    try {
        const bannedUsers: any = await BannedUser.findAll({
            raw: true,
            attributes: {
                exclude: filter(DbFieldsToOmit, el => el !== 'createdBy')
            }
        });

        return res.status(200).json(bannedUsers);
    }
    catch (err) {
        logger.error(JSON.stringify(err));
        return res.status(500).json({ errors: ApiMessages.bannedUsers.unableToGetBannedUsers + err });
    }
}