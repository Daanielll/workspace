const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createOrg = async (req, res) => {
  const userId = req.user.id;
  const { orgName } = req.body;

  if (!userId) return res.status(400).json({ error: "Internal server error" });
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

      const role = await tx.role.create({
        data: {
          name: "Admin",
          orgId: org.id,
        },
      });

      const orgUsers = await tx.orgUsers.create({
        data: {
          userId: user.id,
          orgId: org.id,
          roleId: role.id,
        },
      });

      return { org, role, orgUsers };
    });

    res.status(201).json({
      message: "Organization created successfully",
      org: result.org,
      role: result.role,
      orgUsers: result.orgUsers,
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
  if (!userId) return res.status(400).json({ error: "Internal server error" });
  if (!orgId)
    return res.status(400).json({ error: "Organization ID is required" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { orgUsers: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const org = await prisma.org.findUnique({ where: { id: orgId } });
    if (!org) return res.status(404).json({ error: "Organization not found" });

    // check if already in org
    const inOrg = user.orgUsers.some((org) => org.orgId == orgId);
    if (inOrg)
      return res
        .status(409)
        .json({ error: "User is already in the organization" });

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
      return res
        .status(409)
        .json({
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
  orgId = Number(orgId);

  if (!userId) return res.status(400).json({ error: "UserId is required" });
  if (!orgId || !orgId > 0)
    return res.status(400).json({ error: "Organization ID is required" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const org = await prisma.org.findUnique({
      where: { id: orgId },
      include: { orgUsers: true },
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
          userId: user.id,
          orgId: org.id,
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
        userId: user.id,
        orgId: org.id,
      },
    });
    res.status(201).json({
      message: "Invite created successfully",
      org: result.org,
      user: result.user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  createOrg,
  getUserOrgs,
  createOrgRequest,
  createOrgInvite,
};
