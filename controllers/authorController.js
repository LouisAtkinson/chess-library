const Author = require("../models/author");
const async = require("async");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

exports.author_list = function (req, res, next) {
    Author.find()
      .sort([["surname", "ascending"]])
      .exec(function (err, list_authors) {
        if (err) {
          return next(err);
        }
        res.render("author_list", {
          title: "Author List",
          author_list: list_authors,
        });
      });
};

exports.author_detail = (req, res, next) => {
    async.parallel(
      {
        author(callback) {
          Author.findById(req.params.id).exec(callback);
        },
        authors_books(callback) {
          Book.find({ author: req.params.id }, "title summary").exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.author == null) {
          const err = new Error("Author not found");
          err.status = 404;
          return next(err);
        }
        res.render("author_detail", {
          title: "Author Detail",
          author: results.author,
          author_books: results.authors_books,
        });
      }
    );
};

exports.author_create_get = (req, res, next) => {
    res.render("author_form", { title: "Create Author" });
  };
  
  exports.author_create_post = [
    body("forename")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("First name must be specified."),
    body("surname")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Surname must be specified."),
    body("date_of_birth", "Invalid date of birth")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
    body("date_of_death", "Invalid date of death")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
    (req, res, next) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        res.render("author_form", {
          title: "Create Author",
          author: req.body,
          errors: errors.array(),
        });
        return;
      }
  
      const author = new Author({
        forename: req.body.forename,
        surname: req.body.surname,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
      author.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(author.url);
      });
    },
];