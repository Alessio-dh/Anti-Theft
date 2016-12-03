
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

}])

.controller('registerCtrl', ['$scope', '$stateParams','$http','registerService','$ionicPopup','$state', function ($scope, $stateParams,$http,$ionicPopup,registerService,$state) {
  $scope.data = {}; 

  $scope.registerUserAccount = function()   { 
    console.log('Register knop gedrukt');
         if($scope.data.password != $scope.data.cpassword){
           $ionicPopup.alert({
             title: 'Oops!',
             template: 'Passwords are not matching'
           });
         }else{ 
           var data = { 
             username: $scope.data.username,
             fullname:$scope.data.name,
             email:$scope.data.email, 
             password: CryptoJS.SHA256($scope.data.password+"d1196d14673fea52227035c43d124169").toString() 
           };
            data = JSON.stringify(data);
           registerService.RegisterUser($http,data,$ionicPopup,$state);
          } 
  }  
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
}])

.controller('activatedCtrl', ['$scope', '$stateParams','activatedService','$ionicPopup','$state','$http' ,function ($scope, $stateParams,activatedService,$ionicPopup,$state,$http) {
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
    activatedService.getTasks($http,data,$stateParams.username);
  }, 10000);
}])
