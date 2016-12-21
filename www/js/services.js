var linkHost = 'http://192.168.43.156:8888/Anti-Theft/'; //Moet aangepast worden voor de communicatie naar de server

angular.module('app.services', ['ionic'])

.service('loginService', [function(){
  return {
    /*
    Bij deze functie zal de post daadwerkelijk gestuurd worden en zal deze ook een true of false van de server terugkrijgen
    Als de login juist is zal de app hem doorsturen naar de activate pagina samen met de username
     */

    LoginUser: function($http,data,$ionicPopup,$state,username){
      console.info(linkHost+"index.php/login/checkLogin");
      $http.post(linkHost+"index.php/login/checkLogin",data).
      then(function(response) {
        if(response.data == "1"){
          $state.go('activate',{'username':username});
          return true;
        }else{
          $ionicPopup.alert({
            title: 'Oops! Wrong combination',
          });
          console.log('foute log in');
          return false;
        }
      });
     }
  }
}])

.service('activateService', [function(){
  return {
    /*
     Bij deze functie zal de post daadwerkelijk gestuurd worden en zal deze ook een true of false van de server terugkrijgen
     Als de activate juist is gebeurd dan zal de app hem doorsturen naar de activated pagina samen met de username
     */
    ActivateUser: function($http,data,$ionicPopup,$state){
      console.info(linkHost+"index.php/AdminPanel/activateAccount");
      $http.post(linkHost+"index.php/AdminPanel/activateAccount",data).
      then(function(response) {
        console.info("in activate service voor post2");
        console.debug(response.data);
        if(response.data == "1"){
          $state.go('activated',{'username':data.username});
          return true;
        }else{
          console.info("in activate service voor post3");
          $ionicPopup.alert({
            title: 'Oops! Iets ging er fout',
          });
          console.log('ERROR ACTIVATION');
          return false;
        }
      });
    }
  }
}])

  .service('activatedService', [function(){
return {
  /*
   Bij deze functie zal de post daadwerkelijk gestuurd worden en zal deze ook een JSON terugkrijgen met de flags van de taken als er een taak is die 1 (true) is dan al deze uitgevoerd worden
   Nadat een taak 1 is zal de app sturen dat hij deze gedaan heeft en zal het resultaat doorsturen en daarna gaat hij de server de flag laten togglen
   */
      getTasks : function ($http, data,username,cc) {
        console.log("GET TASKS");
        $http.post(linkHost+"index.php/AdminPanel/getTasks", data).then(function (response) {
          if (response.data.location == "1") {
            console.debug('GET LOCATION');
            var callbackFn = function (location) {
              var locations = '[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude;
              var link = linkHost+'index.php/AdminPanel/sendLocation';
              var SendData = JSON.stringify({username:username,lat:location.latitude,long:location.longitude});
              $http.post(link,SendData)
                .then(function(){
                  console.log("LOCATION SEND");
                  var link = linkHost+'index.php/AdminPanel/toggleFlag';
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
              notificationTitle: 'Anti-Theft Geolocation',
              notificationText: 'Tracking geolocation on command',
              //ANDROID
              locationProvider: 1,
            });
            backgroundGeolocation.start();
          }
          if(response.data.picture == "1") {
            var options = {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: false,
              targetWidth:261,
              targetHeight:464,
              encodingType: Camera.EncodingType.JPEG,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false,
              cameraDirection:1,
              correctOrientation:true,
            };

            cc.getPicture(options).then(function (imageData) {
              var imgURI = "data:image/jpeg;base64," + imageData;
              var link = linkHost+'index.php/AdminPanel/sendPicture';
              var SendData = JSON.stringify({username:username,picture:imgURI});
              $http.post(link,SendData)
                .then(function(success){
                  console.debug(JSON.stringify(success.data));
                  var link = linkHost+'index.php/AdminPanel/toggleFlag';
                  var command = 'picture';
                  var SendData = JSON.stringify({username: username,command:command});
                  $http.post(link,SendData).then(function(){
                    console.log('TOGGLED PICTURE FLAG');
                  },function(){
                    console.log('ERROR TOGGLING PICTURE FLAG');
                  })
                },function(){
                  console.log('something went wrong in getting the screenshot');
                });
            }, function (err) {
              // An error occured. Show a message to the user
            });
            console.log("GET PICTURE");
          }

          if(response.data.screenshot == "1"){
            navigator.screenshot.URI(function(error,res){
              if(error){
                console.error(error);
              }else{
                var link = linkHost+'index.php/AdminPanel/sendScreenshot';
                var SendData = JSON.stringify({username:username,screenshot:res.URI});
                $http.post(link,SendData)
                  .then(function(success){
                    console.debug(JSON.stringify(success.data));
                    var link = linkHost+'index.php/AdminPanel/toggleFlag';
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
