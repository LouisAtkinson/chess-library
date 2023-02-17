const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  forename: { type: String, required: true, maxLength: 50 },
  surname: { type: String, required: true, maxLength: 50 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual("name").get(function () {
  let fullname = `${this.forename} ${this.surname}`;
  return fullname;
});

AuthorSchema.virtual("url").get(function () {
  return `/catalogue/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
    return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
});

AuthorSchema.virtual("date_of_birth_iso").get(function () {
return DateTime.fromJSDate(this.date_of_birth).toISODate(); 
});

AuthorSchema.virtual("date_of_death_iso").get(function () {
return DateTime.fromJSDate(this.date_of_death).toISODate();
});


module.exports = mongoose.model("Author", AuthorSchema);