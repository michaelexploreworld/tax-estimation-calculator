(function () {
  angular
    .module('tecApp')
    .service('tecData', tecData);

  tecData.$inject = ['$http', 'authentication'];
  function tecData ($http, authentication) {
    var getTaxRateList = function () {
      return $http.get('/api/taxRates');
    };

    var createPersonalTaxRecord = function (email) {
      return $http.post('/api/personalTaxRecords?email=' + email);
    };

    var getPersonalTaxRecordByEmail = function () {
      return $http.get('/api/personalTaxRecords', { headers: { Authorization: 'Bearer ' + authentication.getToken() }});
    };

    var postTaxResult = function (personalTaxRecordId, taxResult) {
      return $http.post('/api/personalTaxRecords/' + personalTaxRecordId + '/taxResults', taxResult, { headers: { Authorization: 'Bearer ' + authentication.getToken() }});
    }

    var deleteTaxResult = function (personalTaxRecordId, taxResultId) {
      return $http.delete('/api/personalTaxRecords/' + personalTaxRecordId + '/taxResults/' + taxResultId, { headers: { Authorization: 'Bearer ' + authentication.getToken() }});
    }

    return {
      getTaxRateList: getTaxRateList,
      createPersonalTaxRecord: createPersonalTaxRecord,
      getPersonalTaxRecordByEmail: getPersonalTaxRecordByEmail,
      postTaxResult: postTaxResult,
      deleteTaxResult: deleteTaxResult
    };
  }
})();
