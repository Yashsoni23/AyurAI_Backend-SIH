const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const apiRoutes = require("./config/routes");
const { verifyToken } = require("./middleware/verifyToken.middleware");
require("./config/db_connection");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  verifyToken(req, res, next);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/", (req, res) => {
  res.send("Server is running !");
});

app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
