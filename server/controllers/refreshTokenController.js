const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.status(401);
  const refreshToken = cookies.jwt;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user.password);
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    if ((await bcrypt.compare(password, user.password)) == false)
      return res.send("no");

    const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Internal server error" });
  }
};

module.exports = authUser;
