(function () {
  angular
    .module('tecApp')
    .controller('homeCtrl', homeCtrl);


  homeCtrl.$inject = ['tecData', 'taxCalculator', 'authentication'];
  function homeCtrl (tecData, taxCalculator, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Tax Estimation Calculator',
      strapline: 'Use this simple calculator to find out your estimated tax and net from a given income.'
    };

    // Get taxRates from server and set the data into year selector.
    tecData.getTaxRateList()
      .then(function successCallback(response) {
        var taxRates = response.data;
        if (taxRates.length > 0) {
          vm.yearSeletorOptions = taxRates;

          vm.formData = {
            year: taxRates[0]
          };
        }
      }, function errorCallback(response) {
        console.log('Something went wrong when getting taxRates into year selector.');
      });

    // If user login, fetch personalTaxRecord by user email, otherwise, do nothing.
    if(authentication.isLoggedIn()) {
      var currentUser = authentication.currentUser();
      tecData.getPersonalTaxRecordByEmail()
        .then(function successCallback(response) {
          var personalTaxRecord = response.data;
          if (personalTaxRecord) {
            vm.personalTaxRecord = personalTaxRecord;
          }
        }, function errorCallback(response) {
          console.log('Something went wrong when getting personalTaxRecord.');
        });
    }

    vm.annualResult = {
      gross: 0,
      net: 0,
      sup: 0,
      netPlusSup: 0,
      grossPlusSup: 0,
      tax: 0
    };

    vm.onSubmit = function () {
      var gross, grossPlusSup, supRate, taxRate;
      var net, sup, tax, netPlusSup;

      net = sup = tax = netPlusSup = 0;
      vm.formError = "";

      try {
        // Validate annual income input data.
        if (!vm.formData.gross) {
          gross = 0;
        } else {
          gross = parseInt(vm.formData.gross);
          if (!gross) {
            throw "Gross field must be a number";
          } else if (gross < 0) {
            throw "Gross field must large than zero";
          }
        }
        if (!vm.formData.grossPlusSup) {
          grossPlusSup = 0;
        } else {
          grossPlusSup = parseInt(vm.formData.grossPlusSup);
          if (!grossPlusSup) {
            throw "Gross + sup field must be a number";
          } else if (grossPlusSup < 0) {
            throw "Gross + sup field must large than zero"
          }
        }
        if (!vm.formData.supRate) {
          supRate = 0;
        } else {
          supRate = parseFloat(vm.formData.supRate);
          if (!supRate) {
            throw "Sup rate field must be a number";
          } else if (supRate < 0 || supRate > 100) {
            throw "Sup rate must between 0 to 100";
          }
        }
        if (!(taxRate = vm.formData.year)) {
          throw "Tax rate field is empty";
        }
        if (vm.formData.gross && vm.formData.grossPlusSup && gross > grossPlusSup) {
          throw "Gross field should less than gross + sup field";
        }

        // Calculate annual result and present to the browser.
        gross = taxCalculator.getGross(gross, grossPlusSup, supRate);
        sup = taxCalculator.getSup(gross, grossPlusSup, supRate);
        grossPlusSup = taxCalculator.getGrossPlusSup(grossPlusSup, gross, sup);
        tax = taxCalculator.getTax(gross, taxRate);
        net = taxCalculator.getNet(gross, tax);
        netPlusSup = taxCalculator.getNetPlusSup(net, sup);

        vm.annualResult = {
          gross: gross,
          net: net,
          sup: sup,
          netPlusSup: netPlusSup,
          grossPlusSup: grossPlusSup,
          tax: tax
        };

        // If user login, save annual rersult, otherwise, don't save.
        if(authentication.isLoggedIn()) {
          tecData.postTaxResult(vm.personalTaxRecord._id, vm.annualResult)
            .then(function successCallback(response) {
              console.log('Save succeed: ' + response.data);
            }, function errorCallback(response) {
              console.log('Something went wrong when getting personalTaxRecord.');
            });
        }
      } catch(err) {
        vm.formError = err;
      }
    };
  }
})();
