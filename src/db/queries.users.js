const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {

  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },


  getUser(id, callback){
    let result = {};
    User.findById(id).then((user) => {
      if(!user) {
        callback(404);
      } else {
        result["user"] = user;
        callback(null, result);
      }
    })
  },

  getAllUsers(callback){
    console.log("queries.users.js:getAllUsers");
    User.scope("allMembers").findAll()
    // User.scope({method: ["allMembers", id]}).findAll()
    .then((users) => {
      
      // result["users"] = users;
       callback(null, users);
    })
    .catch((err) => {
      console.log("queries.users.js:getAllUsers:err");
      callback(err);
    })
  },

  upgrade(id, callback){
    return User.findById(id)
    .then((user) => {
      if(!user){
        return callback("User does not exist!");
      } else {
        return user.updateAttributes({role: "premium"});
      }
    }) .catch((err) => {
      callback(err);
    })
  },

  downgrade(id, callback){
    return User.findById(id)
    .then((user) => {
      if(!user){
        return callback("User does not exist!");
      } else {
        return user.updateAttributes({role: "member"});
      }
    }) .catch((err) => {
      callback(err);
    })
  }

}