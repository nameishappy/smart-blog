const { Router } = require("express");
const User = require("../models/user");

const router = Router();
router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render("signin", { error: "Please fill all the fields" });
  }
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    if (token) {
      return res.cookie("token", token).redirect("/");
    }
  } catch (e) {
    res.render("signin", { error: e.message });
  }
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    res.render("signup", { error: "Please fill all the fields" });
  }
  const user = await User.create({ fullName, email, password });
  res.redirect(req.baseUrl + "/signin");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});
module.exports = router;
