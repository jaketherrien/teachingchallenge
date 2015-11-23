'use strict';

// initialization function called after Google JS Library has finished loading
// used to ensure the Google auth sequence doesn't begin until the Google JavaScript library is fully loaded
function init() {
  // call the initialize function in $window
  window.initialize();
}

// create angular app
var myApp = angular.module('myApp', []);

// create angular controller
myApp.controller('GoogleApiCtrl', ['$scope', '$window', function($scope,$window) { 

  $scope.isBackendReady = false; // boolean to hide 

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
    gapi.client.setApiKey(apiKey); // set the apiKey
    window.setTimeout($scope.checkAuth,1); // calls the checkAuth() method after 1 millisecond
  }

  $scope.checkAuth = function() {
    gapi.auth.authorize(
      {
        client_id: clientId, 
        scope: scopes.join(' '), // join the list of scopes separated by a space character (' ')
        immediate: true // no pop-up is shown in case the user is already logged in
      }, $scope.handleAuthResult);
  }

  $scope.handleAuthResult = function(authResult) {
    var authorizeButton = document.getElementById('authorize-button');

    // if the user has already authorized API access proceed to the API call, otherwise display button to authorize the app
    if (authResult && !authResult.error) {
      authorizeButton.style.visibility = 'hidden';
      $scope.loadDriveApi(); // call method to load the Drive API
    } else {
      authorizeButton.style.visibility = '';
    }
  }

  // authorize the user when the Sign In with Google button is pressed
  $scope.handleAuthClick = function(event) {
    gapi.auth.authorize(
      {
        client_id: clientId,
        scope: scopes,
        immediate: false // a pop-up is displayed to the user so they can sign in
      }, $scope.handleAuthResult);
    return false;
  }

  // Load Google Drive API
  $scope.loadDriveApi = function(){

    // load the API
    gapi.client.load('drive', 'v2', function() {
      // call listFiles()
      $scope.listFiles(); // load the drive api, version 2, then call the list files function
    })
  }

  // send request for files to the API and save them to the scope
  $scope.listFiles = function() {

    // build a request object to request up to ten Drive files
    var request = gapi.client.drive.files.list(
      {
        'maxResults': 10
      }
    );

    // execute the request
    request.execute(function(resp) {

      // save items in the response to the scope
      $scope.files = resp.items;
      $scope.isBackendReady = true;
     
    });
  }

}]);