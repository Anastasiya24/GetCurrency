var express = require("express");
var router = express.Router();
var oxr = require("open-exchange-rates");
var fx = require("money");

const APP_ID = "cea0d1b9d40e4364b7ddf70163ff1cbd";

async function saveCurrency(req, res, next) {
  console.log("Express1");
  // Do you have a request on this day?
  await oxr.set({ app_id: APP_ID });
  await oxr.latest(function(error) {
    if (error) {
      console.log(error.toString());
      return false;
    }
    // Save this data on database
    req.now = new Date(oxr.timestamp).toUTCString();
    req.USD = oxr.rates.USD;
    req.EUR = oxr.rates.EUR;
    req.GBP = oxr.rates.GBP;
    next();
  });
}

async function currencyService(req, res) {
  console.log("Express2");
  res.render("index", {
    now: req.now,
    USD: req.USD,
    EUR: req.EUR,
    GBP: req.GBP
  });
}

router.get("/", saveCurrency, currencyService);

module.exports = router;
