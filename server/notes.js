const _ = require('lodash');

const { ObjectID } = require('mongodb');
const { Notes } = require('./models/notes');
const { authenticate } = require('./middleware/authenticate');
const { app }=require('./server');

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
