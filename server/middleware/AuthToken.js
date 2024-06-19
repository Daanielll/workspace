const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  const cookie = req.cookies.token;
  if (!token && !cookie)
    return res.status(401).json({ error: "No auth token" });

  if (!cookie)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ error: "Access token could not be verified" });
      req.user = decoded;
      next();
    });
  else
    jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ error: "Access token could not be verified" });
      req.user = decoded;
      next();
    });
};

module.exports = authToken;
