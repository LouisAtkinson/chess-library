const Copy = require("../models/copy");
const async = require("async");
const { body, validationResult } = require("express-validator");
const Book = require("../models/book");

exports.copy_list = function (req, res, next) {
    Copy.find()
      .populate("book")
      .exec(function (err, list_copies) {
        if (err) {
          return next(err);
        }
        res.render("copy_list", {
          title: "List of copies",
          copy_list: list_copies,
        });
      });
};

exports.copy_detail = (req, res, next) => {
    Copy.findById(req.params.id)
      .populate("book")
      .exec((err, copy) => {
        if (err) {
          return next(err);
        }
        if (copy == null) {
          const err = new Error("Book copy not found");
          err.status = 404;
          return next(err);
        }
        res.render("copy_detail", {
          title: `Copy: ${copy.book.title}`,
          copy,
        });
      });
};

exports.copy_create_get = (req, res, next) => {
    Book.find({}, "title").exec((err, books) => {
      if (err) {
        return next(err);
      }
      res.render("copy_form", {
        title: "Create Copy",
        book_list: books,
      });
    });
  };
  
  exports.copy_create_post = [
    body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
    body("status").escape(),
    body("due_back", "Invalid date")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
  
    (req, res, next) => {
      const errors = validationResult(req);
  
      const copy = new Copy({
        book: req.body.book,
        status: req.body.status,
        due_back: req.body.due_back,
      });
  
      if (!errors.isEmpty()) {
        Book.find({}, "title").exec(function (err, books) {
          if (err) {
            return next(err);
          }
          res.render("copy_form", {
            title: "Create Copy",
            book_list: books,
            selected_book: copy.book._id,
            errors: errors.array(),
            copy,
          });
        });
        return;
      }
  
      copy.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(copy.url);
      });
    },
];