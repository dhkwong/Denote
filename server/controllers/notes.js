// TODO - replace with sql logic instead of mongoose
const config = require('../config/config.js');
const mysql = require('mysql');
let connection = mysql.createConnection(config);
// const mongoose = require('mongoose');
// const Note = mongoose.model('Note')

// var fs = require('fs');

// try {
//     var data = fs.readFileSync('my-file.txt', 'utf8');
//     console.log(data);    
// } catch(e) {
//     console.log('Error:', e.stack);
// }
module.exports = {

    // createUser: (req, res) => {
    //     //inserts but doesn't return data
    //     var sql = "INSERT INTO user(username, password) VALUES(?, ?)";
    //     connection.query(sql, [req.body.username, req.body.hashedpass], function (err, results) {
    //         if (err) { throw err }
    //         console.log("test")
    //         console.log(results.insertId)
    //         res.json(results)
    //     });
    // },
    register: (req, res) => {
        //run query
        var sql = "SELECT * FROM user WHERE username = (?) AND password = (?)"
        //if values returned, user already exists
        connection.query(sql, [req.body.username, req.body.hashedpass], function (err, results) {
            if (err) throw err

            if (results.length=0) {//if there are no users, the results.length is going to be zero
                var sql1 = "INSERT INTO user(username, password) VALUES(?, ?)";
                connection.query(sql1, [req.body.username, req.body.hashedpass], function (err, results) {
                    if (err) { throw err }
                    console.log("test")
                    console.log(results.insertId)
                    //req.session.uid = results[0].id
                    res.json(results)
                })
                
            }else{
                console.log(req.body)
                res.json({message: "ERROR user already exists"})
            }
        });

    },
    login:(req,res)=>{
        var sql = "SELECT * FROM user WHERE username = (?) AND password = (?) LIMIT 1";
        console.log(req.body)
        connection.query(sql, [req.body.username, req.body.hashedpass], function(err, results){
            if(err) throw err;
            console.log(req.body)
            console.log(results)
            if(results.length==0){
                res.json({message:"ERROR user does not exist"})
            }else{
                //use session to hold user id once logged in
                //req.session.uid = results[0].id
                res.json({userid: results[0].id})
            }
        });
    },
    getUser: (req, res) => {
        var sql = "SELECT * FROM user WHERE id = (?)";
        //should be POST instead of GET due to the passing of form data
        connection.query(sql, [req.params.id], function (err, results) {
            if (err) {
                throw err
            }
            //[ RowDataPacket { id: 1, username: 'daryl1', password: 'pass1' } ]

            console.log("user data returned: " + JSON.stringify(results))
            res.json({ userid: results[0].id, userName: results[0].username })
        });

    },
    getNotes: (req, res) => {
        var sql = "SELECT * FROM note WHERE user_id =()";
        connection.query(sql, [req.params.id], function (err, results) {
            if (err) throw err
            console.log(results)
            res.json(results)
        });
    },
    createNote: (req, res) => {
        var sql = "INSERT INTO note(reminder,user_id) SET reminder = (?), user_id = (?)"
        //params is from url, req.body contains key-value pairs for data submitted in the request body.
        //the note reminder content itself will be stored within the req.body and the user id will be passed within the url 
        //might just need to pass in req.body vs req.body.reminder
        connection.query(sql, [req, body.reminder, req.params.id], function (err, results) {
            if (err) throw err
            console.log(req.body.reminder)
            console.log(req.params.id)
            res.json(results)
        });
    },
    updateNote: (req, res) => {
        //might just need to pass in req.body vs req.body.reminder
        var sql = "UPDATE notes SET reminder = (?) WHERE id = (?)"
        connection.query(sql, [req.body.reminder, req.params.id], function (err, results) {
            if (err) throw err
            console.log(reg.body.reminder)
            console.log(req.params.id)
            res.json(results)
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
