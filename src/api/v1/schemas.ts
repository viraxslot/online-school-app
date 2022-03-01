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

    SignUpRequest: {
        properties: {
            nickname: {
                type: 'string'
            },
            email: {
                type: 'string'
            },
            password: {
                type: 'string'
            },
            role: {
                type: 'string'
            },
            firstName: {
                type: 'string'
            },
            lastName: {
                type: 'string'
            }
        },
        required: ['nickname', 'email', 'password', 'role'],
        type: 'object',
    },

    SignUpResponse: {
        properties: {
            id: {
                type: 'number'
            },
            nickname: {
                type: 'string'
            },
            email: {
                type: 'string'
            },
            roleId: {
                type: 'number'
            },
            firstName: {
                type: 'string'
            },
            lastName: {
                type: 'string'
            }

        },
        required: ['id', 'nickname', 'email', 'role', 'firstName', 'lastName'],
        type: 'object',
    },

    TeacherListResponse: {
        type: 'array',
        items: {
            type: 'object',
            required: ['id', 'nickname', 'email', 'role', 'firstName', 'lastName'],
            properties: {
                id: {
                    type: 'number'
                },
                nickname: {
                    type: 'string'
                },
                email: {
                    type: 'string'
                },
                role: {
                    type: 'number'
                },
                firstName: {
                    type: 'string'
                },
                lastName: {
                    type: 'string'
                }
            }
        }
    },
};
