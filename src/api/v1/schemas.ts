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
                        type: 'string'
                    },
                    currentDate: {
                        type: 'string'
                    }
                },
            },
        },
        required: ['result'],
        type: 'object',
    },
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
};
