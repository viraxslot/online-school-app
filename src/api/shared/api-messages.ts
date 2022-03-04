import { SchemasV1 } from '../v1/schemas';

export const ApiMessages = {
    common: {
        unauthorized: 'Unauthorized',
        noSuchRole: 'No such role in the database',
        numericIdParameter: 'ID parameter should be numeric',
        stringParameter: 'Parameter should be a string',
        onlyAlphabetAllowed: 'Only RU/EN alphabet symbols allowed, please change your request',
    },
    auth: {
        noAuthNeeded: 'No authentication needed',
        authPassed: 'Authentication passed!',
    },
    login: {
        wrongRole: (roles: any) => `Wrong role, please send the right role: ${roles}`,
        userExist: 'User with such credentials already exist',
        unableToCreateUser: 'Unable to create user: ',
    },
    user: {
        noTeacher: 'Unable to find teacher record',
        noTeacherRole: 'Unable to find teacher role',
        unableToParseTeacherId: 'Unable to parse teacher id, please add id parameter',
        unableToUpdate: 'Unable to update user: ',
        uniqueFields: 'login and email fields should be unique',
        unableToRemove: 'Unable to remove teacher record: ',
        removeSuccess: 'Success: teacher record was removed.',
    },
    category: {
        requiredFields: `Please send required fields: ` + SchemasV1.CategoryRequest.required.toString(),
        unableCreateCategory: 'Unable to create category: ',
        unableRemoveCategory: 'Unable to remove category: ',
        wrongMinCategoryLength: 'Minimum category length is: ' + SchemasV1.CategoryRequest.properties.title.minLength,
        wrongMaxCategoryLength: 'Maximum category length is: ' + SchemasV1.CategoryRequest.properties.title.maxLength,
        uniqueFields: 'title should be unique',
    },
};
