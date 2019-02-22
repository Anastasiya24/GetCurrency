var express = require("express");
var router = express.Router();
var oxr = require("open-exchange-rates");
var fx = require("money");
const Currency = require("../models/Currency");

const APP_ID = "cea0d1b9d40e4364b7ddf70163ff1cbd";

saveCurrency = async (req, res, next) => {
  // Do you have a request on this day? 12pm today
  await oxr.set({ app_id: APP_ID });
  await oxr.latest(async function(error) {
    if (error) {
      console.log(error.toString());
      return false;
    }
    const newCurrency = new Currency({
      provider: "oxr",
      currencies: {
        USD: oxr.rates.USD,
        EUR: oxr.rates.EUR,
        GBP: oxr.rates.GBP
      }
    });
    await newCurrency.save();
    next();
  });
};

currencyService = async (req, res) => {
  // Get a currency with a provider's priority
  
  let currentCurrency = await Currency.findOne(
    { provider: "oxr" },
    {},
    { sort: { date: -1 } }
  );
  res.status(200).render("index", {
    now: currentCurrency.date,
    oxr_USD: currentCurrency.currencies.USD,
    oxr_EUR: currentCurrency.currencies.EUR,
    oxr_GBP: currentCurrency.currencies.GBP
  });
};

router.get("/", saveCurrency, currencyService);

module.exports = router;
