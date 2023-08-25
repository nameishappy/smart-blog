const mongoose = require("mongoose");
const User = require("./user");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
