const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const prisma = new PrismaClient();

const authUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    res.status(400).json({ error: "Missing required fields" });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    if ((await bcrypt.compare(password, user.password)) == false)
      return res.status(401).json({ error: "Invalid email or password" });

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(202).json(accessToken);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Internal server error" });
  }
};

module.exports = authUser;
