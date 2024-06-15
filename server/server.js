const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// JSON
app.use(express.json());

app.use(cors());

// COOKIES
app.use(cookieParser());

app.use("/", require("./routes/root"));
app.use("/org", require("./routes/orgRoutes"));
app.use("/users", require("./routes/userRoutes"));

app.listen(3000, () => console.log("Server running on port 3000"));
