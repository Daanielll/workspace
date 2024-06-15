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

module.exports = {
  createUser,
  getAllUsers,
  getUserOrgsAndTeams,
};
