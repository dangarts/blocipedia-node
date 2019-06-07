const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");

router.get("/users/sign-up", userController.signUp);
router.get("/users/sign-in", userController.signInForm);
router.get("/users/sign-out", userController.signOut);
router.get("/users/:id", userController.show);

router.post("/users/create", validation.validateUsers, userController.create);
router.post("/users/sign-in", validation.validateUsers, userController.signIn);

router.post("/users/:id/upgrade", userController.charge);
router.post("/users/:id/downgrade", userController.downgrade);

module.exports = router;