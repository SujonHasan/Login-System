
const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');

const routers = require('./routes/index');
const users = require('./routes/users');

// database connection 
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/loginapp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log("database conncection successfully"))
.catch(err => console.log(err));

//Init app 
const app = express();

// body parser middleware & cooks
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Express Validator 
// app.use(expressValidator());

// Set Static Folder 
app.use(express.static(path.join(__dirname, 'public')));

// view Engine
app.use(expressLayouts);
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Connect flash   
app.use(flash()); 

// Global Variable    
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.err_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.userLogout = req.flash('userLogout');
    next(); 
}) 

app.use('/', routers);
app.use('/users',users);

// Set Port 
const PORT = process.env.PORT || 3300;

app.listen(PORT, ()=>{
    console.log(`Listening port ${PORT}`);
})
