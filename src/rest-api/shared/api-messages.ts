import { SchemasV1 } from '../v1/schemas';

export const ApiMessages = {
    common: {
        unexpectedError: 'Unexpected error',
        unauthorized: 'Unauthorized',
        tokenIsNotSet: 'JWT is not set',
        forbiddenForUser: 'This action is forbidden for this user',
        forbiddenForRole: (role: string) => `This action is forbidden for role ${role}`,
        noSuchRole: 'No such role in the database',
        unableParseId: 'Unable to parse id, please add id parameter',
        numericParameter: 'Parameter should be numeric',
        stringParameter: 'Parameter should be a string',
        booleanParameter: 'Parameter should be boolean',
        onlyAlphabetAndDigitsAllowed: 'Only RU/EN alphabet, space and digits allowed, please change your request',
        onlySpacesNotAllowed: 'You are not allowed to use spaces only',
        removeSuccess: 'Success: record was removed.',
        requiredFields: (fields: string) => `Please send required fields: ` + fields,
        noSuchEndpoint:
            'There is no such endpoint! Please check the requested URL or Method. API docs can be found at /api/v1/api-docs',
    },
    auth: {
        noAuthNeeded: 'No authentication needed',
        authPassed: 'Authentication passed!',
        expiredToken: 'Token is expired',
        unableToFindAPIKey: 'Unable to find API key',
    },
    login: {
        wrongMinPasswordLength: 'Minimum password length is: ' + SchemasV1.UserRequest.properties.password.minLength,
        wrongMaxPasswordLength: 'Maximum password length is: ' + SchemasV1.UserRequest.properties.password.maxLength,
        wrongRole: (roles: any) => `Wrong role, please send the right role: ${roles}`,
        userExist: 'User with such credentials already exist',
        unableCreateUser: 'Unable to create user: ',
        wrongCredentials: 'Unable to authenticate user, wrong credentials',
        userBanned: "User is banned, you can't get a new session",
    },
    user: {
        wrongMinUsernameLength: 'Minimum username length is: ' + SchemasV1.UserRequest.properties.username.minLength,
        wrongMaxUsernameLength: 'Maximum username length is: ' + SchemasV1.UserRequest.properties.username.maxLength,
        noUser: 'Unable to find user record',
        noTeacher: 'Unable to find teacher record',
        noTeacherRole: 'Unable to find teacher role',
        unableUpdateUser: 'Unable to update user: ',
        uniqueFields: 'login and email fields should be unique',
        unableRemoveUser: 'Unable to remove user record: ',
    },
    category: {
        noCategory: 'Unable to find category record(s)',
        unableCreateCategory: 'Unable to create category: ',
        unableChangeCategory: 'Unable to change category: ',
        unableRemoveCategory: 'Unable to remove category: ',
        wrongMinCategoryLength: 'Minimum category length is: ' + SchemasV1.CategoryRequest.properties.title.minLength,
        wrongMaxCategoryLength: 'Maximum category length is: ' + SchemasV1.CategoryRequest.properties.title.maxLength,
        uniqueFields: 'title should be unique',
    },
    course: {
        noCourse: 'Unable to find course record(s)',
        noCourseForUser: "You didn't enroll this course",
        wrongMinCourseTitleLength:
            'Minimum course title length is: ' + SchemasV1.CourseRequest.properties.title.minLength,
        wrongMaxCourseTitleLength:
            'Maximum course title length is: ' + SchemasV1.CourseRequest.properties.title.maxLength,
        wrongMinCourseDescriptionLength:
            'Minimum course description length is: ' + SchemasV1.CourseRequest.properties.description.minLength,
        wrongMaxCourseDescriptionLength:
            'Maximum course description length is: ' + SchemasV1.CourseRequest.properties.description.maxLength,
        unableFindCourse: 'Unable to find course: ',
        unableCreateCourse: 'Unable to create course: ',
        unableChangeCourse: 'Unable to change course: ',
        unableRemoveCourse: 'Unable to remove course record: ',
        unableEnrollCourse: 'Error, unable to enroll the course: ',
        unableEnrollHiddenCourse: 'Unable to enroll the hidden course',
        uniqueFields: 'title should be unique',
        notOwnerError: "You're not owner of this course, you can't change/remove it",
        alreadyEnrolled: "You've already enrolled to this course",
        successEnroll: "You've successfully enrolled the course",
        successLeave: "You've successfully left the course",
        likeValues: 'Wrong like parameter value, please use one of these: yes, no, remove',
    },
    material: {
        noMaterial: 'Unable to find material record(s)',
        wrongMinMaterialTitleLength:
            'Minimum material title length is: ' + SchemasV1.MaterialRequest.properties.title.minLength,
        wrongMaxMaterialTitleLength:
            'Maximum material title length is: ' + SchemasV1.MaterialRequest.properties.title.maxLength,
        wrongMinMaterialDataLength:
            'Minimum material data length is: ' + SchemasV1.MaterialRequest.properties.data.minLength,
        wrongMaxMaterialDataLength:
            'Maximum material data length is: ' + SchemasV1.MaterialRequest.properties.data.maxLength,
        unableCreateMaterial: 'Unable to create material: ',
        unableChangeMaterial: 'Unable to change material: ',
        unableRemoveMaterial: 'Unable to remove material: ',
        notOwnerError: "You're not owner of this material and course, you can't change/remove it",
    },
    bannedUsers: {
        unableToGetBannedUsers: 'Unable to get banned users: ',
        unableToBanYourself: "You can't ban yourself",
        alreadyBanned: 'User is already banned',
        wasNotBanned: 'User was not banned',
        bannedSuccessfully: 'User successfully banned',
        unBannedSuccessfully: 'User successfully unbanned',
        unableChangeBanStatus: 'Unable to ban/unban user: ',
        wrongMinReasonLength: 'Minimum reason length is: ' + SchemasV1.ChangeUserBanRequest.properties.reason.minLength,
        wrongMaxReasonLength: 'Maximum reason length is: ' + SchemasV1.ChangeUserBanRequest.properties.reason.maxLength,
    },
    likes: {
        unableToChangeLike: 'Unable to change like for the course: ',
        likedCourse: "You've liked the course",
        dislikedCourse: "You've disliked the course",
        likeRemoved: "You've removed your like/dislike from the course",
    },
    permission: {
        noPermission: (permission: string) => `Unable to find permission ${permission}`,
    },
};
