const Book = require("../models/book");
const Author = require("../models/author");
const Category = require("../models/category");
const Copy = require("../models/copy");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      book_count(callback) {
        Book.countDocuments({}, callback);
      },
      copy_count(callback) {
        Copy.countDocuments({}, callback);
      },
      copy_available_count(callback) {
        Copy.countDocuments({ status: "Available" }, callback);
      },
      author_count(callback) {
        Author.countDocuments({}, callback);
      },
      genre_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Home",
        error: err,
        data: results,
      });
    }
  );
};

exports.book_list = function (req, res, next) {
    Book.find({}, "title author")
      .sort({ title: 1 })
      .populate("author")
      .exec(function (err, list_books) {
        if (err) {
          return next(err);
        }
        res.render("book_list", { title: "Book List", book_list: list_books });
      });
};

exports.book_detail = (req, res, next) => {
    async.parallel(
      {
        book(callback) {
          Book.findById(req.params.id)
            .populate("author")
            .populate("category")
            .exec(callback);
        },
        copy(callback) {
          Copy.find({ book: req.params.id }).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.book == null) {
          const err = new Error("Book not found");
          err.status = 404;
          return next(err);
        }
        res.render("book_detail", {
          title: results.book.title,
          book: results.book,
          copies: results.copy,
        });
      }
    );
};