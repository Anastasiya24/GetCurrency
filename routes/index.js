var express = require("express");
var router = express.Router();
var oxr = require("open-exchange-rates");
var fx = require("money");

const APP_ID = "cea0d1b9d40e4364b7ddf70163ff1cbd";

async function saveCurrency(req, res, next) {
  console.log("Express1");
  await oxr.set({ app_id: APP_ID });
  await oxr.latest(function(error) {
    if (error) {
      console.log(error.toString());
      return false;
    }
    console.log("Now: " + new Date(oxr.timestamp).toUTCString());
    console.log("USD -> EUR: " + oxr.rates.EUR);
    console.log("USD -> GBP: " + oxr.rates.GBP);
    fx.rates = oxr.rates;
    fx.base = oxr.base;
  });
  next();
  req.now = new Date(oxr.timestamp).toUTCString();
  req.EUR = oxr.rates.EUR;
  req.GBP = oxr.rates.GBP;
}

router.get("/", saveCurrency, (req, res) => {
  console.log("Express2");
  console.log(`Now: ${req.now} EUR: ${req.EUR} GBP: ${req.GBP} `)
  res.render("index", {
    title: "Express",
    now: req.now,
    EUR: req.now,
    GBP: req.GBP
  });
});

module.exports = router;
