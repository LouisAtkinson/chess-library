const Book = require("../models/book");
const Category = require("../models/category");

exports.category_list = function (req, res, next) {
    Category.find()
      .sort([["name", "ascending"]])
      .exec(function (err, list_categories) {
        if (err) {
          return next(err);
        }
        res.render("category_list", {
          title: "Category List",
          category_list: list_categories,
        });
      });
  };