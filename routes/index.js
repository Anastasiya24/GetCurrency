var express = require("express");
var router = express.Router();
var oxr = require("open-exchange-rates");
var fx = require("money");

const APP_ID = "cea0d1b9d40e4364b7ddf70163ff1cbd";

saveCurrency = (req, res, next) => {
  console.log("Express1");
  oxr.set({ app_id: APP_ID });
  // oxr.historical("2019-02-20", function() {
  //   console.log("USD: ", oxr.rates.USD);
  //   console.log("EUR: ", oxr.rates.EUR);
  //   console.log("GBP: ", oxr.rates.GBP);
  // });
  oxr.latest(function(error) {
    if (error) {
      console.log(error.toString());
      return false;
    }
    console.log("Now: " + new Date(oxr.timestamp).toUTCString());
    console.log("USD -> EUR: " + oxr.rates.EUR);
    console.log("USD -> GBP: " + oxr.rates.GBP);
    fx.rates = oxr.rates;
    fx.base = oxr.base;
    // var amount = fx(10)
    //   .from("EUR")
    //   .to("GBP")
    //   .toFixed(6);
    // console.log("10 EUR in GBP: " + amount);
  });
  next();
};

router.get("/", saveCurrency, (req, res) => {
  console.log("Express2");
  res.render("index", { title: "Express" });
});

module.exports = router;
