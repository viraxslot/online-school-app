export const v1Methods = {
    health: {
        health: 'health',
    },
    auth: {
        noAuth: 'no-auth',
        apiKey: 'api-key',
        basic: 'basic',
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
        coursesById: 'courses/:courseId',
        enroll: 'courses/:courseId/enroll',
        leave: 'courses/:courseId/leave',
        materials: 'courses/:courseId/materials',
        materialsById: 'courses/:courseId/materials/:materialId',
    },
};
