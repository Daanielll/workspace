const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = checkIfUserIsAdmin = async (userId, orgId) => {
  if (!userId || !orgId) {
    throw new Error("Missing required parameters");
  }

  try {
    const adminRole = await prisma.orgUsers.findFirst({
      where: {
        userId,
        orgId,
        role: {
          name: "Admin",
        },
      },
    });

    // If an admin role is found, return true
    return !!adminRole;
  } catch (error) {
    console.error("Error checking admin role:", error);
    throw new Error("Internal server error");
  }
};
