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
  }
})();
