(function () {
  angular.module('tecApp', ['ngRoute']);

  config.$inject = ['$routeProvider', '$locationProvider'];
  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/history', {
        templateUrl: 'history/history.view.html',
        controller: 'historyCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }

  angular
    .module('tecApp')
    .config(['$routeProvider', '$locationProvider', config]);
})();
