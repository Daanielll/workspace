const authToken = require("../middleware/AuthToken");
const express = require("express");
const router = express.Router();
const orgController = require("../controllers/orgController");
const teamController = require("../controllers/teamController");

router
  .route("/")
  .post(authToken, orgController.createOrg)
  .get(authToken, orgController.getUserOrgs);
router.route("/:orgId").post(authToken, teamController.createTeam);

module.exports = router;
