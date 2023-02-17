const Author = require("../models/author");

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