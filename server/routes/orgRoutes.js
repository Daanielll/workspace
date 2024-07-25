const authToken = require("../middleware/AuthToken");
const express = require("express");
const router = express.Router();
const orgController = require("../controllers/orgController");
const teamController = require("../controllers/teamController");
const { getUserOrgsAndTeams } = require("../controllers/userController");

router
  .route("/")
  .post(authToken, orgController.createOrg)
  .get(authToken, getUserOrgsAndTeams);
router.route("/request").post(authToken, orgController.createOrgRequest);
router.route("/invite/:orgId").post(authToken, orgController.createOrgInvite);
router
  .route("/:orgId")
  .patch(authToken, orgController.editOrgName)
  .get(authToken, orgController.getOrgDetails);
router
  .route("/teams/:orgId")
  .get(teamController.getOrgteams)
  .post(authToken, teamController.createTeam);
module.exports = router;
