const express = require("express");
const router = express.Router();

const collabController = require("../controllers/collabController");
//const validation = require("./validation");

router.post("/wikis/:wikiId/collaborator/create", collabController.addUser);
router.post("/wikis/:wikiId/collaborator/destroy", collabController.destroyUser);

module.exports = router;