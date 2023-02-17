var express = require('express');
var router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/catalogue");
});

module.exports = router;
