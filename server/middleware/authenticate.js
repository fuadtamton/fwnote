const { User } = require('./../models/user');
const { errorCode } = require('../api/utils/errorCode')

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    User.findByToken(token).then(user => {
        if (!user) {
            return Promise.reject()
        }
        req.user = user;
        req.token = token;
        next()
    }).catch(e => {
        res.status(401).send(errorCode(400, 'unautherized user'))
    })
}
module.exports = { authenticate }