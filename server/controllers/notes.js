// TODO - replace with sql logic instead of mongoose
const mysql = require('mysql');
const config = require('../config/config.js');
let connection = mysql.createConnection(config);
const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const Note = mongoose.model('Note')

// var fs = require('fs');

// try {
//     var data = fs.readFileSync('my-file.txt', 'utf8');
//     console.log(data);    
// } catch(e) {
//     console.log('Error:', e.stack);
// }


//setup for promise-ifying queries Database.query()
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}
/*
//optional query using connection.execute to handle errors where config is let config = mysql.createConnection(config);
//we have to use external variables to hold the data, since when chaining, all you have reference to is the data from the previous query
//With .query(), parameter substitution is handled on the client, including objects which let data = req.body is in the above examples.
//With .execute() prepared statement parameters are sent from the client as a serialized string and handled by the server. Since let data = req.body is an object, that's not going to work.
let someRows, otherRows;
Database.execute( config,
    database => database.query( 'SELECT * FROM some_table' )
    .then( rows => {
        someRows = rows;
        return database.query( 'SELECT * FROM other_table' )
    } )
    .then( rows => {
        otherRows = rows;
    } )
).then( () => {
    // do something with someRows and otherRows
} ).catch( err => {
    // handle the error
} );

//could also try (from comments)
async function getRows() {
    const someRows = await database.query( 'SELECT * FROM some_table' )
    .then( rows => rows )
    const otherRows = await database.query( 'SELECT * FROM other_table' )
    .then( rows => rows );
    return { someRows: someRows, otherRows: otherRows }
}

*/
module.exports = {
    register: async (req, res) => {
        //if values returned, user already exists
        console.log("register req.body: " + JSON.stringify(req.body))
        //bcrypt here

        bcrypt.hash(req.body.password, 10, function (err, hash) {

            if (err) {
                throw err;
            }
            else {
                //should place connection in here
                console.log("hashing pass to: " + hash)
                var sql = "SELECT * FROM user WHERE username = (?) AND password = (?)";
                connection.query(sql, [req.body.username, hash], function (err, results) {
                    if (err) { throw err }
                    //if a user already exists
                    else if (results.length > 0) {
                        console.log(JSON.stringify("pre-existing users for given username and password: " + JSON.stringify(results)))
                        //log anyone out who's already logged in
                        req.session.uid = null;
                        //return false
                        res.json({ login: false })
                    }
                    // console.log(results)
                    else if (results.length == 0) {//if there are no users, the results.length is going to be zero and you can create a user
                        var sql1 = "INSERT INTO user(username, password) VALUES(?, ?)";
                        console.log("test hashed: " + hash)
                        connection.query(sql1, [req.body.username, hash], function (err, result) {
                            console.log("Registration insert result:  " + JSON.stringify(result))
                            try {
                                //select user that was just created
                                var sql = "SELECT * FROM user WHERE username = (?) AND password = (?) LIMIT 1";
                                connection.query(sql, [req.body.username, hash], function (err, results) {
                                    console.log("selecting user just created: " + JSON.stringify(results))
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
                        })
                    } else {
                        //if response, return uniqueness error
                        res.json({ login: false, message: "ERROR user already exists" })
                    }
                })
            }
        })

        // await connection.query(sql, [req.body.username, req.body.password], function (err, results) {
        //     console.log(JSON.stringify("pre-existing users for given username and password: " + JSON.stringify(results)))
        //     if (err) { throw err }
        //     //if a user already exists
        //     else if (results.length > 0) {
        //         //log anyone out who's already logged in
        //         req.session.uid = null;
        //         //return false
        //         res.json({ login: false })
        //     }
        //     // console.log(results)
        //     else if (results.length == 0) {//if there are no users, the results.length is going to be zero and you can create a user
        //         var sql1 = "INSERT INTO user(username, password) VALUES(?, ?)";
        //         connection.query(sql1, [req.body.username, req.body.password], function (err, result) {
        //             console.log("Registration insert result:  " + JSON.stringify(result))
        //             try {
        //                 //select user that was just created
        //                 var sql = "SELECT * FROM user WHERE username = (?) AND password = (?) LIMIT 1";
        //                 connection.query(sql, [req.body.username, req.body.password], function (err, results) {

        //                     if (err) { throw err }
        //                     //set session user id 
        //                     else {
        //                         console.log("Registration select after insertion: " + results[0].id)
        //                         req.session.uid = JSON.stringify(results[0].id)
        //                         console.log(req.session.uid)

        //                         res.json({ login: true })
        //                     }
        //                 })

        //             } catch (error) {
        //                 res.json(error);
        //             }

        //         });
        //     } else {
        //         //if response, return uniqueness error
        //         res.json({ login: false, message: "ERROR user already exists" })
        //     }

        // });
    },
    login: async (req, res) => {
        //should actually use bcrypt here to keep the hash logic on backend
        console.log("login username: " + JSON.stringify(req.body.username))
        console.log("login password: " + JSON.stringify(req.body.password))
        var getusersql = "SELECT * FROM user WHERE username = ? LIMIT 1"
        connection.query(getusersql, [req.body.username], function (error, results) {
            try {
                //results = [{"id":0,"username":"uname","password":"hashedpassword"}]
                
                console.log("getuser in login username: " + results[0].username)
                console.log("getuser in login hashpass: " + results[0].password)
                //compare the password given, and the hashed pass pulled from db
                bcrypt.compare(req.body.password,results[0].password, function(){
                    try {
                        var sql = "SELECT * FROM user WHERE username = ? AND password = ? LIMIT 1";
                        // //cannot stringify, need to pass in the the body.username and password as is
                        connection.query(sql, [req.body.username, results[0].password], function (err, results) {
                           
                            console.log("login result: " + JSON.stringify(results))
                            if (err) {
                                //find format and response types for mysql errors
                                const errors = Object.keys(err.errors).map(key => err.errors[key].message)
                                res.status(400).json(errors)
                            } else if (results.length === 0) {
                                res.json({ login: false })
                            }
                            else {
                                //use session to hold user id once logged in
                                req.session.uid = results[0].id
                                console.log("login assining session id: " + results[0].id)
                                // res.json({ userid: results[0].id })
                                res.json({ login: true })
                            }
        
                        })
                        
                    } catch (err) {
                        res.json(error)
                    }

                })
            } catch (error) {
                res.json(error)
            }
        })
        // var sql = "SELECT * FROM user WHERE username = ? AND password = ? LIMIT 1";
        // //cannot stringify, need to pass in the the body.username and password as is
        // connection.query(sql, [req.body.username, req.body.password], function (err, results) {
        //     // bcrypt.compare(req.body.password,)
        //     console.log("login result: " + results[0])
        //     if (err) {
        //         //find format and response types for mysql errors
        //         const errors = Object.keys(err.errors).map(key => err.errors[key].message)
        //         res.status(400).json(errors)
        //     } else if (results.length === 0) {
        //         res.json({ login: false })
        //     }
        //     else {
        //         //use session to hold user id once logged in
        //         req.session.uid = results[0].id
        //         console.log("login assining session id: " + results[0].id)
        //         // res.json({ userid: results[0].id })
        //         res.json({ login: true })
        //     }

        // });
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
                    console.log("in getUser results length ===0: " + results)
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
        console.log("getNotes userId: " + JSON.stringify(req.session.uid))
        connection.query(sql, [req.session.uid], function (err, results) {
            if (err) throw err
            console.log(results)
            res.json(results)
        });
    },
    //for userid, probably should just pass in body vs in param/url
    createNote: (req, res) => {
        console.log("in createNote in notes.js")
        var sql = "INSERT INTO note(reminder,user_id) VALUES reminder = (?), user_id = (?)"
        //params is from url, req.body contains key-value pairs for data submitted in the request body.
        //the note reminder content itself will be stored within the req.body and the user id will be passed within the url 
        //might just need to pass in req.body vs req.body.reminder
        connection.query(sql, [req.body.reminder, req.params.id], function (err, results) {
            if (err) throw err
            console.log(req.body.reminder)
            console.log(req.params.id)
            res.json(results)
        });
    },
    updateNote: (req, res) => {
        //might just need to pass in req.body vs req.body.reminder
        console.log("req.body.reminder: "+ JSON.stringify(req.body.reminder+ ", req.params.id: "+ req.params.id))
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
    logout: (req, res) => {
        console.log("pre-logout session ID: "+req.session.uid)
        req.session.destroy(function(err){
            if(err){ throw err }
        })
        res.json(true);
    },



}

