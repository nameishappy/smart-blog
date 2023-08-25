const jwt = require("jsonwebtoken");
const { validate } = require("../models/user");

const secret = "Iam$uperMan";

function createTokenForuser(user) {
  const payload = {
    name: user.fullName,
    _id: user._id,
    email: user.email,
    role: user.role,
    profilePictureUrl: user.profilePictureUrl,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = { createTokenForuser, validateToken };
