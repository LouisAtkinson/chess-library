const { DateTime } = require("luxon");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CopySchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // reference to the associated book
  status: {
    type: String,
    required: true,
    enum: ["Available", "Loaned", "Reserved"],
    default: "Available",
  },
  due_back: { type: Date, default: Date.now },
});

CopySchema.virtual("url").get(function () {
  return `/catalogue/copy/${this._id}`;
});

CopySchema.virtual("due_back_formatted").get(function () {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

CopySchema.virtual("due_back_iso").get(function () {
return DateTime.fromJSDate(this.due_back).toISODate();
});

module.exports = mongoose.model("Copy", CopySchema);