(function () {
  angular
    .module('tecApp')
    .controller('homeCtrl', homeCtrl);

  function homeCtrl () {
    var vm = this;

    vm.pageHeader = {
      title: 'Tax Estimation Calculator',
      strapline: 'Use this simple calculator to find out your estimated tax and net from a given income.'
    };

    vm.yearSeletorOptions = {
      '2017 - 2018': { from: '2017', to: '2018' },
      '2016 - 2017': { from: '2016', to: '2017' },
      '2015 - 2016': { from: '2015', to: '2016' }
    };

    vm.annualResult = {
      net: 1000,
      sup: 1000,
      netPlusSup: 1000,
      gross: 1000,
      grossPlusSup: 1000,
      tax: 1000
    };
  }
})();
