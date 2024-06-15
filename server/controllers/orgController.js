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

module.exports = {
  createOrg,
  getUserOrgs,
};
