require("dotenv").config();
const express = require("express");
const path = require("path");
const User = require("./models/user");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthentication } = require("./middlewares/authentication");
const Blog = require("./models/blog");
const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL)
  .then((e) => {
    console.log("connected to mongo");
  })
  .catch((e) => {
    console.log("error connecting to mongo");
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication("token"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", { user: req.user, blogs: allBlogs });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
