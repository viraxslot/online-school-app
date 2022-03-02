import { assign } from 'lodash';

const SharedFields = {
    User: {
        nickname: {
            type: 'string',
        },
        email: {
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
};

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
            ...SharedFields.User,
            password: {
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
