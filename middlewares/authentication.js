const { validateToken } = require("../services/authentication");

function checkForAuthentication(cookieName) {
  return (req, res, next) => {
    const token = req.cookies[cookieName];
    if (!token) {
      return next();
    }
    try {
      const userPayload = validateToken(token);
      req.user = userPayload;
    } catch (e) {}
    return next();
  };
}

module.exports = { checkForAuthentication };
