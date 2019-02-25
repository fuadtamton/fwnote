const _ = require('lodash');

const { app } = require('./server');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

//Signup user
app.post('/users/signup', (req, res) => {
    const body = _.pick(req.body, ['email', 'password', 'name', 'screenName']);
    const user = new User(body)
    user.save().then(user => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user)
    })
        .catch(e => {
            res.status(400).send(e)
        })
})

//users/me
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

//users/login
app.put('/users/login', (req, res) => {
    let user;
    const body = _.pick(req.body, ['email', 'password']);
    console.log(body);
    User.findByCreditionals(body.email, body.password).then(tempUser => {
        user = tempUser;
        return tempUser.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(e => {
        res.status(400).send({
            returnCode: 400,
            rerturnMessage: e
        });
    })
})

//users/logout
app.delete('/users/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }).catch(e => {
        res.status(400).send(e)
    })
})
