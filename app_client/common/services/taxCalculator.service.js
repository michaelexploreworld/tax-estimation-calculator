(function () {
  angular
    .module('tecApp')
    .service('taxCalculator', taxCalculator);

  function taxCalculator () {
    var getNet = function (gross, tax) {
      return gross - tax;
    };

    var getSup = function (gross, grossPlusSup, supRate) {
      var sup = 0;

      if (gross && supRate) {
        sup = (gross * supRate) / 100;
      } else if (gross && grossPlusSup) {
        sup = grossPlusSup - gross;
      } else if(grossPlusSup && supRate) {
        sup = (grossPlusSup * supRate) / (100 + supRate);
      }

      return sup;
    };

    var getNetPlusSup = function (net, sup) {
      return net + sup;
    };

    var getGross = function (gross, grossPlusSup, supRate) {
      var result;

      if (gross) {
        result = gross;
      } else if (grossPlusSup && supRate) {
        result = grossPlusSup - getSup(gross, grossPlusSup, supRate);
      } else {
        result = 0;
      }

      return result;
    };

    var getGrossPlusSup = function (grossPlusSup, gross, sup) {
      var result;

      if (grossPlusSup) {
        result = grossPlusSup;
      } else {
        result = gross + sup;
      }

      return result;
    };

    var getTax = function (gross, taxRate) {
      var findRange = null;
      var taxRanges = taxRate.taxRanges;

      for( var i = 0; i < taxRanges.length; i++ ) {
        if(gross < taxRanges[i].to || taxRanges[i].to == -1) {
          findRange = taxRanges[i];
          break;
        }
      }

      return (((gross - findRange.over) * findRange.percentage) / 100) + findRange.amount;
    };

    return {
      getNet : getNet,
      getSup : getSup,
      getNetPlusSup : getNetPlusSup,
      getGross : getGross,
      getGrossPlusSup : getGrossPlusSup,
      getTax : getTax
    };
  }
})();
