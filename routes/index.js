const express = require("express");
const router = express.Router();
const oxr = require("open-exchange-rates");
const moment = require("moment");
const Currency = require("../models/Currency");
const listOfCurrencyPriority = require("../assets/priorityOfCurrencyProviders");
const oxrProviderSaveCurrency = require("../service/oxr");
const currencyLayerProviderSaveCurrency = require("../service/cl");

const currentDate = "2019-02-25";

currencyMiddleware = async (req, res, next) => {
  let day = moment(currentDate).format("YYYY-MM-DD");
  let currentCurrency = await getCurrency(currentDate, "m");
  console.log("currencyMiddleware");

  if (currentCurrency) next();
  else {
    // Get a currency with a provider's priority
    // oxrProviderSaveCurrency(day, res, next);
    currencyLayerProviderSaveCurrency(day, res, next);
  }
};

getCurrency = async (day, o) => {
  // Get a currency with a provider's priority
  let provider = "oxr";
  console.log("getCurrency! ", o);
  let toDate = moment(day)
    .subtract(1, "days")
    .format("YYYY-MM-DD");
  let laterDate = moment(day)
    .add(1, "days")
    .format("YYYY-MM-DD");

  return await Currency.findOne({
    // provider: provider,
    date: {
      $gte: toDate,
      $lte: laterDate
    }
  });
};

currencyService = async (req, res) => {
  let currentCurrency = await getCurrency(currentDate, "s");
  console.log("currencyService");
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

router.get("/", currencyMiddleware, currencyService);

module.exports = router;
