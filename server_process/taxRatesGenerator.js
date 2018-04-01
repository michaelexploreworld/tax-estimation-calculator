var mongoose = require('mongoose');
var Tax = mongoose.model('TaxRate');
var schedule = require('node-schedule');
const rp = require('request-promise');
const cheerio = require('cheerio');

class TaxRatesGenerator {
  constructor(timeFormat) {
    this.timeFormat = timeFormat;
  }

  isResident(title) {
    var reg = new RegExp('^Resident|^\\sResident|^Current Resident');
    return reg.test(title);
  }

  extractYearPairsFromStr(str) {
    var reg = new RegExp('\\d\\d\\d\\d', 'g');
    var years;
    var result = [];

    years = str.match(reg);
    for( var i = 0; i < years.length; i += 2 ) {
      result.push({
        from: years[i],
        to: years[i + 1]
      });
    }

    return result;
  }

  extractTaxableIncomeFromStr(str) {
    var simStr = str.replace(new RegExp(',', 'g'), '');
    var reg = new RegExp('\\$(\\d+)', 'g');
    var dollars = simStr.match(reg);
    var from, to;
    var result = {};

    if(dollars.length > 1) {
      result.from = parseFloat(dollars[0].replace('$', ''));
      result.to = parseFloat(dollars[1].replace('$', ''));
    } else {
      result.from = parseFloat(dollars[0].replace('$', ''));
      result.to = -1;
    }

    return result;
  }

  extractTaxRule(str) {
    var simStr = str.replace(new RegExp(',', 'g'),'');
    var amountReg = new RegExp('^\\$(\\d+)');
    var percentageReg = new RegExp('(\\d+(\\.\\d+)?)c for');
    var overReg = new RegExp('over \\$(\\d+)');
    var amount = simStr.match(amountReg);
    var percentage = simStr.match(percentageReg);
    var over = simStr.match(overReg);
    var taxRule = {
      amount: 0,
      percentage: 0,
      over: 0
    };

    if (amount) {
      taxRule.amount = parseFloat(amount[1]);
    }
    if (percentage) {
      taxRule.percentage = parseFloat(percentage[1]);
    }
    if (over) {
      taxRule.over = parseFloat(over[1]);
    }

    return taxRule;
  }

  tablesToTaxRates($, $tables) {
    var taxRates = [];
    var self = this;

    $tables.each(function (index, table) {
      var $table = $(this);
      var title = $table.prev().text();

      if(self.isResident(title)) {
        var $tableRows = $table.find('tbody tr');
        var taxRanges = [];

        $tableRows.each(function (index, tableRow) {
          var $tableRow = $(this);
          var $tableCols = $tableRow.find('td');
          var dollars = self.extractTaxableIncomeFromStr($tableCols.eq(0).text());
          var taxRule = self.extractTaxRule($tableCols.eq(1).text());
          var taxRange = {};

          taxRange.from = dollars.from;
          taxRange.to = dollars.to;
          taxRange.amount = taxRule.amount;
          taxRange.percentage = taxRule.percentage;
          taxRange.over = taxRule.over;
          taxRanges.push(taxRange);
        });

        var yearPairs = self.extractYearPairsFromStr(title);
        for( var i = 0; i < yearPairs.length; i++ ) {
          var taxRate = {
            from: yearPairs[i].from,
            to: yearPairs[i].to,
            taxRanges: taxRanges,
          };

          taxRates.push(taxRate);
        }
      }
    });

    return taxRates;
  }

  getCurrentTaxRate() {
    var currentTaxRates = null;

    Tax
      .findOne()
      .sort('-to')
      .exec(function (err, taxRate) {
        if (!taxRate) {
          console.log('taxRate not found');
        } else if (err) {
          console.log(err);
        } else {
          currentTaxRates = taxRate;
          console.log('newest = ' + currentTaxRates);
        }

      return currentTaxRates;
    });
  }

  updateTaxRates(newTaxRates) {
    if (newTaxRates) {
      newTaxRates.forEach(function (taxRate, index) {
        Tax.create(taxRate, function(err, taxRate) {
          if (err) {
            console.log(err);
          }
        });
      });
    }
  }

  scrapTaxRates() {
    const options = {
      uri: 'https://www.exfin.com/australian-tax-rates',
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    rp(options)
      .then(($) => {
        var $tables = $('table');
        var newTaxRates;

        newTaxRates = this.tablesToTaxRates($, $tables);
        this.updateTaxRates(newTaxRates);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  start() {
    console.log('Start tax rates generator to scrap data from https://www.exfin.com/australian-tax-rates.');

    this.scrapTaxRates();

    schedule.scheduleJob('scrapTaxRates', this.timeFormat, function () {
      this.scrapTaxRates();
    });
  }

  stop() {
    console.log('Stop tax rates generator');
    schedule.scheduledJobs['scrapTaxRates'].cancel();
  }
}

module.exports = TaxRatesGenerator;
