'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collab = sequelize.define('Collab', {
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Collab.associate = function(models) {
    // associations can be defined here
    Collab.belongsTo(models.Wiki, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Collab.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });



  };
  return Collab;
};