const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const validation = require("./validation");
const helper = require("../auth/helpers"); //prevents unauthorized users from creating a new wiki.

module.exports = router;

router.get("/wikis/", wikiController.index);
router.get("/wikis/new", wikiController.new);

router.get("/wikis/:id", wikiController.show);


router.post("/wikis/create", wikiController.create, validation.validateWikis, helper.ensureAuthenticated);

router.get("/wikis/:id/edit", wikiController.edit);
router.post("/wikis/:id/update", wikiController.update, validation.validateWikis);

router.post("/wikis/:id/destroy", wikiController.destroy);

