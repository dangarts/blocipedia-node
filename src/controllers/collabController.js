 const collabQueries = require("../db/queries.collabs");
 const Authorizer = require("../policies/collaborator");
 const Collab = require('../db/models').Collab;
 
 module.exports = {
   addUser(req, res, next){
     const authorized = new Authorizer(req.user).createCollab();


       Collab.findOne({where: {userId: req.body.collaborators}})
        .then((collabAvailable) => {

          if (collabAvailable == null){

            if(authorized) {
              let newCollab = {
                wikiId: req.params.wikiId,
                userId: req.body.collaborators
              };
      
              collabQueries.createCollab(newCollab, (err, collab) => {
                if(err){
                  req.flash("error", err);
                }
      
                req.flash("notice", "User Added")
                res.redirect(req.headers.referer);
              });
            } else {
              req.flash("notice", "You must be signed in to do that.")
              req.redirect("/");
            }

          } else {
            req.flash("notice", "User already exist as a collaborator")
            res.redirect(req.headers.referer);
          }
        })
   },
 
   destroyUser(req, res, next){
     
    collabQueries.deleteCollab(req, (err, collab) => {
       if(err){
         console.log(err);
        req.flash("error", err);
         res.redirect(err, req.headers.referer);
       } else {
        req.flash("notice", "User removed")
         res.redirect(req.headers.referer);
       }
     });
   }
 }