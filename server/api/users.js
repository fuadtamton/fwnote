const _ = require('lodash');
const express = require('express');
const validate = require('express-jsonschema').validate;

require('../db/mongoose');
const { User } = require('../models/user');
const { authenticate } = require('../middleware/authenticate');
const { SignupSchema, LoginSchema } = require('./schema/userJsonSchema')
const { errorCode } = require('./utils/errorCode');

const router = express.Router();

//Signup user
router.post('/signup/', validate({ body: SignupSchema }), (req, res) => {
    const body = _.pick(req.body, ['email', 'password', 'name', 'screenName']);
    User.findByEmail(body.email).then(response => {
        if (response) {
            return res.status(400).send(errorCode(400, 'Email already exist'))
        }
        const user = new User(body)
        user.save().then(user => {
            return user.generateAuthToken();
        }).then(token => {
            res.header('x-auth', token).send(user)
        }).catch(e => {
            res.status(400).send(e)
        })
    })
})
/**
 * @api {POST} /api/v1/auth/signup Signup a new user.
 * @apiVersion 1.0.0
 * @apiName  signup api
 * @apiGroup Auth
 * @apiParam {String} name        Your name.
 * @apiParam {String} screenName  Display name.
 * @apiParam {String} email       Your email address.
 * @apiParam {String} password    New password.
 */



//users/login
router.put('/login/', validate({ body: LoginSchema }), (req, res) => {
    let user;
    const body = _.pick(req.body, ['email', 'password']);
    User.findByCreditionals(body.email, body.password).then(tempUser => {
        user = tempUser;
        return tempUser.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(e => {
        res.status(400).send(errorCode(400, e));
    })
})
/**
 * @api {PUT} /api/v1/auth/login login existing user.
 * @apiVersion 1.0.0
 * @apiName  login api
 * @apiGroup Auth
 * @apiParam {String} email       Your email address.
 * @apiParam {String} password    Your password.
 */

//users/logout
router.delete('/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }).catch(e => {
        res.status(400).send(e)
    })
})
/**
 * @api {DELETE} /api/v1/auth/logout logout user.
 * @apiVersion 1.0.0
 * @apiName  logout api
 * @apiGroup Auth
 * @apiHeader {String} token users unique access key
 */


module.exports = router