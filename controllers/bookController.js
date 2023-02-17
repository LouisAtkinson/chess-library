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