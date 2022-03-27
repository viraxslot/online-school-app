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
        signup: 'signup',
        signin: 'signin',
    },
    user: {
        users: 'users', // unused
        teachers: 'teachers',
        teachersById: 'teachers/:id',
    },
    category: {
        categories: 'categories',
        categoriesById: 'categories/:id',
    },
    course: {
        courses: 'courses',
        coursesById: 'courses/:id',
        materials: 'courses/:courseId/materials',
        materialsById: 'courses/:courseId/materials/:materialId',
    },
};
