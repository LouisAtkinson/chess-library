const express = require("express");
const router = express.Router();

const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const category_controller = require("../controllers/categoryController");
const copy_controller = require("../controllers/copyController");

router.get("/", book_controller.index);

module.exports = router;