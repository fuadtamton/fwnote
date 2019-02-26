var cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');

const users = require('./api/users');
const notes = require('./api/notes');
const { jsonSchema } = require('./middleware/jsonSchemaMiddleware');
const app = express()

app.use(bodyParser.json())
app.use('/api/v1/auth', users);
app.use('/api/v1/notes', notes);
app.use(jsonSchema);
app.use(cors());


app.listen(3002, () => {
    console.log("Server is up on port 3002")
})