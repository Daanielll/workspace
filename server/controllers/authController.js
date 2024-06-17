const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const prisma = new PrismaClient();

/**
 * Handles user authentication by verifying the provided email and password.
 * If valid, generates a JWT token, sets it as an HTTP-only cookie, and returns the user data.
 */
const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid email or password" });

    jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Failed to generate token" });
        }

        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(202).json(user);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Retrieves user information based on a JWT token from request cookies.
 * Verifies the token and fetches user's ID, username, email, color, and display preferences from the database.
 */
const getUser = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ error: "No auth token" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, results) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Access token could not be verified" });
    }

    const user = await prisma.user.findUnique({
      where: { id: results.id },
      select: {
        id: true,
        username: true,
        email: true,
        color: true,
        displayPreference: true,
      },
    });

    res.json(user);
  });
};

module.exports = { authUser, getUser };
