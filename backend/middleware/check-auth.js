const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = jwt.verify(
      req.headers.authorization.split(" ")[1],
      "tomerSecret"
    );
    if (!token) return res.status(401).send("Missing Token");
    req.user = { email: token.email, _id: token.userId };
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).send("Invalid token");
  }
};

module.exports = auth;
