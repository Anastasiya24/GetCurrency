var express = require("express");
var router = express.Router();

saveCurrency = (req, res, next) => {
  console.log("Express1");
  next();
};

router.get("/", saveCurrency, (req, res) => {
  console.log("Express2");
  res.render("index", { title: "Express" });
});

module.exports = router;
