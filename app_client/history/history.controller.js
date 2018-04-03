(function () {
  angular
    .module('tecApp')
    .controller('historyCtrl', historyCtrl);

  function arrayToMatrix(array, colNum) {
    var matrix = [];

    for (var arrayIndex = 0, row = -1; arrayIndex < array.length; arrayIndex++) {
      var col = arrayIndex % colNum;
      if (col == 0) {
        matrix[++row] = [];
      }
      matrix[row][col] = array[arrayIndex];
    }

    return matrix;
  }

  historyCtrl.$inject = ['tecData'];
  function historyCtrl (tecData) {
    var vm = this;

    tecData.getPersonalTaxRecordByEmail('test@gmail.com')
      .then(function successCallback(response) {
        var personalTaxRecord = response.data;
        if (personalTaxRecord) {
          vm.personalTaxRecord = personalTaxRecord;
          vm.historyMatrix = arrayToMatrix(vm.personalTaxRecord.taxResults, 2);
        }
      }, function errorCallback(response) {
        console.log('Something went wrong when getting personalTaxRecord.');
      });

    vm.deleteRecord = function (taxResultId) {
      tecData.deleteTaxResult(vm.personalTaxRecord._id, taxResultId)
        .then(function successCallback(response) {
          console.log("Delete succeed");
          var index = vm.personalTaxRecord.taxResults.map(function(x) {return x._id; }).indexOf(taxResultId);
          if (index > -1) {
            vm.personalTaxRecord.taxResults.splice(index, 1);
            vm.historyMatrix = arrayToMatrix(vm.personalTaxRecord.taxResults, 2);
          }
        }, function errorCallback(response) {
          console.log('Something went wrong when deleting taxResult.');
        });
    }
  }
})();
