const { PrismaClient } = require("@prisma/client");

const bcrypt = require("bcrypt");
const authToken = require("../middleware/AuthToken");

const prisma = new PrismaClient();

const createUser = async (req, res) => {
  const { username, email, password, color, displayPreference } = req.body;
  try {
    if (!email || !username || !password)
      res.status(400).json({ error: "Missing required fields" });
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email is already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        color,
        displayPreference,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
};

const getUserOrgsAndTeams = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(400).json({ error: "Internal server error" });

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const orgs = await prisma.org.findMany({
      include: {
        teams: { select: { id: true, name: true } },
      },
      where: {
        orgUsers: { some: { userId } },
      },
    });

    res.status(200).json(orgs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserInvites = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(500).json({ error: "Internal server error" });
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const invites = await prisma.invite.findMany({
      where: { userId },
      select: { invitedBy: { select: { username: true } }, org: true },
    });
    return res.status(200).json(invites);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const respondToInvite = async (req, res) => {
  const userId = req.user.id;
  const { response, orgId } = req.body;
  if (!userId) return res.status(500).json({ error: "Internal server error" });
  if (!response || !orgId)
    return res.status(400).json({ error: "Missing required fields" });
  if (response != 0 && response != 1)
    return res.status(400).json({ error: "Invalid response" });
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return res.status(404).json({ error: "Could not find user" });
    const invite = await prisma.invite.findUnique({
      where: { userId_orgId: { userId: userId, orgId: orgId } },
      select: { orgId: true },
    });

    if (!invite)
      return res
        .status(404)
        .json({ error: "Could not find an invite from this organization" });

    // if user rejects
    if (response == 0) {
      await prisma.invite.delete({
        where: {
          userId_orgId: {
            userId: userId,
            orgId: orgId,
          },
        },
      });
      return res.status(204).json({ message: "Request has been rejected" });
    }

    //if user accepts
    const result = await prisma.$transaction(async (tx) => {
      const role = await tx.role.findFirst({
        where: { AND: [{ orgId: orgId }, { name: "Member" }] },
        select: { id: true },
      });

      if (!role) {
        return res.status(500).json({ error: "Internal server error" });
      }

      const orgUser = await tx.orgUsers.create({
        data: {
          userId: userId,
          orgId: orgId,
          roleId: role.id,
        },
      });

      await tx.invite.delete({
        where: {
          userId_orgId: {
            userId: userId,
            orgId: orgId,
          },
        },
      });
      return { role, orgUser };
    });
    return res.status(201).json({
      message: "Joined an organization successfully",
      role: result.role,
      orgUser: result.orgUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const searchForUser = async (req, res) => {
  const { query } = req.query;
  const id = Number(req.query.id);
  if (!query && !id) {
    return res.status(200).json([]);
  }
  try {
    if (!id) {
      const lowerCaseQuery = query.toLowerCase();
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: lowerCaseQuery, mode: "insensitive" } },
            { username: { contains: lowerCaseQuery, mode: "insensitive" } },
          ],
        },
        take: 6,
        select: {
          password: false,
          email: true,
          username: true,
          id: true,
          color: true,
          displayPreference: true,
        },
      });
      res.status(200).json(users);
    } else {
      const user = await prisma.user.findUnique({
        where: { id: id },
        select: {
          password: false,
          email: true,
          username: true,
          id: true,
          color: true,
          displayPreference: true,
        },
      });
      res.status(200).json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const searchForId = async (req, res) => {
//   const { id } = req.query;
//   if (!id) {
//     return res.status(400).json({ error: "Query is required" });
//   }
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: id },
//     });
//     res.status(200).json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
module.exports = {
  createUser,
  getAllUsers,
  getUserOrgsAndTeams,
  getUserInvites,
  respondToInvite,
  searchForUser,
};
