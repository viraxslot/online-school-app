export const ApiMessages = {
    auth: {
        noAuthNeeded: 'No authentication needed',
        authPassed: 'Authentication passed!'
    },
    common: {
        unauthorized: 'Unauthorized',
        noSuchRole: 'No such role in the database',
        numericIdParameter: 'ID parameter should be numeric'
    },
    login: {
        wrongRole: (roles: any) => `Wrong role, please send the right role: ${roles}`,
        userExist: 'User with such credentials already exist',
        unableToCreateUser: 'Unable to create user: '
    },
    user: {
        noTeacher: 'Unable to find teacher record',
        noTeacherRole: 'Unable to find teacher role',
        unableToParseTeacherId: 'Unable to parse teacher id, please add id parameter',
        unableToUpdate: 'Unable to update user: ',
        uniqueFields: 'login and email fields should be unique',
        unableToRemove: 'Unable to remove teacher record: ',
        removeSuccess: 'Success: teacher record was removed.'
    }
};
