module.exports = {
  validateUsers(req, res, next) {

//We check that the method used was POST and if so, use the methods provided by express-validator to check URL parameters and body of the request for the validations we need.
    if(req.method === "POST") {

//checkParams and checkBody can be called with two arguments. One is the parameter/property we are checking and the second is an error message to return if the validation fails. These methods return an object to which we can chain validation checkers like notEmpty and  isLength. For title, we check that the length is at least two characters long.
  req.checkBody("email", "must be valid").isEmail();
  req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6})
  req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
}

//We gather any validation errors.
    const errors = req.validationErrors();

    if (errors) {

//If we find errors we need to let the user know so they adjust their input. We will install the express-flash module this in the next section. It helps us load messages by using req.flash.

  req.flash("error", errors);
  return res.redirect(req.headers.referer);
} else {
  return next();
}
  }
}