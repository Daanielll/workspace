const { PrismaClient } = require("@prisma/client");
const CheckIfUserIsAdmin = require("../middleware/CheckIfUserIsAdmin");

const prisma = new PrismaClient();

// const checkIfUserIsAdmin = async (userId, orgId) => {
//   try {
//     const adminRole = await prisma.orgUsers.findFirst({
//       where: {
//         userId: userId,
//         orgId: orgId,
//         role: {
//           name: "Admin",
//         },
//       },
//     });

//     // If an admin role is found, return true
//     return !!adminRole;
//   } catch (error) {
//     console.error("Error checking admin role:", error);
//     throw new Error("Internal server error");
//   }
// };

const createOrg = async (req, res) => {
  const userId = req.user.id;
  const { orgName } = req.body;

  if (!userId) return res.status(500).json({ error: "Internal server error" });
  if (!orgName)
    return res.status(400).json({ error: "Organization name is required" });

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "user not found" });

    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.org.create({
        data: {
          name: orgName,
        },
      });

      await tx.role.createMany({
        data: [
          {
            name: "Admin",
            orgId: org.id,
          },
          {
            name: "Member",
            orgId: org.id,
          },
        ],
      });
      const roles = await tx.role.findMany({
        where: { orgId: org.id },
      });

      await tx.orgUsers.createMany({
        data: [
          {
            userId: user.id,
            orgId: org.id,
            roleId: roles[0].id,
          },
          {
            userId: user.id,
            orgId: org.id,
            roleId: roles[1].id,
          },
        ],
      });

      return { org };
    });

    res.status(201).json({
      message: "Organization created successfully",
      org: result.org,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserOrgs = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(400).json({ error: "Internal server error" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        orgUsers: { select: { role: true } },
      },
    });
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json({ result: user });
  } catch (e) {
    res.send(e);
  }
};

const createOrgRequest = async (req, res) => {
  const userId = req.user.id;
  const { orgId } = req.body;
  if (!userId) return res.status(500).json({ error: "Internal server error" });
  if (!orgId)
    return res.status(400).json({ error: "Organization ID is required" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { orgUsers: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const org = await prisma.org.findUnique({ where: { id: orgId } });
    if (!org)
      return res.status(404).json({ error: "Could not find the organization" });

    // check if already in org
    const inOrg = user.orgUsers.some((org) => org.orgId == orgId);
    if (inOrg)
      return res
        .status(409)
        .json({ error: "You are already in the organization" });

    // Check if there is already a request
    const existingRequest = await prisma.request.findUnique({
      where: {
        userId_orgId: {
          userId: user.id,
          orgId: org.id,
        },
      },
    });
    if (existingRequest)
      return res.status(409).json({
        error: "User has already requested to join this organization",
      });

    // otherwise create request
    const result = await prisma.request.create({
      data: {
        userId: user.id,
        orgId: org.id,
      },
    });
    res.status(201).json({
      message: "Request created successfully",
      org: result.org,
      user: result.user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};
const createOrgInvite = async (req, res) => {
  let { orgId } = req.params;
  const { userId } = req.body;
  const inviterId = req.user.id;

  if (!userId) return res.status(400).json({ error: "Missing invited user" });
  orgId = Number(orgId);

  if (!userId) return res.status(400).json({ error: "UserId is required" });
  if (!orgId || !orgId > 0)
    return res.status(400).json({ error: "Organization ID is required" });

  try {
    const inviterUser = await prisma.user.findUnique({
      where: { id: inviterId },
      select: {
        username: true,
        orgUsers: {
          select: { role: { select: { name: true } } },
          where: { orgId: orgId },
        },
      },
    });
    if (!inviterUser) return res.status(404).json({ error: "user not found" });
    const hasAdminRole = inviterUser.orgUsers.some(
      (orgUser) => orgUser.role.name === "Admin"
    );
    if (!hasAdminRole)
      return res
        .status(403)
        .json({ error: "User does not have permission to invite" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const org = await prisma.org.findUnique({
      where: { id: orgId },
      select: { orgUsers: true },
    });
    if (!org) return res.status(404).json({ error: "Organization not found" });

    // check if already in org
    const inOrg = org.orgUsers.some((org) => org.userId == userId);
    if (inOrg)
      return res
        .status(409)
        .json({ error: "User is already in the organization" });

    // Check if there is already an invite
    const existingInvite = await prisma.invite.findUnique({
      where: {
        userId_orgId: {
          userId: userId,
          orgId: orgId,
        },
      },
    });

    if (existingInvite)
      return res
        .status(409)
        .json({ error: "User already has an invite from this organization" });

    // otherwise create request
    const result = await prisma.invite.create({
      data: {
        userId: userId,
        orgId: orgId,
        invitedById: inviterId,
      },
    });
    res.status(201).json({
      message: "Invite created successfully",
      result,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editOrgName = async (req, res) => {
  const userId = req.user.id;
  const orgId = Number(req.params.orgId);
  const { newOrgName } = req.body;
  if (!userId) return res.status(500).json({ error: "Internal server error" });
  if (!orgId || !newOrgName)
    return res.status(400).json({
      error: "Missing required fields",
      org: Number(orgId),
      name: newOrgName,
    });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const org = await prisma.org.findUnique({ where: { id: orgId } });
    if (!org)
      return res
        .status(404)
        .json({ error: "Could not find the specified organization" });

    const isAdmin = CheckIfUserIsAdmin(userId, orgId);
    if (!isAdmin)
      return res
        .status(403)
        .json({ error: "Admin role is required for this operation" });

    const updatedOrg = await prisma.org.update({
      where: { id: orgId },
      data: {
        name: newOrgName,
      },
    });

    res.status(200).json({ message: "Organization was updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOrgDetails = async (req, res) => {
  const userId = req.user.id;
  const orgId = Number(req.params.orgId);
  if (!userId) return res.status(500).json({ error: "Internal server error" });
  if (!orgId)
    return res
      .status(400)
      .json({ error: "Missing required fields", org: Number(orgId) });
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    const org = await prisma.org.findUnique({
      where: { id: orgId },
      select: { id: true, name: true },
    });
    if (!orgId)
      return res
        .status(404)
        .json({ error: "Could not find the specified organization" });
    res.status(200).json({ org });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  createOrg,
  getUserOrgs,
  createOrgRequest,
  createOrgInvite,
  editOrgName,
  getOrgDetails,
};
