const express = require("express");
const authController = require("../controllers/authController");
const { identifier } = require("../middlewares/identification");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/signout", identifier, authController.signout);
router.get("/user", identifier, authController.getCurrentUser);
router.get("/user-info/:userId", authController.getUserById);
router.patch("/add-favorite", identifier, authController.addFavorite);
router.patch("/delete-favorite", identifier, authController.removeFavorite);
router.get("/favorite-books", identifier, authController.getAllFavourites);
router.patch("/follow-user/:UserId", identifier, authController.followUser);
router.patch("/unfollow-user/:UserId", identifier, authController.unfollowUser);
router.get("/suggestions", identifier, authController.suggestBooks);

module.exports = router;
