const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  publisher: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

BookSchema.virtual("url").get(function () {
  return `/catalogue/book/${this._id}`;
});

module.exports = mongoose.model("Book", BookSchema);