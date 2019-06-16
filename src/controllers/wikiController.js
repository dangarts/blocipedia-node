const wikiQueries = require('../db/queries.wikis.js');
const userQueries = require('../db/queries.users.js')
const Authorizer = require('../policies/wiki');
const markdown = require('markdown').markdown;

module.exports = {

  index(req, res, next){
    wikiQueries.getAllWikis((err, wikis) => {

      if(err){
        console.log(err);
        res.redirect(500, "/");
      } else {

        // console.log("----------------------------------------------------------");
        // console.log(wikis[4].collabs[1].userId);
 
        // userQueries.getUser(req.params.id, (err, result) => {
        //   if(err || result.user === undefined){
        //     req.flash("notice", "No user found with that ID.");
        //     res.redirect("#");
        //   } else {
        //     res.render("wikis/index", {wikis,...result});
        //   }
        // });

        res.render("wikis/index", {wikis});
      }
    })
  },

  new(req, res, next){
    const authorized = new Authorizer(req.user).new();
    if (authorized) {

      res.render("./wikis/new");

    } else {
      req.flash("notice","AUTHORIZER: You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  create(req, res, next){
    const authorized = new Authorizer(req.user).create();
    if (authorized) {

      let newWiki= {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        userId: req.user.id
      };

      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if(err){
          res.redirect(500, "/wikis/new");
        } else {
          res.redirect(303, "/wikis/");
        }
      });

    } else {
      req.flash("notice","AUTHORIZER: You are not authorized to do that.");
      res.redirect("/wikis");
    }
    
  },

  show(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(404, "/");
      } else {
        wiki.body = markdown.toHTML(wiki.body);
        res.render("./wikis/show", {wiki});
      }
    });
  },

  destroy(req, res, next){
    wikiQueries.deleteWiki(req, (err, wiki) => {
      if(err){
        res.redirect(err, `/wikis/${req.params.id}`)
      } else {
        res.redirect(303, "/wikis/")
      }
    });
  },

  edit(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {

      if(err || wiki == null){
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user).edit();
        if (authorized) {

        userQueries.getAllUsers((err, users) => {
          if(err || users === undefined){
            req.flash("notice", "ERR: Users can't be retrieved.");
            res.redirect("#");
          } else {
            res.render("wikis/edit", {wiki,users});
          }
        });

        } else {
          req.flash("notice","AUTHORIZER: You are not authorized to do that.");
          res.redirect("/wikis");
        }
      }
    });
  },

  update(req, res, next){
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if(err || wiki == null){
        console.log(err);
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        req.flash("notice","Successful edit");
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  }
}