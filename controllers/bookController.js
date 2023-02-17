const Book = require("../models/book");
const Author = require("../models/author");
const Category = require("../models/category");
const Copy = require("../models/copy");
const { body, validationResult } = require("express-validator");

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

exports.book_create_get = (req, res, next) => {
  async.parallel(
    {
      authors(callback) {
        Author.find(callback);
      },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("book_form", {
        title: "Create Book",
        authors: results.authors,
        categories: results.categories,
      });
    }
  );
};

exports.book_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("publisher", "Publisher must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category.*").escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      publisher: req.body.publisher,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {

      async.parallel(
        {
          authors(callback) {
            Author.find(callback);
          },
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          for (const category of results.categories) {
            if (book.category.includes(category._id)) {
              category.checked = "true";
            }
          }
          res.render("book_form", {
            title: "Create Book",
            authors: results.authors,
            categories: results.categories,
            book,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    book.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(book.url);
    });
  },
];

exports.book_update_get = (req, res, next) => {
    async.parallel(
      {
        book(callback) {
          Book.findById(req.params.id)
            .populate("author")
            .populate("category")
            .exec(callback);
        },
        authors(callback) {
          Author.find(callback);
        },
        categories(callback) {
          Category.find(callback);
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
        for (const category of results.categories) {
          for (const bookCategory of results.book.category) {
            if (category._id.toString() === bookCategory._id.toString()) {
              category.checked = "true";
            }
          }
        }
        res.render("book_form", {
          title: "Update Book",
          authors: results.authors,
          categories: results.categories,
          book: results.book,
        });
      }
    );
  };
  
  exports.book_update_post = [
    (req, res, next) => {
      if (!Array.isArray(req.body.category)) {
        req.body.category =
          typeof req.body.category === "undefined" ? [] : [req.body.category];
      }
      next();
    },
  
    body("title", "Title must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("author", "Author must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("summary", "Summary must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("publisher", "Publisher must not be empty").trim().isLength({ min: 1 }).escape(),
    body("category.*").escape(),
  
    (req, res, next) => {
      const errors = validationResult(req);
  
      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        publisher: req.body.publisher,
        category: typeof req.body.category === "undefined" ? [] : req.body.category,
        _id: req.params.id,
      });
  
      if (!errors.isEmpty()) {
  
        async.parallel(
          {
            authors(callback) {
              Author.find(callback);
            },
            categories(callback) {
              Category.find(callback);
            },
          },
          (err, results) => {
            if (err) {
              return next(err);
            }
  
            for (const category of results.categories) {
              if (book.category.includes(category._id)) {
                category.checked = "true";
              }
            }
            res.render("book_form", {
              title: "Update Book",
              authors: results.authors,
              categories: results.categories,
              book,
              errors: errors.array(),
            });
          }
        );
        return;
      }
  
      Book.findByIdAndUpdate(req.params.id, book, {}, (err, thebook) => {
        if (err) {
          return next(err);
        }
  
        res.redirect(thebook.url);
      });
    },
  ];