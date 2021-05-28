const express = require("express");
const app = express();
const cors = require("cors");
const PostModel = require("./models/PostModel");
const db = require("./db");
const posts = require("./routes/posts");
const users = require("./routes/users");
const path = require("path");

app.use("/images", express.static(path.join("backend/images")));
app.use(cors());
app.use(express.json());

//routes
app.use("/api/posts", posts);
app.use("/api/users", users);

module.exports = app;
