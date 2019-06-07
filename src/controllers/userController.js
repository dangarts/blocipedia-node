const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

//User: ROLE 
//USER: 0 //standard
//USER: 1 //premium
//USER: 2 //admin

//Stripe checkout
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);

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
        
        sgMail
        .send(msg)
        .then(() => {
          //success
        })
        .catch((error) => {
          console.log('error', error);
        });//SENDGRID END

        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "Thanks for signing up");
          req.flash("notice", " confirmation email sent to: " + user.email);
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

        res.redirect("/users/" + req.user.id);
      }
    })
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  show(req, res, next){
     userQueries.getUser(req.params.id, (err, result) => {
       if(err || result.user === undefined){
         req.flash("notice", "No user found with that ID.");
         res.redirect("/");
       } else {
         res.render("users/show", {...result, keyPublishable});
       }
     });
  },

  charge(req, res, next){
    let amount = 1500;

    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    }) 
    .then(customer => 
      stripe.charges.create({
        amount,
        description: "Sample Charge",
        currency: "usd",
        customer: customer.id
      }))
      .then(charge => {
        console.log(req.user.dataValues.id);
        userQueries.upgrade(req.user.dataValues.id);
        req.flash("notice", "Your card has been processed.");
        res.render("users/success")
      });
  },

  downgrade(req, res, next){
    userQueries.downgrade(req.user.dataValues.id);
    req.flash("notice", "You are no longer a premium user!");
    res.redirect("/");
  }

}