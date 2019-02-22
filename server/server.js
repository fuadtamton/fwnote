const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

require('./db/mongoose');
const { User } = require('./models/user');
const { Notes } = require('./models/notes');
const { authenticate } = require('./middleware/authenticate');

const app = express()
app.use(bodyParser.json())





//save notes
app.post('/notes', authenticate, (req, res) => {
    const body = _.pick(req.body, ['title', 'note']);

    body.createdAt = new Date().getTime();
    body.creator_Id = req.user._id;
    const notes = new Notes(body);

    notes.save().then(note => {
        res.send(note)
    })
        .catch(e => {
            res.status(400).send()
        })
})

//get all notes
app.get('/notes/all', authenticate, (req, res) => {
    Notes.find({ creator_Id: req.user._id }).then(notes => {
        res.send(notes)
    }).catch(e => {
        res.status(400).send(e)
    })
})

//get specific note
app.get('/notes/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send();
    }
    Notes.findOne({
        _id: id,
        creator_Id: req.user._id
    }).then(note => {
        if (!note) {
            res.status(404).send()
        }
        res.status(200).send(note)
    }).catch(e => {
        res.status(400).send(e)
    })
})

//delete note
app.delete('/notes/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send()
    }
    Notes.findOneAndRemove({
        _id: id,
        creator_Id: req.user._id
    }).then(note => {
        if (!note) {
            res.status(404).send()
        }
        res.status(200).send(note)
    }).catch(e => {
        res.status(400).send(e)
    })
})

//update patch
app.patch('/notes/:id', authenticate, (req, res) => {
    const id = req.params.id
    const body = _.pick(req.body, ['title', 'note', 'favourite']);
    if (!ObjectID.isValid(id)) {
        res.status(400).send();
    }
    Notes.findOneAndUpdate({
        _id: id,
        creator_Id: req.user._id
    },
        { $set: body },
        { new: true }
    ).then(note => {
        if (!note) {
            res.status(404).send();
        }
        res.status(200).send(note)
    }).catch(e => {
        res.status(400).send();
    })
})









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
            res.status(400).send(e.message)
        })
})

//users/me
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

//users/login
app.get('/users/login', (req, res) => {
    let user;
    const body = _.pick(req.body, ['email', 'password']);
    User.findByCreditionals(body.email, body.password).then(tempUser => {
        user = tempUser;
        return tempUser.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(e => {
        res.status(400).send(`${e}`);
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




app.listen(3002, () => {
    console.log("Server is up on port 3002")
})