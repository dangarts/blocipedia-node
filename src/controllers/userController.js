const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

module.exports = {

  signUp(req, res, next){
    res.render("users/sign-up");
  },

  create(req, res, next){
    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/sign-up");
      } else {

        //SENDGRID
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: user.email,
          from: 'no-reply@blocipedia.com',
          subject: 'Thank you for signing up with Blocipedia!',
          text: 'You made it! Get started ASAP!!!',
          html: '<strong>You made it! Get started ASAP!!!</strong>',
        };
        sgMail.send(msg).then().catch((error) => {
          console.log('error', error);
        });//SENDGRID END

        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        })
        
      }
    });
  },

  signInForm(req, res, next){
    res.render("users/sign-in");
  },

  signIn(req, res, next){
    
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign-in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  // show(req, res, next){


  //    userQueries.getUser(req.params.id, (err, result) => {
 

  //      if(err || result.user === undefined){
  //        req.flash("notice", "No user found with that ID.");
  //        res.redirect("/");
  //      } else {
 

  //        res.render("users/show", {...result});
  //      }
  //    });
  // }

}//END