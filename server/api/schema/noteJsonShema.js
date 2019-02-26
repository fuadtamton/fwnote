var NoteSchema = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
            required: true,
            minLength: 1
        },
        note: {
            type: 'string',
            required: true,
            minLength: 1
        }
    }
}

module.exports = { NoteSchema }