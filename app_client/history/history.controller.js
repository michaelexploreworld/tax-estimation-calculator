(function () {
  angular
    .module('tecApp')
    .controller('historyCtrl', historyCtrl);

  function historyCtrl () {
    function listToMatrix(array, colNum) {
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

    var vm = this;
    var historyList = [
      {
        time: '2018/03/06',
        net: 1000,
        sup: 1000,
        netPlusSup: 1000,
        gross: 1000,
        grossPlusSup: 1000,
        tax: 1000 },
      {
        time: '2018/03/06',
        net: 1000,
        sup: 1000,
        netPlusSup: 1000,
        gross: 1000,
        grossPlusSup: 1000,
        tax: 1000 },
      {
        time: '2018/03/06',
        net: 1000,
        sup: 1000,
        netPlusSup: 1000,
        gross: 1000,
        grossPlusSup: 1000,
        tax: 1000
      }, {
        time: '2018/03/06',
        net: 1000,
        sup: 1000,
        netPlusSup: 1000,
        gross: 1000,
        grossPlusSup: 1000,
        tax: 1000
      }, {
        time: '2018/03/06',
        net: 1000,
        sup: 1000,
        netPlusSup: 1000,
        gross: 1000,
        grossPlusSup: 1000,
        tax: 1000
      }
    ];

    vm.historyMatrix = listToMatrix(historyList, 2);
  }
})();
