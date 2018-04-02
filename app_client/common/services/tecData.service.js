(function () {
  angular
    .module('tecApp')
    .service('tecData', tecData);

  tecData.$inject = ['$http'];
  function tecData ($http) {
    var getTaxRateList = function () {
      return $http.get('/api/taxRates');
    };

    return {
      getTaxRateList: getTaxRateList
    };
  }
})();
