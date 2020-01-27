const express = require('express');
const router = express.Router();
const notes = require('./../controllers/notes');
router.post('/user/register', notes.register)
      .post('/user/login', notes.login)//gets user with given id
      .get('/user/', notes.getUser)
      .post('/:id', notes.createNote)//creates new note given userID
      .put('/:id', notes.updateNote)//updates note given note id
      .get('/all',notes.getNotes)//gets all notes for user. may not need the /all
      .delete('/:id', notes.deleteNote)


// router.get('/', notes.all)
//     .get('/:id', notes.getOneById)
//     .post('/', notes.create)
//     .put('/:id', notes.update)
//     .delete('/:id', notes.delete)

module.exports = router;
