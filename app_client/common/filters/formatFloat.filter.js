(function () {
  angular
    .module('tecApp')
    .filter('formatFloat', formatFloat);

  function formatFloat () {
    return function (num, pos) {
      return num.toFixed(pos);
    };
  }
})();
