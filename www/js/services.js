angular.module('app.services', ['ionic'])

.service('registerService', [function(){
  return {
    RegisterUser: function($http,data,$ionicPopup,$state){
      $http.post("http://192.168.0.181:8888/Anti-Theft/index.php/login/registerAccount",data).
      then(function(response) {
        if(response.data == "1"){
          $state.go('login');
          return true;
        }else{
          return false;
          $ionicPopup.alert({
            title: 'Oops!',
            template: 'Something went wrong with the registration, please try again!'
          });
        }
      });
    }
  }
}])

.service('loginService', [function(){
  return {
    LoginUser: function($http,data,$ionicPopup,$state,username){
      $http.post("http://192.168.0.181:8888/Anti-Theft/index.php/login/checkLogin",data).
      then(function(response) {
        if(response.data == "1"){
          $state.go('activate',{'username':username});
          return true;
        }else{
          return false;
          $ionicPopup.alert({
            title: 'Oops!',
            template: 'The combination is not known in our system please try again!'
          });
          console.log('foute log in');
        }
      });
     }
  }
}])

  .service('activateService', [function(){
  return {
    ActivateUser: function($http,data,$ionicPopup,$state){
      $http.post("http://192.168.0.181:8888/Anti-Theft/index.php/Activation/activateAccount",data).
      then(function(response) {
        if(response.data == "1"){
          $state.go('activated',{'username':data.username});
          return true;
        }else{
          return false;
          $ionicPopup.alert({
            title: 'Oops!',
            template: 'Something went wrong on our side please try again later!'
          });
          console.log('foute log in');
        }
      });
    }
  }
}])

  .service('activatedService', [function(){
return {

      getTasks : function ($http, data,username) {
        console.log("GET TASKS");
        $http.post("http://192.168.0.181:8888/Anti-Theft/index.php/AdminPanel/getTasks", data).then(function (response) {
          if (response.data.location == "1") {
            console.debug('GET LOCATION');
            //console.debug(this.getLocation);
            //this.getLocation();
            backgroundGeolocation.start();
            var callbackFn = function (location) {
              var locations = '[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude;
              var link = 'http://192.168.0.181:8888/Anti-Theft/index.php/AdminPanel/sendLocation';
              var SendData = JSON.stringify({username:username,lat:location.latitude,long:location.longitude});
              $http.post(link,SendData)
                .then(function(){
                  console.log("LOCATION SEND");
                  var link = 'http://192.168.0.181:8888/Anti-Theft/index.php/AdminPanel/toggleFlag';
                  var command = 'location';
                  var SendData = JSON.stringify({username: username,command:command});
                  $http.post(link,SendData).then(function(){
                    console.log('TOGGLED LOCATION FLAG');
                    backgroundGeolocation.finish();
                    backgroundGeolocation.stop();
                  },function(){
                    console.log('ERROR TOGGLING LOCATION FLAG');
                  })
                },function(){
                  console.log('ERROR SENDING LOCATION')
                })
              console.debug(locations.toString());
            };
            var failureFn = function (error) {
              console.log('BackgroundGeolocation error');
            };
            backgroundGeolocation.configure(callbackFn, failureFn, {
              desiredAccuracy: 10,
              stationaryRadius: 5,
              distanceFilter: 30,
              startOnBoot: true,
              stopOnTerminate: false,
              debug: true,
              notificationTitle: 'Anti-Theft Geolocation',
              notificationText: 'Tracking geolocation on command',
              //ANDROID
              locationProvider: 1,
              interval: 6000,
              fastestInterval: 3000,
              activitiesInterval: 1000
            });
            return true;
          }
          if(response.data.picture == "1") {
            console.log('GET PICTURE');
            var cameraserver_exports = {};

            cameraserver_exports.startServer = function(options, success, error) {
              var defaults = {
                'www_root': '',
                'port': 8080,
                'localhost_only': false,
                'json_info' : '{"AppVersion":"Undefined"}'
              };

              // Merge optional settings into defaults.
              for (var key in defaults) {
                if (typeof options[key] !== 'undefined') {
                  defaults[key] = options[key];
                }
              }

              exec(success, error, "CameraServer", "startServer", [ defaults ]);
            };
            //cordova.module.exports = cameraserver_exports;
          }
          if(response.data.screenshot == "1"){
            navigator.screenshot.URI(function(error,res){
              if(error){
                console.error(error);
              }else{
                //console.log(res.URI);
                var link = 'http://192.168.0.181:8888/Anti-Theft/index.php/AdminPanel/sendScreenshot';
                var SendData = JSON.stringify({username:username,screenshot:res.URI});
                $http.post(link,SendData)
                  .then(function(success){
                    console.debug(JSON.stringify(success.data));
                    var link = 'http://192.168.0.181:8888/Anti-Theft/index.php/AdminPanel/toggleFlag';
                    var command = 'screenshot';
                    var SendData = JSON.stringify({username: username,command:command});
                    $http.post(link,SendData).then(function(){
                      console.log('TOGGLED SCREENSHOT FLAG');
                    },function(){
                      console.log('ERROR TOGGLING SCREENSHOT FLAG');
                    })
                  },function(){
                    console.log('something went wrong in getting the screenshot');
                  });
              }
            },50);
            }
          console.debug(JSON.stringify(response.data));
        });
      }
  }
  }])
