// TODO - replace with sql logic instead of mongoose
const config = require('../config/config.js');
const mysql = require('mysql');
let connection = mysql.createConnection(config);
// const mongoose = require('mongoose');
// const Note = mongoose.model('Note')
module.exports = {

    createUser: (req, res) => {
        //inserts but doesn't return data
        var sql = "INSERT INTO user(username, password) VALUES(?, ?)";
        connection.query(sql, [req.body.username, req.body.password], function (err, results) {
            if (err) { throw err }
            console.log("test")
            console.log(results.insertId)
            res.json(results)
        });
    },
    getUsers: (req, res) => {
        var sql = "SELECT * FROM user";
        connection.query(sql, function(err, results){
            if(err){
                throw err
            }
            
            console.log(results)
            console.log("hi")
            res.json({results :results})
        });
        
    }

}
    // all: async (req, res) => {

    //     try {
    //         const notes = await Note.find();
    //         res.json({ notes: notes });
    //     }
    //     catch (err) {
    //         res.json(err);
    //     }
    // },
    // getOneById: (req, res) => {
    //     Note.findById({ _id: req.params.id })
    //         .then((data) => {
    //             res.json({ note: data })
    //         })
    //         .catch(err => res.json(err));
    // },
    // create: (req, res) => {
    //     const note = new Note(req.body);
    //     note.save()
    //         .then((data) => {
    //             res.json({ newNote: data });
    //         })
    //         .catch(err => res.json(err));
    // },
    // update: (req, res) => {
    //     Note.updateOne({ _id: req.params.id }, req.body)
    //         .then((data) => {
    //             res.json({ updatedNote: data });
    //         })
    //         .catch(err => res.json(err));
    // },
    // delete: (req, res) => {
    //     Note.findOneAndDelete({ _id: req.params.id })
    //         .then((data) => {
    //             res.json(data);
    //         })
    //         .catch(err => {
    //             res.json(err);
    //         });
    // },
