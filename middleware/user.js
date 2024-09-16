// Middleware for handling users auth
const jwt = require("jsonwebtoken");
const { JWT_SECRETE } = require("../config");

function userMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;
    const [bearer, token] = auth.split(" ");
    const authUser = jwt.verify(token, JWT_SECRETE);
    if (!authUser.username) {
      res.status(403).json({
        message: "you are not authenticated",
      });
    } else {
      req.username = authUser.username;
      next();
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "somethin went wrong",
    });
  }
}

module.exports = userMiddleware;
