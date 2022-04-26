import { v1Methods } from "../../../../src/api/v1/endpoints";
import { ApiRoute } from "../../api-route";
import { ApiBanUserResponse } from "./ban-user.interfaces";

interface BanUserOptions {
    userId: number;
    ban: boolean;
    reason: string;
    jwt?: string;
}

export class BanUserRoute extends ApiRoute {
    static async changeUserBan(options: BanUserOptions): Promise<ApiBanUserResponse> {
        return this.postMethod({
            path: v1Methods.bannedUsers.banUser,
            body: {
                reason: options?.reason
            },
            options: {
                params: {
                    userId: options?.userId,
                    ban: options?.ban
                },
                headers: {
                    Authorization: options?.jwt ?? '',
                },
            },
        });
    }
}
