const Author = require("../models/author");
const async = require("async");
const Book = require("../models/book");

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