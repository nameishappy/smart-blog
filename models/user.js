const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForuser } = require("../services/authentication");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    profilePictureUrl: {
      type: String,
      default: "/images/default.png",
    },
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hash = createHmac("sha256", salt).update(user.password).digest("hex");
  this.salt = salt;
  this.password = hash;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (userProvidedHash !== hashedPassword) {
      throw new Error("Incorrect password or Email! Try again");
    }
    const token = createTokenForuser(user);
    return token;
  }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
