var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/allproduct", function (req, res) {
 
  // res.redirect("/allproduct");
  res.send("hi")

});

module.exports = router;