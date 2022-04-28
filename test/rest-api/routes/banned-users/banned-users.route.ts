import { v1Methods } from "../../../../src/rest-api/v1/endpoints";
import { ApiRoute } from "../../api-route";
import { ApiBannedUsersList, ApiBanUserResponse } from "./banned-users.interfaces";

interface BanUserOptions {
    userId: number;
    ban: boolean;
    reason: string;
    jwt?: string;
}

export class BanUserRoute extends ApiRoute {
    static async getBannedUsersList(jwt?: string): Promise<ApiBannedUsersList> {
        return this.getMethod({
            path: v1Methods.bannedUsers.bannedUsers,
            options: {
                headers: {
                    Authorization: jwt ?? '',
                },
            },
        });
    }

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
