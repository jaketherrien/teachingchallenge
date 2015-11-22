'use strict';

// initialization function after Google JS Library has finished loading
function init() {
  console.log("init");
  window.initialize();
}

// create angular app
var myApp = angular.module('myApp', []);


// create angular controller
myApp.controller('GoogleApiCtrl', ['$scope', '$window', function($scope,$window) { 

  console.log("controller started");
  $scope.isBackendReady = false;
  console.log($scope.isBackendReady);

  var clientId = '282322657286-thqf8d9ol44fcasamt9e358p2ghigb1c.apps.googleusercontent.com'; // for OAuth2
  var apiKey = 'AIzaSyDbyRiJkjf4CU5YO6B6sc_K_iQkw-rXC74'; // for general api access

  // list of scopes the user will be asked to grant access to separated by a space character (' ')
  var scopes = ['https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/drive.metadata.readonly']; 

  $window.initialize = function() {
    $scope.$apply($scope.handleClientLoad);
  };

  // START
  // handleClientLoad function called when Google JS library is loaded in index.html head tag
  $scope.handleClientLoad = function() { 
    console.log("handleClientLoad() called");
    gapi.client.setApiKey(apiKey); // set the apuKey
    window.setTimeout($scope.checkAuth,1); // calls the checkAuth() method after 1 millisecond
  }

  // $scope.handleClientLoad();

  $scope.checkAuth = function() {
    console.log("checkAuth() called");
    gapi.auth.authorize(
      {
        client_id: clientId, 
        scope: scopes.join(' '), // join the list of scopes separated by a space character (' ')
        immediate: true
      }, $scope.handleAuthResult);
  }

  $scope.handleAuthResult = function(authResult) {
    console.log("handleAuthResult() called");
    var authorizeButton = document.getElementById('authorize-button');

    // if the user has already authorized API access proceed to the API call, otherwise display button to authorize the app
    if (authResult && !authResult.error) {
      authorizeButton.style.visibility = 'hidden';
      $scope.loadDriveApi(); // call method to load the Drive API
    } else {
      authorizeButton.style.visibility = '';
      authorizeButton.onclick = $scope.handleAuthClick();
    }
  }

  $scope.handleAuthClick = function(event) {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, $scope.handleAuthResult);
    return false;
  }

  // Google Drive
  $scope.loadDriveApi = function(){
    gapi.client.load('drive', 'v2', function() {
     console.log($scope.isBackendReady);
    
    console.log($scope.isBackendReady);
    $scope.listFiles(); // load the drive api, version 2, then call the list files function
    })
  }

  $scope.listFiles = function() {
    console.log("listFiles() called");
    // request up to ten Drive files, builds a request object
    var request = gapi.client.drive.files.list(
        {
          'maxResults': 10
        }
      );

      // console.log(request);

      request.execute(function(resp) {
        // appendPre('Files:');

        console.log("items: " + resp.items[0].title);

        // var files = resp.items;
        $scope.files = resp.items;

        // {
        //   text: "hello"
        // };

        console.log("$scope.files: " + $scope.files);

        $scope.isBackendReady = true;
        // if (files && files.length > 0) {
        //   for (var i = 0; i < files.length; i++) {
        //     var file = files[i];
        //     appendPre(file.title + ' (' + file.id + ')');
        //   }
        // } else {
        //   appendPre('No files found.');
        // }
      });
  }

  /**
  * Append a pre element to the body containing the given message
  * as its text node.
  *
  * @param {string} message Text to be placed in pre element.
  */
  // function appendPre(message) {
  //   var pre = document.getElementById('output');
  //   var textContent = document.createTextNode(message + '\n');
  //   pre.appendChild(textContent);
  // }



}]);






// Google+
// Load the API and make an API call.  Display the results on the screen.
// function makeApiCall() {
//   gapi.client.load('plus', 'v1', function() {
//     var request = gapi.client.plus.people.get({
//       'userId': 'me'
//     });
//     request.execute(function(resp) {
//       var heading = document.createElement('h4');
//       var image = document.createElement('img');
//       image.src = resp.image.url;
//       heading.appendChild(image);
//       heading.appendChild(document.createTextNode(resp.displayName));
//       document.getElementById('content').appendChild(heading);
//     });
//   });
// }

