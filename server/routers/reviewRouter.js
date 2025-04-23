const express = require("express");
const reviewController = require("../controllers/reviewController");
const { identifier } = require("../middlewares/identification");
const router = express.Router();

router.post("/create-review", identifier, reviewController.createReview);
router.get("/view-review", identifier, reviewController.getReviewsForBook);
router.delete("/delete-review", identifier, reviewController.deleteReview);
router.patch("/update-review", identifier, reviewController.updateReview);

module.exports = router;
