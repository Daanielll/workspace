const authToken = require("../middleware/AuthToken");
const express = require("express");
const router = express.Router();

router.route("/");

module.exports = router;
