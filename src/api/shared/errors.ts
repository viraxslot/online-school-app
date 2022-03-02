export const ApiErrors = {
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
    }
};
