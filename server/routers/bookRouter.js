const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();

router.get("/get-book", bookController.getBook);

module.exports = router;
