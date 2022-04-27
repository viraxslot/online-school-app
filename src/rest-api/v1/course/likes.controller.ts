import { Request } from "express";
import { isNil } from "lodash";
import { Like, LikeValue } from "../../../db/models";
import { ApiMessages } from "../../shared/api-messages";
import { DefaultResponse } from "../../shared/interfaces";
import { Helper } from "../helper";

/**
 * @swagger
 * /api/v1/courses/{courseId}?like={string}:
 *   post:
 *     tags:
 *       - Course likes
 *     summary: Allow to like, dislike or remove your reaction from the course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: number
 *         required: true
 *         description: course id
 *       - in: query
 *         name: like
 *         schema:
 *           type: string
 *         required: true
 *         description: pass "yes" to like the course, "no" to dislike the course and "remove" to remove your reaction
 *     responses:
 *       200:
 *         content:
 *           json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 *         description: 
 */
export async function handleChangeLikeRequest(req: Request, res: DefaultResponse) {
    const { payload } = Helper.getJwtAndPayload(req);

    try {
        const userId = payload.userId;
        const courseId = parseInt(req.params.courseId);
        const like = req.query.like;

        const likeRecord = await Like.findOne({
            where: {
                userId,
                courseId
            }
        });

        if (like === LikeValue.Yes || like === LikeValue.No) {
            if (!isNil(likeRecord)) {
                await likeRecord.update({ like });
            }
            else {
                await Like.create({
                    userId,
                    courseId,
                    like
                });
            }
            const responseMessage = like === LikeValue.Yes
                ? ApiMessages.likes.likedCourse
                : ApiMessages.likes.dislikedCourse;

            return res.status(200).json({ result: responseMessage });
        }

        if (like === LikeValue.Remove) {
            if (!isNil(likeRecord)) {
                await likeRecord.destroy();
            }

            return res.status(200).json({ result: ApiMessages.likes.likeRemoved });
        }
    }
    catch (err) {
        return res.status(500).json({ errors: ApiMessages.likes.unableToChangeLike });
    }
}