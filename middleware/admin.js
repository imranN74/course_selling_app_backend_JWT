// Middleware for handling admin auth
const jwt = require("jsonwebtoken");
const { JWT_SECRETE } = require("../config");
function adminMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;
    const [bearer, token] = auth.split(" ");
    const authUser = jwt.verify(token, JWT_SECRETE);
    if (!authUser.username) {
      return res.status(403).json({
        message: "you are not authenticated",
      });
    } else if (authUser.isAdmin != true) {
      return res.status(401).json({
        message: "you are not authorized",
      });
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "somethin went wrong",
    });
  }
}

module.exports = adminMiddleware;
