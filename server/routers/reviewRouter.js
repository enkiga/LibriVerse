const express = require("express");
const reviewController = require("../controllers/reviewController");
const { identifier } = require("../middlewares/identification");
const router = express.Router();

router.post("/create-comment", identifier, reviewController.createReview);
router.get("/view-comment", identifier, reviewController.getReviewsForBook);
router.delete("/delete-comment", identifier, reviewController.deleteReview);
router.patch("/update-comment", identifier, reviewController.updateReview);

module.exports = router;
