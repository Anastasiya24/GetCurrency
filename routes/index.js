const express = require("express");
const router = express.Router();
const moment = require("moment");
const Currency = require("../models/Currency");
const listOfCurrencyPriority = require("../assets/priorityOfCurrencyProviders");
const currencyLayerProviderSaveCurrency = require("../service/currency-layer");

// INPUT DATA
const currentDate = "2019-02-26";
const initialSum = 100;
const initialCurrency = "GBP";
const finallyCurrency = "EUR"; 

currencyMiddleware = async (req, res, next) => {
  let day = moment(currentDate).format("YYYY-MM-DD");
  let currentCurrency = await getCurrency(currentDate);
  if (currentCurrency) next();
  else currencyLayerProviderSaveCurrency(day, res, next);
};

getCurrency = async day => {
  let toDate = moment(day)
    .subtract(1, "days")
    .format("YYYY-MM-DD");
  let laterDate = moment(day)
    .add(1, "days")
    .format("YYYY-MM-DD");

  let result, provider;
  for (let i = 0; i < listOfCurrencyPriority.length; i++) {
    provider = listOfCurrencyPriority[i].provider;
    result = await Currency.findOne({
      provider: provider,
      date: {
        $gte: toDate,
        $lte: laterDate
      }
    });
    if (result) break;
  }
  return result;
};

conversionCurrency = (sum, oldCurrency, newCurrency, currentCurrency) => {
  switch (oldCurrency) {
    case "USD":
      switch (newCurrency) {
        case "EUR":
          return sum * currentCurrency.USDEUR;
        case "GBP":
          return sum * currentCurrency.USDGBP;
      }
      break;
    case "EUR":
      switch (newCurrency) {
        case "USD":
          return sum * currentCurrency.EURUSD;
        case "GBP":
          return sum * currentCurrency.EURGBP;
      }
      break;
    case "GBP":
      switch (newCurrency) {
        case "USD":
          return sum * currentCurrency.GBPUSD;
        case "EUR":
          return sum * currentCurrency.GBPEUR;
      }
      break;
  }
};

currencyService = async (req, res) => {
  let currentCurrency = await getCurrency(currentDate);
  let finalSum = conversionCurrency(
    initialSum,
    initialCurrency,
    finallyCurrency,
    currentCurrency.currencies
  );
  res.status(200).render("index", {
    now: currentCurrency.date,
    provider: currentCurrency.provider,
    initialSum,
    finalSum,
    initialCurrency,
    finallyCurrency
  });
};

router.get("/", currencyMiddleware, currencyService);

module.exports = router;
