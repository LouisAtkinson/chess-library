const express = require("express");
const router = express.Router();

const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const category_controller = require("../controllers/categoryController");
const copy_controller = require("../controllers/copyController");

router.get("/", book_controller.index);

router.get("/book/create", book_controller.book_create_get);

router.post("/book/create", book_controller.book_create_post);

router.get("/book/:id/delete", book_controller.book_delete_get);

router.post("/book/:id/delete", book_controller.book_delete_post);

router.get("/book/:id/update", book_controller.book_update_get);

router.post("/book/:id/update", book_controller.book_update_post);

router.get("/book/:id", book_controller.book_detail);

router.get("/books", book_controller.book_list);

router.get("/author/create", author_controller.author_create_get);

router.post("/author/create", author_controller.author_create_post);

router.get("/author/:id/delete", author_controller.author_delete_get);

router.post("/author/:id/delete", author_controller.author_delete_post);

router.get("/author/:id/update", author_controller.author_update_get);

router.post("/author/:id/update", author_controller.author_update_post);

router.get("/author/:id", author_controller.author_detail);

router.get("/authors", author_controller.author_list);

router.get("/category/create", category_controller.category_create_get);

router.post("/category/create", category_controller.category_create_post);

router.get("/category/:id/delete", category_controller.category_delete_get);

router.post("/category/:id/delete", category_controller.category_delete_post);

router.get("/category/:id/update", category_controller.category_update_get);

router.post("/category/:id/update", category_controller.category_update_post);

router.get("/category/:id", category_controller.category_detail);

router.get("/categories", category_controller.category_list);

router.get(
  "/copy/create",
  copy_controller.copy_create_get
);

router.post(
  "/copy/create",
  copy_controller.copy_create_post
);

router.get(
  "/copy/:id/delete",
  copy_controller.copy_delete_get
);

router.post(
  "/copy/:id/delete",
  copy_controller.copy_delete_post
);

router.get(
  "/copy/:id/update",
  copy_controller.copy_update_get
);

router.post(
  "/copy/:id/update",
  copy_controller.copy_update_post
);

router.get("/copy/:id", copy_controller.copy_detail);

router.get("/copies", copy_controller.copy_list);

module.exports = router;