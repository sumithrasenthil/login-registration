const express =require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');



//Initializing the app
const app =express();

//passport config
require('./config/passport')(passport);
//DB config
const db =require('./config/keys').mongoURL;

mongoose.connect(db,{useNewUrlParser:true},function(){console.log("Mongoose.connect")});


//Ejs
app.use(expressLayouts);
app.set('view engine','ejs');


 //body parser
app.use(express.urlencoded({extended :true}));

//express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
//passport init
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variables
app.use(function(req,res,next){
    res.locals.success_msg =req.flash('success_msg');
    res.locals.error_msg =req.flash('error_message');
    res.locals.error =req.flash('error');
    next();
})

//routes
app.use('/index',require('./routers/index.js'));
app.use('/users',require('./routers/users.js'));
//app listening
app.listen(3600,function(){console.log('server start listening to the port 3600')});