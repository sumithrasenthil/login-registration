var express=require('express');
var router =express.Router();
const bcrypt = require('bcryptjs');
const passport =require('passport');
const User =require('../models/User');
//login
router.get('/login',function(req,res){
    res.render('login');

});
//register
router.get('/register',function(req,res){
    res.render('register');

});
router.post('/register',function(req,res){
    const {name,email,password,password2 }=req.body;
    let errors=[];
    //checking all fields
    if(!name ||!email || !password ||!password2){
        errors.push({msg:"Fill all the fields"});
    }
    //checking password match
    if(password !=password2){
        errors.push({msg:"Password doesn't match"});
    };

    //checking a password length
    if(password.length<6){
        errors.push({msg:"password length must be atleast 6 characters"})
    };

    if(errors.length>0){
        res.render('register',{errors,name,email,password,password2})
    }
    else{
        User.findOne({ email :email})
            .then(function (user) {
                if(user){
                    //user exists
                    errors.push({msg:'Email already exists'})
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }else{
                    const newUser =new User({
                        name,
                        email,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    req.flash(
                                        'success_msg',
                                        'You are now registered and can log in'
                                    );
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            });

    }
});

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/index/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});






module.exports =router;