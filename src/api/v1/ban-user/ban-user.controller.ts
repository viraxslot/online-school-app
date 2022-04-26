import { isNil } from "lodash";
import { BannedUser } from "../../../db/models";
import { ApiMessages } from "../../shared/api-messages";
import { DbHelper } from "../db-helper";
import { Helper } from "../helper";
import { ChangeUserBanRequest, ChangeUserBanResponse } from "./ban-user.interfaces";

/**
 * @swagger
 * /api/v1/change-user-ban?userId={number}&ban={boolean}:
 *   post:
 *     tags:
 *       - Ban/unban user
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
    let userId;
    try {
        userId = parseInt(req.query.userId as string);
    }
    catch (err) {
        return res.status(500).json({ errors: ApiMessages.common.unableParseId });
    }

    const ban = req.query.ban === 'true';
    const reason = req.body.reason;
    const user: any = await BannedUser.findOne({
        raw: true,
        where: {
            userId
        }
    });

    const { payload } = Helper.getJwtAndPayload(req);
    const adminName = await DbHelper.getUserName(payload.userId);
    const body = {
        result: '',
        isBanned: false,
        userId,
        reason: 'empty',
        bannedBy: ''
    };

    try {
        if (isNil(user)) {
            if (ban) {
                await BannedUser.create({
                    reason,
                    userId,
                    bannedBy: adminName,
                });

                body.result = ApiMessages.banUser.bannedSuccessfully;
                body.isBanned = true;
                body.reason = reason;
                body.bannedBy = adminName;
            }
            else {
                body.result = ApiMessages.banUser.wasNotBanned;
            }
        }
        else {
            if (ban) {
                body.result = ApiMessages.banUser.alreadyBanned;
                body.reason = user.reason;
                body.isBanned = true;
                body.bannedBy = user.bannedBy;
            }
            else {
                await BannedUser.destroy({
                    where: {
                        userId
                    }
                });
                body.result = ApiMessages.banUser.unBannedSuccessfully;
            }
        }
    }
    catch (err) {
        return res.status(500).json({ errors: ApiMessages.banUser.unableBanUnban });
    }

    return res.status(200).json(body);
}