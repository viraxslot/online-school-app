export const ApiErrors = {
    common: {
        unauthorized: 'Unauthorized',
        noSuchRole: 'No such role in the database'
    },
    login: {
        wrongRole: (roles: any) => `Wrong role, please send the right role: ${roles}`,
        userExist: 'User with such credentials already exist'
    },
};
