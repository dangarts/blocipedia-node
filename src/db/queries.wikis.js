const Wiki = require('./models').Wiki;
const Collab = require('./models').Collab;
const User = require('./models').User;
const Authorizer = require('../policies/wiki');

module.exports = {

  // getAllWikis(callback){
  //   return Wiki.all()
  //   .then((wikis) => {
  //     callback(null, wikis);
  //   })
  //   .catch((err) => {
  //     callback(err);
  //   })
  // },

    
getAllWikis(callback){
  return Wiki.all({
    include: [
      {model: Collab, as: "collabs", include: [
        {model: User }
      ]}
    ]
  })
  .then((wikis) => {
    callback(null, wikis);
  })
  .catch((err) => {
    callback(err);
  })
},

  getWiki(id, callback){
    return Wiki.findByPk(id, {
      include: [
        {model: Collab, as: "collabs", include: [
          {model: User}
        ]}
      ]
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  addWiki(addWiki, callback){
    return Wiki.create(addWiki)
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  updateWiki(req, updatedWiki, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      wiki.update(updatedWiki, {
        fields: Object.keys(updatedWiki)
      })
      .then(() => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      });
    });
  },

  deleteWiki(req, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {

      const authorized = new Authorizer(req.user, wiki).destroy();
      if(authorized) {

        wiki.destroy()
        .then((res) => {
          callback(null, wiki);
        });
      } else {
        req.flash("notice", "AUTHORIZER: You are not authorized to do that.")
        callback(401);
      }

    })
    .catch((err) => {
      callback(err);
    });
  },

  makeWikiPublic(id){
    return Wiki.all()
    .then((wikis) => {
        wikis.forEach((wiki) => {
            if(wiki.userId == id && wiki.private == true){
                wiki.update({
                    private: false
                })
            }
        })
    })
    .catch((err) => {
        callback(err);
    })
},

}