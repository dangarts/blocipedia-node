const ApplicationPolicy = require("./applications");

module.exports = class WikiPolicy extends ApplicationPolicy {
   new() { return this._anyMember(); }
   create() { return this.new(); }
   edit() { return this._anyMember(); }
   update() { return this.edit(); }
   destroy() { return this.update(); }
 }