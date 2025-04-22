const express = require("express");
const commentController = require("../controllers/commentController");
const { identifier } = require("../middlewares/identification");
const router = express.Router();

router.post("/create-comment", identifier, commentController.createComment);
router.get("/view-comment", identifier, commentController.viewComments);
router.delete("/delete-comment", identifier, commentController.deleteComment);
router.patch("/update-comment", identifier, commentController.updateComment);

module.exports = router;
