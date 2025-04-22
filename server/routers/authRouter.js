const express = require("express");
const authController = require("../controllers/authController");
const { identifier } = require("../middlewares/identification");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/signout", identifier, authController.signout);
router.get("/user", identifier, authController.getCurrentUser);
router.patch("/add-favorite", identifier, authController.addFavorite);
router.patch("/follow-user", identifier, authController.followUser);
router.patch("/unfollow-user", identifier, authController.unfollowUser);

module.exports = router;
