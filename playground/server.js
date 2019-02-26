const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const validate = require('express-jsonschema').validate;

const app = express();
app.use(bodyParser.json())
// Create a json scehma
var StreetSchema = {
    type: 'object',
    properties: {
        number: {
            type: 'number',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        type: {
            type: 'string',
            required: true,
            enum: ['Street', 'Avenue', 'Boulevard']
        }
    }
}

app.post('/street', validate({ body: StreetSchema }), (req, res) => {
    res.send('hi')
})



app.use((err, req, res, next) => {

    var responseData;
    if (err.name === 'JsonSchemaValidation') {
        console.log("inside moddlewrwe")
        res.status(400);

        responseData = {
            statusText: 'Bad Request',
            jsonSchemaValidation: true,
            validations: err.validations
        };

        if (req.get('Content-Type') === 'application/json') {
            res.json(responseData);
        } else {
            res.render('badrequestTemplate', responseData);
        }
    } else {
        next(err);
    }
});

app.listen(3002, () => {
    console.log("Running")
})