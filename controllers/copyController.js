const Copy = require("../models/copy");

exports.copy_list = function (req, res, next) {
    Copy.find()
      .populate("book")
      .exec(function (err, list_copies) {
        if (err) {
          return next(err);
        }
        // Successful, so render
        res.render("copy_list", {
          title: "List of copies",
          copy_list: list_copies,
        });
      });
  };