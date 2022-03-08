import { SchemasV1 } from '../v1/schemas';

export const ApiMessages = {
    common: {
        unexpectedError: 'Unexpected error',
        unauthorized: 'Unauthorized',
        tokenIsNotSet: 'JWT is not set',
        forbiddenForRole: (role: string) => `This action is forbidden for role ${role}`,
        noSuchRole: 'No such role in the database',
        unableToParseId: 'Unable to parse id, please add id parameter',
        numericParameter: 'Parameter should be numeric',
        stringParameter: 'Parameter should be a string',
        onlyAlphabetAllowed: 'Only RU/EN alphabet symbols allowed, please change your request',
        removeSuccess: 'Success: record was removed.',
        requiredFields: (fields: string) => `Please send required fields: ` + fields,
    },
    auth: {
        noAuthNeeded: 'No authentication needed',
        authPassed: 'Authentication passed!',
        expiredToken: 'Token is expired'
    },
    login: {
        wrongMinPasswordLength: 'Minimum password length is: ' + SchemasV1.UserRequest.properties.password.minLength,
        wrongMaxPasswordLength: 'Maximum password length is: ' + SchemasV1.UserRequest.properties.password.maxLength,
        wrongRole: (roles: any) => `Wrong role, please send the right role: ${roles}`,
        userExist: 'User with such credentials already exist',
        unableToCreateUser: 'Unable to create user: ',
        wrongCredentials: 'Unable to authenticate user, wrong credentials',
    },
    user: {
        noUser: 'Unable to find user record',
        noTeacher: 'Unable to find teacher record',
        noTeacherRole: 'Unable to find teacher role',
        unableToUpdate: 'Unable to update user: ',
        uniqueFields: 'login and email fields should be unique',
        unableToRemove: 'Unable to remove teacher record: ',
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
    permission: {
        noPermission: (permission: string) => `Unable to find permission ${permission}`,
    }
};
