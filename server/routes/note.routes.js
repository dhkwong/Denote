const express = require('express');
const router = express.Router();
const notes = require('./../controllers/notes');
router.post('/user/register', notes.register)
      .post('/user/login', notes.login)//gets user with given id
      .get('/user/:id', notes.getUser)
      .post('/note/:id', notes.createNote)//creates new note given userID
      .put('/note/:id', notes.updateNote)//updates note given note id
      .get('/note/:id/all',notes.getNotes)//gets all notes for user. may not need the /all


// router.get('/', notes.all)
//     .get('/:id', notes.getOneById)
//     .post('/', notes.create)
//     .put('/:id', notes.update)
//     .delete('/:id', notes.delete)

module.exports = router;
