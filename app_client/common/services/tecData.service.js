(function () {
  angular
    .module('tecApp')
    .service('tecData', tecData);

  tecData.$inject = ['$http'];
  function tecData ($http) {
    var getTaxRateList = function () {
      return $http.get('/api/taxRates');
    };

    var getPersonalTaxRecordByEmail = function (email) {
      return $http.get('/api/personalTaxRecords?email=' + email);
    };

    var postTaxResult = function (personalTaxRecordId, taxResult) {
      return $http.post('/api/personalTaxRecords/' + personalTaxRecordId + '/taxResults', taxResult);
    }

    return {
      getTaxRateList: getTaxRateList,
      getPersonalTaxRecordByEmail: getPersonalTaxRecordByEmail,
      postTaxResult: postTaxResult
    };
  }
})();
