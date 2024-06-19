const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// JSON
app.use(express.json());

// CORS
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// COOKIES
app.use(cookieParser());

app.use("/", require("./routes/root"));
app.use("/org", require("./routes/orgRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/teams", require("./routes/teamRoutes"));

app.listen(3000, () => console.log("Server running on port 3000"));
