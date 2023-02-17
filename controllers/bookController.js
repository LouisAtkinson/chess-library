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
        title: "Chess Library",
        error: err,
        data: results,
      });
    }
  );
};

