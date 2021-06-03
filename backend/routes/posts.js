const express = require("express");
const router = express.Router();
const PostModel = require("../models/PostModel");
const auth = require("../middleware/check-auth");
const multer = require("../middleware/multer");

// route: POST /api/posts
// useage: Add a new post
// auth: private

router.post("/", auth, multer, async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  let post = new PostModel({
    title: req.body.title,
    ingredients: req.body.ingredients,
    recipe: req.body.recipe,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.user._id,
  });
  try {
    let resData = await post.save();
    console.log({ resData });

    res.status(201).json({ msg: "Post added successfully", post: resData });
  } catch (error) {
    console.error(error.error);
    res.status(400).send("Failed to add a post");
  }
});

// route: PUT /api/posts/:id
// useage: Update a post
// auth: private

router.put("/:id", auth, multer, async (req, res) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const theId = req.params.id;
  const post = new PostModel({
    _id: theId,
    title: req.body.title,
    content: req.body.content,
    imagePath,
    creator: req.user._id,
  });

  try {
    let resPost = await PostModel.updateOne(
      { _id: theId, creator: req.user._id },
      post
    );
    if (resPost.n === 0) {
      return res.status(401).json({ msg: "Cannot edit other people's posts" });
    }
    res.status(201).json({ msg: "Post updated successfully", resPost });
  } catch (error) {
    console.error(error.error);
    res.status(500).send("Couldn't update post");
  }
});

// route: GET /api/posts/random
// useage: Fetch a random post
// auth: public
router.get("/random", async (req, res) => {
  console.log("works");
  try {
    let posts = await PostModel.find();
    let postsNum = await PostModel.find().countDocuments();
    let randomNum = Math.floor(Math.random() * postsNum);
    console.log(randomNum);
    res.status(200).json(posts[randomNum]);
  } catch (error) {
    console.log(error.error);
  }
});

// route: GET  /api/posts/:id
// useage: Fetch a post by ID
// auth: public

router.get("/:id", async (req, res) => {
  const theId = req.params.id;
  try {
    let post = await PostModel.findById(theId);

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fetching post failed");
  }
});

// route: GET /api/posts
// useage: Fetch all posts and limit for pagination
// auth: public

router.get("/", async (req, res) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = PostModel.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  try {
    let posts = await postQuery;
    let maxPosts = await PostModel.find().countDocuments();
    res.status(200).json({ msg: "Data fetched successfully", posts, maxPosts });
  } catch (error) {
    console.log(error.error);
    res.status(500).send("Fetching posts failed");
  }
});

// route: Delete /api/posts/:id
// useage: Delete a post by ID
// auth: private

router.delete("/:id", auth, async (req, res) => {
  const theId = req.params.id;
  try {
    let post = await PostModel.deleteOne({ _id: theId, creator: req.user._id });
    console.log(post);
    if (post.n === 0) {
      return res
        .status(401)
        .json({ msg: "Cannot delete other people's posts" });
    }
    res.status(201).json({ msg: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to delete post");
  }
});

module.exports = router;
