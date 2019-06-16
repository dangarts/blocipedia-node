const ApplicationPolicy = require("./applications");

module.exports = class CollaboratorPolicy extends ApplicationPolicy {
  createCollab() { 
    return this._isPremium(); }
  deleteCollab() { 
    return this._isPremium(); 
  }
}