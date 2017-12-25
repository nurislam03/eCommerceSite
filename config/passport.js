var passport = require('passport'); // importing passport
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    })
});

//
/* Sign UP */
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail(); // checking either email is valid or not.
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4}); // checking the password is valid or not.
    /* above 2 line just check if there is any error but not do anything. In order to
      to take any action we need to passed all the errors we found. */
    var errors = req.validationErrors();
    if(errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    } // errors message sending done.


    User.findOne({'email':email}, function(err, user) {
        if(err) {
            return done(err); // if there is any error.
        }
        if(user) {
            return done(null, false, {message: 'Email is already in use.'});
        } // checking either the given email is already in the Database.

        /* No errors! so it's time to create new user. */
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
            if(err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });

}));


/* Sign IN */
passport.use('local.signin', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail(); // checking either email is valid or not.
    req.checkBody('password', 'Invalid password').notEmpty() // checking the password is valid or not.
    /* above 2 line just check if there is any error but not do anything. In order to
      to take any action we need to passed all the errors we found. */
    var errors = req.validationErrors();
    if(errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    } // errors message sending done.

    User.findOne({'email':email}, function(err, user) {
        if(err) {
            return done(err); // if there is any error.
        }
        if(!user) {
            return done(null, false, {message: 'No user found!'});
        } // show error message if the email has no record in our Database.
        if(!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password!'});
        } // show error messsage if the password is not correct.

        /* No error! user found! so it's time to give the login parmission to the user. */
        return done(null, user); // err = null.
    });

}));
