export const ApiErrors = {
    common: {
        noSuchRole: 'No such role in the database'
    },
    login: {
        wrongRole: (roles: any) => `Wrong role, please send the right role: ${roles}`,
        userExist: 'User with such credentials already exist'
    },
};
