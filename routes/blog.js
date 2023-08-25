const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", { user: req.user });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  res.render("blog", { blog, user: req.user, comments });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/${req.file.filename}`,
  });
  res.redirect("/");
});

router.post("/comment/:id", async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.id,
    createdBy: req.user._id,
  });
  res.redirect(`/blog/${req.params.id}`);
});

module.exports = router;
