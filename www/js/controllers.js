
angular.module('app.controllers', ['ionic'])
.controller('loginCtrl', ['$scope', '$stateParams','$http','$ionicPopup','loginService','$state', function ($scope, $stateParams,$http,$ionicPopup,loginService,$state) {
  $scope.data = {}; 
  $scope.login = function()   { 
    console.log('in login functie');
    var data = { 
      username: $scope.data.username,
       password: CryptoJS.SHA256($scope.data.password+"d1196d14673fea52227035c43d124169").toString() 
    };
    var username = data.username;
    data = JSON.stringify(data);
    this.username = $scope.data.username;
    loginService.LoginUser($http,data,$ionicPopup,$state,username);
     }

  /*
    Deze controller gaat naar de server de log in gegevens sturen van de gebruiker waarop een antwoord van de server komt als de log in klopt ja of nee
   */
}])

.controller('activateYourAccountCtrl', ['$scope', '$stateParams','activateService','$ionicPopup','$state','$http',function ($scope, $stateParams,activateService,$ionicPopup,$state,$http) {
  $scope.hideBackButton = true;
  $scope.activate =function(){
    console.log('in activate function');
    var data = {
      username: $stateParams.username,
    };
    var username=data.username;
    activateService.ActivateUser($http,data,$ionicPopup,$state,username);
  }

  /*
    Deze controller zal een post sturen naar de server om te laten weten dat de gebruiker akkoord gaat met de TOS
   */
}])

.controller('activatedCtrl', ['$scope', '$stateParams','activatedService','$ionicPopup','$state','$http','$cordovaCamera',function ($scope, $stateParams,activatedService,$ionicPopup,$state,$http,$cordovaCamera) {
  $scope.hideBackButton = true;
  var json = 'http://ipv4.myexternalip.com/json';
  $http.get(json).
  success(function(data, status, headers, config) {
    $scope.IP = data.ip;
  }).
  error(function(data, status, headers, config) {
    $scope.IP = "Error while getting IP (No internet?)";
  });
  var data = {
    username: $stateParams.username,
  };
  setInterval(function() {
    activatedService.getTasks($http,data,$stateParams.username,$cordovaCamera);

 }, 10000);

  /*
  Deze controller zal om de 10 seconden gaan kijken welke taken hij heeft. In het begin zal hij het externe IP adres opvragen voor de voorpagina op te vullen
   */
}])
