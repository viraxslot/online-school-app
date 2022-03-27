const SharedFields = {
    User: {
        login: {
            type: 'string',
        },
        email: {
            type: 'string',
        },
        role: {
            type: 'number',
        },
        firstName: {
            type: ['string', 'null'],
        },
        lastName: {
            type: ['string', 'null'],
        },
    },
};

const UserSchemas = {
    UserRequest: {
        properties: {
            ...SharedFields.User,
            password: {
                type: 'string',
                minLength: 8,
                maxLength: 20,
            },
        },
        required: ['login', 'email', 'password', 'role'],
        type: 'object',
    },

    ChangeUserRequest: {
        properties: {
            id: {
                type: 'number',
            },
            ...SharedFields.User,
        },
        required: ['id'],
        type: 'object',
    },

    UserResponse: {
        properties: {
            id: {
                type: 'number',
            },
            ...SharedFields.User,
        },
        required: ['id', 'login', 'email', 'role', 'firstName', 'lastName'],
        type: 'object',
    },
};

const CategorySchemas = {
    CategoryRequest: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                minLength: 3,
                maxLength: 100,
            },
        },
        required: ['title'],
    },

    ChangeCategoryRequest: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            title: {
                type: 'string',
            },
        },
        required: ['id', 'title'],
    },

    CategoryResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            title: {
                type: 'string',
            },
        },
        required: ['id', 'title'],
    },
};

const CourseSchemas = {
    CourseRequest: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                minLength: 3,
                maxLength: 100,
            },
            description: {
                type: 'string',
                minLength: 3,
                maxLength: 500,
            },
            visible: {
                type: 'boolean',
            },
            categoryId: {
                type: 'number',
            },
        },
        required: ['title', 'categoryId'],
    },

    ChangeCourseRequest: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            title: {
                type: 'string',
                minLength: 3,
                maxLength: 100,
            },
            description: {
                type: 'string',
                minLength: 3,
                maxLength: 500,
            },
            visible: {
                type: 'boolean',
            },
            categoryId: {
                type: 'number',
            },
        },
        required: ['id'],
    },

    CourseResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            title: {
                type: 'string',
                minLength: 3,
                maxLength: 100,
            },
            description: {
                type: 'string',
                minLength: 3,
                maxLength: 500,
            },
            visible: {
                type: 'boolean',
            },
            categoryId: {
                type: 'number',
            },
        },
        required: ['id', 'title', 'description', 'visible', 'categoryId'],
    },
};

const MaterialSchemas = {
    MaterialRequest: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                minLength: 3,
                maxLength: 100,
            },
            data: {
                type: 'string',
                minLength: 10,
                maxLength: 1000,
            },
            order: {
                type: 'number',
            },
        },
        required: ['title', 'data'],
    },

    ChangeMaterialRequest: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            title: {
                type: 'string',
                minLength: 3,
                maxLength: 100,
            },
            data: {
                type: 'string',
                minLength: 10,
                maxLength: 1000,
            },
            order: {
                type: 'number',
            },
        },
        required: ['id'],
    },

    MaterialResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            title: {
                type: 'string',
                minLength: 3,
                maxLength: 100,
            },
            data: {
                type: 'string',
                minLength: 10,
                maxLength: 1000,
            },
            order: {
                type: ['number', 'null'],
            },
            courseId: {
                type: 'number',
            },
        },
        required: ['id', 'title', 'data', 'order'],
    },
};

const LoginSchemas = {
    SessionRequest: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
            },
            password: {
                type: 'string',
            },
        },
        required: ['username', 'password'],
    },
    SessionResponse: {
        type: 'object',
        properties: {
            accessToken: {
                type: 'string',
            },
        },
        required: ['accessToken'],
    },
};

export const SchemasV1 = {
    DefaultResponse: {
        properties: {
            result: {
                type: 'string',
            },
        },
        required: ['result'],
        type: 'object',
    },
    HealthResponse: {
        properties: {
            result: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                    },
                    currentDate: {
                        type: 'string',
                    },
                },
            },
        },
        required: ['result'],
        type: 'object',
    },
    ...LoginSchemas,
    ...UserSchemas,
    UserListResponse: {
        type: 'array',
        items: UserSchemas.UserResponse,
    },
    ...CategorySchemas,
    CategoryListResponse: {
        type: 'array',
        items: CategorySchemas.CategoryResponse,
    },
    ...CourseSchemas,
    CourseListResponse: {
        type: 'array',
        items: CourseSchemas.CourseResponse,
    },
    ...MaterialSchemas,
    MaterialListResponse: {
        type: 'array',
        items: MaterialSchemas.MaterialResponse,
    },
};
