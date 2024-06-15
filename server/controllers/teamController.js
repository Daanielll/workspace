const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createTeam = async (req, res) => {
  const userId = req.user.id;
  const orgId = Number(req.params.orgId);
  const { teamName } = req.body;

  // Validate input data for teamName and orgId
  if (typeof teamName !== "string" || typeof orgId !== "number") {
    return res.status(400).json({
      error: "Invalid input data",
    });
  }

  try {
    // get all user roles
    const userRoles = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        orgUsers: { select: { role: true } },
      },
    });
    // return error if user not found
    if (!userRoles) return res.status(404).json({ error: "user not found" });
    // check if user has admin role in any of their organizations
    const isAdmin = userRoles.orgUsers.some(
      (orgUser) => orgUser.role.name === "Admin"
    );
    // if not an admin, return error
    if (!isAdmin)
      return res
        .status(403)
        .json({ error: "User does not have admin privileges" });

    // create team with provided name and organization id
    const team = await prisma.team.create({
      data: {
        name: teamName,
        orgId,
      },
    });

    res.status(201).json({
      message: "Team created successfully",
      team,
    });
  } catch (e) {
    console.error(
      `Error creating team for user ${userId} in organization ${orgId}:`,
      e
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createTeam,
};
