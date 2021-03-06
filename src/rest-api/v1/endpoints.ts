export const v1Methods = {
    health: {
        health: 'health',
    },
    auth: {
        noAuth: 'no-auth',
        apiKey: 'api-key',
        basic: 'basic',
        signIn: 'sign-in',
        cookie: 'cookie',
        jwt: 'jwt',
    },
    login: {
        session: 'session',
    },
    user: {
        users: 'users',
        teachers: 'teachers',
        teachersById: 'teachers/:id',
    },
    category: {
        categories: 'categories',
        categoriesById: 'categories/:id',
    },
    course: {
        courses: 'courses',
        coursesById: 'courses/:courseId(\\d+)',
        enroll: 'courses/:courseId/enroll',
        leave: 'courses/:courseId/leave',
        mine: 'courses/mine',
        materials: 'courses/:courseId/materials',
        materialsById: 'courses/:courseId/materials/:materialId',
        like: 'courses/:courseId/like/:like',
    },
    bannedUsers: {
        bannedUsers: 'banned-users',
        banUserWildcard: 'change-user-ban*',
        banUser: 'change-user-ban',
    },
};
