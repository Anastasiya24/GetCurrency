var express = require("express");
var router = express.Router();
var oxr = require("open-exchange-rates");
var fx = require("money");
const Currency = require("../models/Currency");

const APP_ID = "cea0d1b9d40e4364b7ddf70163ff1cbd";

async function saveCurrency(req, res, next) {
  // Do you have a request on this day? 12pm today
  await oxr.set({ app_id: APP_ID });
  await oxr.latest(async function(error) {
    if (error) {
      console.log(error.toString());
      return false;
    }
    req.now = new Date(oxr.timestamp).toUTCString();
    req.provider = "oxr";
    req.oxr_USD = oxr.rates.USD;
    req.oxr_EUR = oxr.rates.EUR;
    req.oxr_GBP = oxr.rates.GBP;
    const newCurrency = new Currency({
      provider: "oxr",
      currencies: [
        { USD: oxr.rates.USD, EUR: oxr.rates.EUR, GBP: oxr.rates.GBP }
      ]
    });
    await newCurrency.save();
    next();
  });
}

async function currencyService(req, res) {
  // Get a currency with a provider's priority
  res.render("index", {
    now: req.now,
    oxr_USD: req.oxr_USD,
    oxr_EUR: req.oxr_EUR,
    oxr_GBP: req.oxr_GBP
  });
}

router.get("/", saveCurrency, currencyService);

module.exports = router;
