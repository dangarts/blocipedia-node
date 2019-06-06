'use strict';

const faker = require("faker");

let users = [];

for(let i = 1 ; i <= 15 ; i++){
  users.push({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: "password",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 0
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("Users", null, {});
  }
};