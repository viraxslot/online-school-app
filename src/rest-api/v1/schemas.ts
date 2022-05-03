const SharedFields = {
    User: {
        username: {
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
        required: ['username', 'email', 'password', 'role'],
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
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            ...SharedFields.User,
        },
        required: ['id', 'username', 'email', 'role', 'firstName', 'lastName'],
        additionalProperties: false
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
            }
        },
        required: ['id', 'title'],
        additionalProperties: false
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
            likes: {
                type: 'number'
            },
            dislikes: {
                type: 'number'
            }
        },
        required: ['id', 'title', 'description', 'visible', 'categoryId'],
        additionalProperties: false
    },

    UserCourseListResponse: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                userId: {
                    type: 'number'
                },
                courseId: {
                    type: 'number'
                }
            },
            required: ['userId', 'courseId'],
            additionalProperties: false
        }
    }
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
        additionalProperties: false
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
                type: 'string'
            },
        },
        required: ['accessToken'],
        additionalProperties: false
    },
};

const BanUserSchemas = {
    ChangeUserBanRequest: {
        type: 'object',
        properties: {
            reason: {
                type: 'string',
                minLength: 5,
                maxLength: 200,
            }
        },
        required: ['reason'],
    },
    ChangeUserBanResponse: {
        type: 'object',
        properties: {
            result: {
                type: 'string',
            },
            userId: {
                type: 'number'
            },
            isBanned: {
                type: 'boolean'
            },
            reason: {
                type: 'string',
                minLength: 5,
                maxLength: 200,
            },
            createdBy: {
                type: 'string'
            }
        },
        required: ['result', 'userId', 'isBanned', 'reason'],
        additionalProperties: false
    },
    BannedUserResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'number'
            },
            userId: {
                type: 'number'
            },
            reason: {
                type: 'string',
                minLength: 5,
                maxLength: 200,
            },
            createdBy: {
                type: 'string'
            }
        },
        required: ['userId', 'reason', 'createdBy'],
        additionalProperties: false
    },
};

export const SchemasV1 = {
    DefaultResponse: {
        type: 'object',
        properties: {
            result: {
                type: 'string',
            },
        },
        required: ['result'],
        additionalProperties: false
    },
    HealthResponse: {
        type: 'object',
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
        additionalProperties: false
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
    ...BanUserSchemas,
    BannedUsersListResponse: {
        type: 'array',
        items: BanUserSchemas.BannedUserResponse
    }
};
