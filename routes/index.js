var express = require("express");
var router = express.Router();
var oxr = require("open-exchange-rates");
var moment = require("moment");
const Currency = require("../models/Currency");
const listOfCurrencyPriority = require("../assets/priorityOfCurrencyProviders");

const APP_ID = "cea0d1b9d40e4364b7ddf70163ff1cbd";
const currentDate = "2018-09-19";

saveCurrency = async (req, res, next) => {
  let provider = "oxr";
  let day = moment(currentDate).format("YYYY-MM-DD");
  let currentCurrency = await getCurrency(provider, currentDate);
  if (currentCurrency) next();
  else {
    await oxr.set({ app_id: APP_ID });
    let result = await oxr.historical(day, async function(error) {
      if (error) {
        return res.status(404).json({ error });
      }
      const USD = oxr.rates.USD;
      const EUR = oxr.rates.EUR;
      const GBP = oxr.rates.GBP;
      const newCurrency = new Currency({
        provider: "oxr",
        currencies: {
          USDEUR: USD / EUR,
          USDGBP: USD / GBP,
          EURUSD: EUR / USD,
          EURGBP: EUR / GBP,
          GBPUSD: GBP / USD,
          GBPEUR: GBP / EUR
        },
        date: currentDate
      });
      let currency = await newCurrency.save();
      console.log("saveCurrency: ", currency);
    });
    if (result) next();
  }
};

getCurrency = async (provider, day) => {
  console.log("getCurrency! ");
  let toDate = moment(day)
    .subtract(1, "days")
    .format("YYYY-MM-DD");
  let laterDate = moment(day)
    .add(1, "days")
    .format("YYYY-MM-DD");
  return await Currency.findOne({
    provider: provider,
    date: {
      $gte: toDate,
      $lte: laterDate
    }
  });
};

currencyService = async (req, res) => {
  // Get a currency with a provider's priority
  let provider = "oxr";
  console.log("currencyService: ", req.currency);
  let currentCurrency = await getCurrency(provider, currentDate);
  res.status(200).render("index", {
    now: currentCurrency.date,
    provider: currentCurrency.provider,
    oxr_USDEUR: currentCurrency.currencies.USDEUR,
    oxr_USDGBP: currentCurrency.currencies.USDGBP,
    oxr_EURUSD: currentCurrency.currencies.EURUSD,
    oxr_EURGBP: currentCurrency.currencies.EURGBP,
    oxr_GBPUSD: currentCurrency.currencies.GBPUSD,
    oxr_GBPEUR: currentCurrency.currencies.GBPEUR
  });
};

router.get("/", saveCurrency, currencyService);

module.exports = router;
