const authToken = require("../middleware/AuthToken");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router
  .route("/")
  .post(userController.createUser)
  .get(userController.getAllUsers);
router
  .route("/login")
  .post(authController)
  .get(authToken, (req, res) => {
    res.json(req.user);
  });

module.exports = router;
