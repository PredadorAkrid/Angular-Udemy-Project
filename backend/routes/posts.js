const express = require("express");
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");
const postController = require("../controller/posts")
const router = express.Router();



router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  postController.addPost
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  postController.updatePost
);

router.get("", postController.getPosts);

router.get("/:id", postController.getPostId);

router.delete("/:id", checkAuth, postController.deletePosts );

module.exports = router;
