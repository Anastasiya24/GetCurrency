var express = require("express");
var router = express.Router();
var oxr = require("open-exchange-rates");
var fx = require("money");
var Money = require("moneyjs");
const Currency = require("../models/Currency");
const listOfCurrencyPriority = require("../assets/priorityOfCurrencyProviders");

const APP_ID = "cea0d1b9d40e4364b7ddf70163ff1cbd";

saveCurrency = async (req, res, next) => {
  // Do you have a request on this day? 12pm today
  await oxr.set({ app_id: APP_ID });
  await oxr.latest(async function(error) {
    if (error) {
      return res.status(404).json({ error });
    }
    const newCurrency = new Currency({
      provider: "oxr",
      currencies: {
        USD: new Money(oxr.rates.USD, Money.USD),
        EUR: new Money(oxr.rates.EUR, Money.EUR),
        GBP: new Money(oxr.rates.GBP, Money.GBP)
      }
    });
    await newCurrency.save();
  });
  next();
};

getCurrency = async provider => {
  return await Currency.findOne(
    { provider: provider },
    {},
    { sort: { date: -1 } }
  );
};

currencyService = async (req, res) => {
  // Get a currency with a provider's priority
  let provider = "oxr";
  let currentCurrency = await getCurrency(provider);
  return res.status(200).render("index", {
    now: currentCurrency.date,
    oxr_USD: currentCurrency.currencies.USD,
    oxr_EUR: currentCurrency.currencies.EUR,
    oxr_GBP: currentCurrency.currencies.GBP
  });
};

router.get("/", saveCurrency, currencyService);

module.exports = router;
