import { isNil } from "lodash";
import { DbHelper } from "../../../src/rest-api/v1/db-helper";
import { SchemasV1 } from "../../../src/rest-api/v1/schemas";
import { BannedUser, JwtAuth, User, UserRoles } from "../../../src/db/models";
import { BanUserRoute } from "../../rest-api/routes/banned-users/banned-users.route";
import { LoginRoute } from "../../rest-api/routes/login/login.route";
import { UserRoute } from "../../rest-api/routes/user/user.route";
import { ApiHelper } from "../../helpers/api-helper";
import { SchemaValidator } from "../../helpers/schema-validator";
import { TestData } from "../../helpers/test-data";

describe('REST API: ban/unban users suite', () => {
    const createdUserIds: number[] = [];
    let adminToken: string;

    let userId: number;
    beforeAll(async () => {
        const result = await ApiHelper.createStudent();
        userId = result.userId;
        createdUserIds.push(userId);

        const admin = await ApiHelper.createAdmin();
        adminToken = admin.token;
        createdUserIds.push(admin.userId);
    });

    const negativeRoleTestCases = [
        {
            title: 'student role',
            role: UserRoles.Student
        },
        {
            title: 'teacher role',
            role: UserRoles.Teacher
        }
    ];

    describe('GET: list of banned users', () => {
        it('should return 401 error if token is not passed', async () => {
            const result = await BanUserRoute.getBannedUsersList();
            expect(result.status).toBe(401);
        });

        it('should be possible to get list of banned users for admin', async () => {
            const banUserData = TestData.getBanUserData({ userId, ban: true, jwt: adminToken });
            const banResult = await BanUserRoute.changeUserBan(banUserData);
            expect(banResult.status).toBe(200);

            const result = await BanUserRoute.getBannedUsersList(adminToken);
            expect(result.status).toBe(200);
            SchemaValidator.check(result.body, SchemasV1.BannedUsersListResponse);

            const bannedUser = result.body.find(el => el.userId === userId);
            expect(bannedUser).not.toBeNull();
        });

        negativeRoleTestCases.forEach(test => {
            it(`should not be possible to get banned users list for ${test.title}`, async () => {
                const { userId, token } = await ApiHelper.createUser(test.role);
                createdUserIds.push(userId);

                const result = await BanUserRoute.getBannedUsersList(token);
                expect(result.status).toBe(403);
                expect(result.body.errors).toBe(`This action is forbidden for role ${test.role}`);
            });
        });
    });

    describe('POST: ban and unban users', () => {
        it('should validate that userId query parameter is number', async () => {
            const banUserData = TestData.getBanUserData();
            const result = await BanUserRoute.changeUserBan(banUserData);

            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('query');
            expect(error.msg).toBe('Parameter should be numeric');
            expect(error.param).toBe('userId');
        });

        it('should return an error if no user found for ban', async () => {
            const banUserData = TestData.getBanUserData({ userId: -1 });
            const result = await BanUserRoute.changeUserBan(banUserData);

            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('query');
            expect(error.msg).toBe('Unable to find user record');
            expect(error.param).toBe('userId');
        });

        it('should validate that ban query parameter is boolean', async () => {
            const banUserData = TestData.getBanUserData({ userId });
            const result = await BanUserRoute.changeUserBan(banUserData);

            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('query');
            expect(error.msg).toBe('Parameter should be boolean');
            expect(error.param).toBe('ban');
        });

        it('should validate that ban query parameter is boolean', async () => {
            const banUserData = TestData.getBanUserData({ userId });
            const result = await BanUserRoute.changeUserBan(banUserData);

            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('query');
            expect(error.msg).toBe('Parameter should be boolean');
            expect(error.param).toBe('ban');
        });

        it('should validate that reason body parameter is a string', async () => {
            const banUserData = TestData.getBanUserData({ userId, ban: true });
            banUserData.reason = null;
            const result = await BanUserRoute.changeUserBan(banUserData);

            expect(result.status).toBe(400);

            const error = result.body.errors[0];
            expect(error.location).toBe('body');
            expect(error.msg).toBe('Parameter should be a string');
            expect(error.param).toBe('reason');
        });

        it('should return 401 error if token is not passed', async () => {
            const banUserData = TestData.getBanUserData({ userId, ban: true });
            const result = await BanUserRoute.changeUserBan(banUserData);

            expect(result.status).toBe(401);
        });

        const reasonLengthValidation = [
            {
                title: 'minimum length',
                value: 'a'.repeat(SchemasV1.ChangeUserBanRequest.properties.reason.minLength - 1),
                expectedMessage: 'Minimum reason length is: 5'
            },
            {
                title: 'maximum length',
                value: 'a'.repeat(SchemasV1.ChangeUserBanRequest.properties.reason.maxLength + 1),
                expectedMessage: 'Maximum reason length is: 200'
            }
        ];

        reasonLengthValidation.forEach(test => {
            it(`should validate reason field ${test.title}`, async () => {
                const banUserData = TestData.getBanUserData({ userId, ban: true, reason: test.value });
                const result = await BanUserRoute.changeUserBan(banUserData);
                expect(result.status).toBe(400);

                const error = result.body.errors[0];
                expect(error.location).toBe('body');
                expect(error.msg).toBe(test.expectedMessage);
                expect(error.param).toBe('reason');
            });
        });

        negativeRoleTestCases.forEach(test => {
            it(`should not be possible to ban user for ${test.role}`, async () => {
                const { userId, token } = await ApiHelper.createUser(test.role);
                createdUserIds.push(userId);

                const banData = TestData.getBanUserData({ userId, ban: true, jwt: token });
                const banResult = await BanUserRoute.changeUserBan(banData);

                expect(banResult.status).toBe(403);
                expect(banResult.body.errors).toBe(`This action is forbidden for role ${test.role}`);
            });
        });

        it('should be possible for admin to ban user first time', async () => {
            const admin = await ApiHelper.createAdmin();
            const { userId } = await ApiHelper.createStudent();
            createdUserIds.push(userId, admin.userId);

            const banUserData = TestData.getBanUserData({ userId, ban: true, jwt: admin.token });
            const result = await BanUserRoute.changeUserBan(banUserData);
            expect(result.status).toBe(200);

            SchemaValidator.check(result.body, SchemasV1.ChangeUserBanResponse);
            const adminName = await DbHelper.getUserName(admin.userId);

            const body = result.body;
            expect(body.userId).toBe(userId);
            expect(body.reason).toBe(banUserData.reason);
            expect(body.isBanned).toBe(true);
            expect(body.result).toBe('User successfully banned');
            expect(body.bannedBy).toBe(adminName);

            await checkUserBannedOrNot(userId, true);
        });

        it('should not be possible to ban yourself', async () => {
            const { userId, token } = await ApiHelper.createAdmin();
            createdUserIds.push(userId);

            const banUserData = TestData.getBanUserData({ userId, ban: true, jwt: token });
            const result = await BanUserRoute.changeUserBan(banUserData);

            expect(result.status).toBe(400);
            expect(result.body.errors).toBe('You can\'t ban yourself');
        });

        it('should be possible for admin to unban user', async () => {
            const { userId } = await ApiHelper.createStudent();
            createdUserIds.push(userId);

            const banUserData = TestData.getBanUserData({ userId, ban: true, jwt: adminToken });
            const banResult = await BanUserRoute.changeUserBan(banUserData);
            expect(banResult.status).toBe(200);

            await checkUserBannedOrNot(userId, true);

            const unbanUserData = TestData.getBanUserData({ userId, ban: false, jwt: adminToken });
            const unBanResult = await BanUserRoute.changeUserBan(unbanUserData);
            expect(unBanResult.status).toBe(200);
            SchemaValidator.check(unBanResult.body, SchemasV1.ChangeUserBanResponse);

            const body = unBanResult.body;
            expect(body.userId).toBe(userId);
            expect(body.reason).toBe('empty');
            expect(body.isBanned).toBe(false);
            expect(body.result).toBe('User successfully unbanned');
            expect(body.bannedBy).toBe('');

            await checkUserBannedOrNot(userId, false);
        });

        it('should return info message if user is already banned', async () => {
            const { userId } = await ApiHelper.createStudent();
            createdUserIds.push(userId);

            const banUserData = TestData.getBanUserData({ userId, ban: true, jwt: adminToken });
            const banResult = await BanUserRoute.changeUserBan(banUserData);
            expect(banResult.status).toBe(200);

            await checkUserBannedOrNot(userId, true);

            banUserData.reason = 'new reason';
            const secondBanResult = await BanUserRoute.changeUserBan(banUserData);
            expect(secondBanResult.status).toBe(200);
            SchemaValidator.check(secondBanResult.body, SchemasV1.ChangeUserBanResponse);

            const body = secondBanResult.body;
            expect(body.isBanned).toBe(true);
            expect(body.reason).not.toBe(banUserData.reason);
            expect(body.result).toBe('User is already banned');
            await checkUserBannedOrNot(userId, true);
        });

        it('should return info message if user wan not banned', async () => {
            const { userId } = await ApiHelper.createStudent();
            createdUserIds.push(userId);

            const unBanUserData = TestData.getBanUserData({ userId, ban: false, jwt: adminToken });
            const unBanResult = await BanUserRoute.changeUserBan(unBanUserData);
            expect(unBanResult.status).toBe(200);
            SchemaValidator.check(unBanResult.body, SchemasV1.ChangeUserBanResponse);

            await checkUserBannedOrNot(userId, false);

            const body = unBanResult.body;
            expect(body.isBanned).toBe(false);
            expect(body.reason).toBe('empty');
            expect(body.userId).toBe(userId);
            expect(body.bannedBy).toBe('');
            expect(body.result).toBe('User was not banned');
        });

        it('should remove all user session after the ban', async () => {
            const user = await TestData.getUserData();
            const signUpResponse = await UserRoute.postUser(user);
            expect(signUpResponse.status).toBe(200);
            const userId = signUpResponse.body.id;

            const signInResponse = await LoginRoute.postSession({
                body: {
                    username: user.body.login,
                    password: user.body.password,
                },
            });
            expect(signInResponse.status).toBe(200);

            const userSessions = await JwtAuth.findAll({
                raw: true,
                where: {
                    userId
                }
            });
            expect(userSessions.length).not.toBe(0);

            const banUserData = TestData.getBanUserData({ userId, ban: true, jwt: adminToken });
            const banResult = await BanUserRoute.changeUserBan(banUserData);
            expect(banResult.status).toBe(200);

            const userSessions2 = await JwtAuth.findAll({
                raw: true,
                where: {
                    userId
                }
            });
            expect(userSessions2.length).toBe(0);
        });
    });

    async function checkUserBannedOrNot(userId: number, banned: boolean) {
        const bannedUser = await BannedUser.findOne({
            raw: true,
            where: {
                userId
            }
        });
        const bannedUserExist = !isNil(bannedUser);
        if (banned) {
            expect(bannedUserExist).toBe(true);
        }
        else {
            expect(bannedUserExist).toBe(false);
        }
    }

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