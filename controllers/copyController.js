const Copy = require("../models/copy");
const async = require("async");

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