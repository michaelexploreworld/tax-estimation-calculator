(function () {
  angular
    .module('tecApp')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location','authentication', 'tecData'];
  function registerCtrl($location, authentication, tecData) {
    var vm = this;

    vm.title = 'Create a new TEC account';

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        return false;
      } else {
        vm.doRegister();
      }
    };

    vm.doRegister = function() {
      vm.formError = "";
      authentication
        .register(vm.credentials)
        .then(function successCallback(response) {
          var currentUser = authentication.currentUser();

          tecData.createPersonalTaxRecord(currentUser.email)
            .then(function successCallback(response) {
              console.log('Create personal tax record succeed: ', response.data);
            }, function errorCallback(response) {
              console.log('Something went wrong when creating personal tax record.');
            });

          $location.search('page', null);
          $location.path(vm.returnPage);
        }, function errorCallback(response) {
          vm.formError = response.data.errmsg;
        });
    };
  }
})();
