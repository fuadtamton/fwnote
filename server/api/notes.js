const _ = require('lodash');
const express = require('express');
const { ObjectID } = require('mongodb');
const validate = require('express-jsonschema').validate;

const { errorCode } = require('./utils/errorCode');
const { Notes } = require('../models/notes');
const { authenticate } = require('../middleware/authenticate');
const { NoteSchema } = require('./schema/noteJsonShema');

const router = express.Router();
//save notes
router.post('/save', validate({ body: NoteSchema }), authenticate, (req, res) => {
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
/**
 * @api {POST} /api/v1/notes/save save a note.
 * @apiVersion 1.0.0
 * @apiName   save note
 * @apiGroup  Notes
 * @apiParam  {string}  title  title of the note
 * @apiParam  {string}  note   body of the note
 * @apiHeader {string}  token  users unique access key
 */

//get all notes
router.get('/getall', authenticate, (req, res) => {
    Notes.find({ creator_Id: req.user._id }).then(notes => {
        res.send(notes)
    }).catch(e => {
        res.status(400).send(errorCode(400, `can't find notes`))
    })
})
/**
 * @api {GET} /api/v1/notes/getall get all notes created by you.
 * @apiVersion 1.0.0
 * @apiName  get all note
 * @apiGroup  Notes
 * @apiHeader {string}  token  users unique access key
 */

//get specific note
router.get('/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send(errorCode(400, `Invalid note id`));
    }
    Notes.findOne({
        _id: id,
        creator_Id: req.user._id
    }).then(note => {
        if (!note) {
            res.status(404).send(errorCode(404, `can't find note`))
        }
        res.status(200).send(note)
    }).catch(e => {
        res.status(400).send(errorCode(400, `can't find note`))
    })
})
/**
 * @api {GET} /api/v1/notes/:id get a single note created by you.
 * @apiVersion 1.0.0
 * @apiName   get single note
 * @apiGroup  Notes
 * @apiHeader {string}  id     unique id of a note created by you
 * @apiHeader {string}  token  users unique access key
 */

//delete note
router.delete('/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send(errorCode(400, `invalid note id`))
    }
    Notes.findOneAndRemove({
        _id: id,
        creator_Id: req.user._id
    }).then(note => {
        if (!note) {
            res.status(404).send(errorCode(404, `can't find note`))
        }
        res.status(200).send(note)
    }).catch(e => {
        res.status(400).send(errorCode(400, `note deletion failed`))
    })
})
/**
 * @api {DELETE} /api/v1/notes/:id delete a note created by you.
 * @apiVersion 1.0.0
 * @apiName   delete single note
 * @apiGroup  Notes
 * @apiHeader {string}  id     unique id of a note created by you
 * @apiHeader {string}  token  users unique access key
 */

//update patch
router.patch('/:id', validate({ body: NoteSchema }), authenticate, (req, res) => {
    const id = req.params.id
    const body = _.pick(req.body, ['title', 'note']);
    if (!ObjectID.isValid(id)) {
        res.status(400).send(errorCode(400, `invalid note id`));
    }
    Notes.findOneAndUpdate({
        _id: id,
        creator_Id: req.user._id
    },
        { $set: body },
        { new: true }
    ).then(note => {
        if (!note) {
            res.status(404).send(errorCode(404, `can't find note`));
        }
        res.status(200).send(note)
    }).catch(e => {
        res.status(400).send(errorCode(400, `updating notes failed`));
    })
})
/**
 * @api {PATCH} /api/v1/notes/:id update a note created by you.
 * @apiVersion 1.0.0
 * @apiName   get single note
 * @apiGroup  Notes
 * @apiHeader {string}  id     unique id of a note created by you
 * @apiHeader {string}  token  users unique access key
 */

module.exports = router 