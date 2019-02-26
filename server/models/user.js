const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            messaage: '{value} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    screenName: {
        type: String,
        required: true,
        minlength: 3
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})
userSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret__code').toString()
    user.tokens.push({ access, token })
    return user.save().then(() => {
        return token
    })
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    const updatedUser = _.pick(userObject, ['email', 'screenName'])
    updatedUser.token = userObject.tokens[userObject.tokens.length - 1].token
    return updatedUser
}

userSchema.pre('save', function (next) {
    const user = this;
    if (this.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    }
    else {
        next()
    }
})

userSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded = '';
    try {
        decoded = jwt.verify(token, 'secret__code');
    }
    catch (e) {

    }
    const res = User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
    return res
}

userSchema.statics.findByEmail = function (email) {
    const User = this;
    return User.findOne({ email }).then(res => {
        return res
    })
}


userSchema.statics.findByCreditionals = function (email, password) {
    const User = this;
    return User.findOne({ email }).then(user => {
        if (!user) {
            return Promise.reject('email does not exist')
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    return resolve(user)
                }
                else {
                    return reject("email and password not match");
                }
            });
        })
    })
}

userSchema.methods.removeToken = function (token) {
    const user = this;
    return user.update(
        { $pull: { tokens: { token: token } } }
    )
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
