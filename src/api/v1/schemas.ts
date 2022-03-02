import { assign } from 'lodash';

const BasicSchemas = {
    DefaultResponse: {
        properties: {
            result: {
                type: 'string',
            },
        },
        required: ['result'],
        type: 'object',
    },

    UserRequest: {
        properties: {
            nickname: {
                type: 'string',
            },
            email: {
                type: 'string',
            },
            password: {
                type: 'string',
            },
            role: {
                type: 'string',
            },
            firstName: {
                type: 'string',
            },
            lastName: {
                type: 'string',
            },
        },
        required: ['nickname', 'email', 'password', 'role'],
        type: 'object',
    },

    ChangeUserRequest: {
        properties: {
            id: {
                type: 'number',
            },
            nickname: {
                type: 'string'
            },
            email: {
                type: 'string',
            },
            role: {
                type: 'number',
            },
            firstName: {
                type: 'string',
            },
            lastName: {
                type: 'string',
            },
        },
        required: ['id'],
        type: 'object',
    },

    UserResponse: {
        properties: {
            id: {
                type: 'number',
            },
            nickname: {
                type: 'string',
            },
            email: {
                type: 'string',
            },
            role: {
                type: 'number',
            },
            firstName: {
                type: 'string',
            },
            lastName: {
                type: 'string',
            },
        },
        required: ['id', 'nickname', 'email', 'role', 'firstName', 'lastName'],
        type: 'object',
    },
};

const ExtendedSchemas = {
    UserListResponse: {
        type: 'array',
        items: BasicSchemas.UserResponse,
    },
};

export const SchemasV1 = assign({}, BasicSchemas, ExtendedSchemas);
