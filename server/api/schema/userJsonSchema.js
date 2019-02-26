var SignupSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            required: true,
            minLength: 3
        },
        screenName: {
            type: 'string',
            required: true,
            minLength: 3
        },
        email: {
            type: 'string',
            required: true,
            minLength: 3
        },
        password: {
            type: 'string',
            required: true,
            minLength: 6
        }
    }
}

var LoginSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            required: true,
            minLength: 3
        },
        password: {
            type: 'string',
            required: true,
            minLength: 6
        }
    }
}
module.exports = { SignupSchema, LoginSchema }