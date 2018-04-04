(function () {
  angular
    .module('tecApp')
    .service('authentication', authentication);

  authentication.$inject = ['$window', '$http'];
  function authentication ($window, $http) {

    var saveToken = function (token) {
      $window.localStorage['etc-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['etc-token'];
    };

    var register = function(user) {
      return $http.post('/api/register', user).then(function(response) {
        saveToken(response.data.token);
      });
    };

    var login = function(user) {
      return $http.post('/api/login', user).then(function(response){
        saveToken(response.data.token);
      });
    };

    var logout = function() {
      $window.localStorage.removeItem('etc-token');
    };

    var isLoggedIn = function() {
      var token = getToken();

      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return {
          email : payload.email,
          name : payload.name
        };
      }
    };

    return {
      saveToken : saveToken,
      getToken : getToken,
      register : register,
      login : login,
      logout : logout,
      isLoggedIn : isLoggedIn,
      currentUser : currentUser
    };
  }
})();
