const User = require('./models').User;
const Wiki = require('./models').Wiki;
const Collab = require('./models').Collab;
const Authorizer = require("../policies/collaborator");

module.exports = {

  createCollab(createCollab, callback){
    return Collab.create(createCollab)
    .then((collab) => {
      callback(null, collab);
    })
    .catch((err) => {
      callback(err);
    });
  },

  deleteCollab(req, callback){

    let collaboratorId = req.body.collaborator;
    let wikiId = req.params.wikiId;

    const authorized = new Authorizer(req.user, Wiki, collaboratorId).destroy();

    if(authorized){
      Collab.destroy({ where: {
          userId: collaboratorId,
          wikiId: wikiId
      }})
      .then((deletedRecordsCount) => {
          callback(null, deletedRecordsCount);
      })
      .catch((err) => {
          callback(err);
      });
      } else {
          req.flash("notice", "You are not authorized to do that.");
          callback(401);
      }

    // console.log(collaboratorId, wikiId);

    // return Collab.findByPk(req.body.collaborator)
    // .then((collab) => {
    //   const authorized = new Authorizer(req.user, collab).deleteCollab();
    //   if(authorized){
    //     collab.destroy();
    //     callback(null, collab)
    //   } else {
    //     req.flash("notice", "You are not authorized to do that.")
    //     callback(401)
    //   }
    // })


  }

}