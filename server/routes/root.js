const authToken = require("../middleware/AuthToken");
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { createOrg } = require("../controllers/userController");

authToken;

router.route("").get(authToken, userController.getUserOrgsAndTeams);
router.route("/login").post(authController);

module.exports = router;
