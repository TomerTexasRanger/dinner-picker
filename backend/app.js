const express = require("express");
const app = express();
const cors = require("cors");
const PostModel = require("./models/PostModel");
const db = require("./db");
const posts = require("./routes/posts");
const users = require("./routes/users");
const path = require("path");

app.use("/images", express.static(path.join(__dirname, "backend/images")));
// app.use("/", express.static(path.join(__dirname, "angular")));
app.use(cors());
app.use(express.json());

//routes
app.use("/api/posts", posts);
app.use("/api/users", users);
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "angular", "index.html"));
// });

module.exports = app;
