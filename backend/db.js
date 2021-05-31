const express = require("express");
const mongoose = require("mongoose");

const db = mongoose
  .connect(
    `mongodb+srv://tomer:otQC2mjJX5vtvkNo@cluster0.v14ve.mongodb.net/postApp`,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    }
  )
  .then(console.log("Connected to DataBase"))
  .catch("Failed to connect to DataBase");

module.exports = db;
