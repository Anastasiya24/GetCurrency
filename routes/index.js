var express = require("express");
var router = express.Router();
var oxr = require("open-exchange-rates");
var fx = require("money");
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
