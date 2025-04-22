const express = require("express");
const recommendationController = require("../controllers/recommendationController");
const { identifier } = require("../middlewares/identification");
const router = express.Router();

router.post(
  "/create-recommendation",
  identifier,
  recommendationController.createRecommendation
);
router.get(
  "/user-recommendation",
  identifier,
  recommendationController.userRecommendation
);
router.delete(
  "/delete-recommendation",
  identifier,
  recommendationController.deleteRecommendation
);
router.patch(
  "/update-recommendation",
  identifier,
  recommendationController.updateRecommendation
);

module.exports = router;
