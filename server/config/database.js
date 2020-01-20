// const path = require('path');
// const fs = require('fs');
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/notes', {useNewUrlParser: true});
// fs.readdirSync(path.join(__dirname, './../models')).forEach(function(file) {
//     if(file.indexOf('.js') >= 0) {
//         require(path.join(__dirname, './../models') + '/' + file);
//     }
// });
//sql connection logic for table creations go here

let mysql = require('mysql');
let config = require('../config/config.js');
let connection = mysql.createConnection(config);
// let connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'denote-schema'
// });
//alternatively to more manually handle the pool
// var pool = mysql.createPool({
//     connectionLimit: 5,
//     host: 'localhost',
//     user: 'root',
//     password: '', 
//     database: 'todoapp'
// });
//for node.js, your connections exists within a pool. once you're done with the connection, you can connection.release() which sends it back to 
//the pool. to fully release all connections in the pool, do pool.end. It's better to do connection pooling for releasing connections without losing efficiency
let makeUserTable = "CREATE TABLE IF NOT EXISTS `denote-schema`.`user` (`id` INT NOT NULL AUTO_INCREMENT,`username` VARCHAR(65) NULL,`password` VARCHAR(200) NULL,PRIMARY KEY(`id`));"
connection.query(makeUserTable, function (err, result) {
    if (err) { throw err }

    console.log("User Table created");
    let makeNoteTable = "CREATE TABLE IF NOT EXISTS `denote-schema`.`note` (`noteid` INT NOT NULL AUTO_INCREMENT,`reminder` VARCHAR(255) NULL,`user_id` INT NULL,PRIMARY KEY (`noteid`),  `created_at` DATETIME NULL,`updated_at` DATETIME NULL,INDEX `fk_note_user_idx` (`user_id` ASC),CONSTRAINT `fk_note_user`FOREIGN KEY (`user_id`)REFERENCES `denote-schema`.`user` (`id`)ON DELETE NO ACTION ON UPDATE NO ACTION);"
    
    connection.query(makeNoteTable, function (err, result) {
        if (err) {
            throw err
        }
        console.log("created note tables")
        
    })
    
});






