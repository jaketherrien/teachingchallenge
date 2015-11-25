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

  // boolean to hide display of results until they're loaded
  $scope.isBackendReady = false; 

  // OAuth2 clientID
  var clientId = '353530661501-7v82qvc9ikqou9e5drvrjm0iq29pre2i.apps.googleusercontent.com'; 
  // general api access key
  var apiKey = 'AIzaSyAHXtI167IuI_g4ZzzltLmxudua-Li6494'; 

  // list of scopes the user will be asked to grant access to separated by a space character (' ')
  var scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly']; 

  $window.initialize = function() {
    $scope.$apply($scope.handleClientLoad);
  };

  // START
  // handleClientLoad function called when Google JS library is loaded in index.html head tag
  $scope.handleClientLoad = function() { 
    gapi.client.setApiKey(apiKey);
    window.setTimeOut($scope.checkAuth, 1);
  }

  // check authorization status on page load and as needed in the future
  $scope.checkAuth = function() {
    gapi.auth.authorize(
      {
        client_id: clientId, 
        scope: scopes.join(' '), 
        immediate: true 
      }, $scope.handleAuthResult);
  }

  // handle authorization result
  $scope.handleAuthResult = function(authResult) {
    var authorizeButton = document.getElementById('authorize-button');

    if (authResult && !authResult.error) {
      authorizeButton.style.visibility = 'hidden';
      $scope.loadDriveApi(); 
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
        immediate: false 
      }, $scope.handleAuthResult);

    
  }

  // Load Google Drive API
  $scope.loadDriveApi = function(){

    // load the API
    gapi.client.load('drive', 'v2', function() {

    $scope.listFiles(); 
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

      $scope.files = resp.items;
      $scope.isBackendReady = true;
     
    });
  }

}]);