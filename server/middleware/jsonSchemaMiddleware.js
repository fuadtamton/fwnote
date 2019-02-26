jsonSchema = (err, req, res, next) => {
    var responseData;
    if (err.name === 'JsonSchemaValidation') {
        res.status(400);
        responseData = {
            statusText: 'Bad Request',
            jsonSchemaValidation: true,
            validations: err.validations
        };
        if (req.xhr || req.get('Content-Type') === 'application/json') {
            res.json(responseData);
        } else {
            res.render('badrequestTemplate', responseData);
        }
    } else {
        next(err);
    }
}

module.exports = { jsonSchema }
