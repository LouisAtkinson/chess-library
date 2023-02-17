const Book = require("../models/book");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");

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

exports.category_detail = (req, res, next) => {
    async.parallel(
      {
        category(callback) {
          Category.findById(req.params.id).exec(callback);
        },
  
        category_books(callback) {
          Book.find({ category: req.params.id }).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.category == null) {
          const err = new Error("Category not found");
          err.status = 404;
          return next(err);
        }
        res.render("category_detail", {
          title: "Category Detail",
          category: results.category,
          category_books: results.category_books,
        });
      }
    );
};

exports.category_create_get = (req, res, next) => {
    res.render("category_form", { title: "Create Category" });
};

exports.category_create_post = [
    body("name", "Category name required").trim().isLength({ min: 1 }).escape(),
  
    (req, res, next) => {
      const errors = validationResult(req);
  
      const category = new Category({ name: req.body.name });
  
      if (!errors.isEmpty()) {
        res.render("category_form", {
          title: "Create Category",
          category,
          errors: errors.array(),
        });
        return;
      } else {
        Category.findOne({ name: req.body.name }).exec((err, found_category) => {
          if (err) {
            return next(err);
          }
  
          if (found_category) {
            res.redirect(found_category.url);
          } else {
            category.save((err) => {
              if (err) {
                return next(err);
              }
              res.redirect(category.url);
            });
          }
        });
      }
    },
];