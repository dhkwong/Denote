require('./server/config/database');//sql logic creating tables IF they don't already exist
const express = require('express');
const app = express();
//import express session as session
const session = require('express-session');
const path = require('path');
const bp = require('body-parser');
const router = require('./server/routes');
//default has no type, with extended as true
app.use(express.urlencoded({extended: true}))

//default no type extended false
app.use(bp.urlencoded({ extended: false}))
app.use(bp.json());
app.use(express.static( path.join(__dirname, './public/dist/public')));
//use session
app.use(session({
    secret: 'udv7rhuhxbbvm3r2',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(router);

app.listen(8000, () => console.log('listening on port 8000'));
