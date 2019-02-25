const express = require('express');
var cors=require('cors');
const bodyParser = require('body-parser');

require('./db/mongoose');

const app = express()
app.use(cors())
app.use(bodyParser.json())




app.listen(3002, () => {
    console.log("Server is up on port 3002")
})
module.exports={ app }

require('./users')
require('./notes')
