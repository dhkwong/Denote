// TODO - replace with sql logic instead of mongoose
const mysql = require('mysql');
const config = require('../config/config.js');
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
    //     connection.query(sql, [req.body.username, req.body.password], function (err, results) {
    //         if (err) { throw err }
    //         console.log("test")
    //         console.log(results.insertId)
    //         res.json(results)
    //     });
    // },
    register: (req, res) => {
        //keep bcrypt hashing logic on backend
        var sql = "SELECT * FROM user WHERE username = (?) AND password = (?)";
        //if values returned, user already exists
        console.log("register req.body: " + JSON.stringify(req.body))
        //pass in 
        connection.query(sql, [req.body.username, req.body.password], function (err, results) {
            console.log(JSON.stringify("pre-existing users for given username and password: " + JSON.stringify(results)))
            if (err) { throw err }
            // console.log(results)
            else if (results.length == 0) {//if there are no users, the results.length is going to be zero and you can create a user
                var sql1 = "INSERT INTO user(username, password) VALUES(?, ?)";
                connection.query(sql1, [req.body.username, req.body.password], function (err, result) {
                    console.log("Registration insert result:  " + JSON.stringify(result))
                    try {
                        //select user that was just created
                        var sql = "SELECT * FROM user WHERE username = (?) AND password = (?) LIMIT 1";
                        connection.query(sql, [req.body.username, req.body.password], function (err, results) {

                            if (err) { throw err }
                            //set session user id 
                            else {
                                console.log("Registration select after insertion: " + results[0].id)
                                req.session.uid = JSON.stringify(results[0].id)
                                console.log(req.session.uid)

                                res.json({ login: true })
                            }
                        })

                    } catch (error) {
                        res.json(error);
                    }

                });
            } else {
                //if response, return uniqueness error
                res.json({ login: false, message: "ERROR user already exists" })
            }

        });
        // connection.query(sql, [req.body.username, req.body.password], function (err, results) {
        //     console.log(JSON.stringify("pre-existing users for given username and password: "+JSON.stringify(results)))
        //     if (err) {throw err}
        //     // console.log(results)
        //     else if (results.length == 0) {//if there are no users, the results.length is going to be zero and you can create a user
        //         var sql1 = "INSERT INTO user(username, password) VALUES(?, ?)";
        //         connection.query(sql1, [req.body.username, req.body.password], function (err, result) {
        //             console.log("Registration insert result:  "+JSON.stringify(result.changedRows, result.affectedRows))
        //             if (err) { throw err }
        //             //need one more query to actually recieve the user id and set session
        //             else {
        //                 var sql = "SELECT * FROM user WHERE username = (?) AND password = (?) LIMIT 1";
        //                 connection.query(sql, [req.body.username, req.body.password], function (err, results) {

        //                     if (err) { throw err }
        //                     //set session user id 
        //                     else {

        //                         console.log("Registration select after insertion: "+results[0].id)
        //                         req.session.uid = results[0].id
        //                         console.log(req.session.uid)

        //                     }
        //                 })
        //                 res.json({ login: true })
        //             }
        //         })
        //     } else {
        //         //if response, return uniqueness error
        //         res.json({ login: false, message: "ERROR user already exists" })
        //     }

        // });
    },
    login: (req, res) => {
        //should actually use bcrypt here to keep the hash logic on backend
        console.log("login username: " + JSON.stringify(req.body.username))
        console.log("login password: " + JSON.stringify(req.body.password))

        var sql = "SELECT * FROM user WHERE username = ? AND password = ? LIMIT 1";
        //cannot stringify, need to pass in the the body.username and password as is
        connection.query(sql, [req.body.username, req.body.password], function (err, results) {
            console.log("login result: " + results[0])
            if (err) {
                //find format and response types for mysql errors
                const errors = Object.keys(err.errors).map(key => err.errors[key].message)
                res.status(400).json(errors)
            } else if (results.length === 0) {
                res.json({ login: false })
            }
            else {
                //use session to hold user id once logged in
                //req.session.uid = results[0].id

                req.session.uid = results[0].id
                console.log("login assining session id: " + results[0].id)
                // res.json({ userid: results[0].id })
                res.json({ login: true })
            }

        });
    },
    getUser: (req, res) => {//probably unecessary after login and reg methods created
        var sql = "SELECT * FROM user WHERE id = (?)";
        console.log("getuser sessionuid in getUser: " + JSON.stringify(req.session))
        let session = req.session.uid
        try {
            connection.query(sql, [session], function (err, results) {
                if (err) {
                    console.log("error in getUser SELECTing user: " + req.session.uid)
                    throw err
                }
                //if query gives nothing
                else if (results.length === 0) {
                    console.log("in getUser retrieving user: " + req.session.uid)
                    console.log("in getUser results length ===0: "+results)
                    res.json({ userId: false })
                }
                //[ RowDataPacket { id: 1, username: 'daryl1', password: 'pass1' } ]

                else {
                    console.log("user data returned: " + JSON.stringify(results))
                    res.json({ userId: results[0].id, userName: results[0].username })
                }
            })

        } catch (error) {
            res.json({ login: false });
        }

    },
    getNotes: (req, res) => {
        var sql = "SELECT * FROM note WHERE user_id =(?)";
        console.log("hi" + JSON.stringify(req.session.uid))
        connection.query(sql, [req.session.uid], function (err, results) {
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
    },
    deleteNote: (req, res) => {
        var sql = "DELETE FROM notes WHERE id = (?)"
        connection.query(sql, [req.param.id], function (err) {
            if (err) throw err

        });
    },
    logout: (req) => {
        req.session.uid = null;
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
