'use strict';

var clientId = '282322657286-thqf8d9ol44fcasamt9e358p2ghigb1c.apps.googleusercontent.com'; // for OAuth2
var apiKey = 'AIzaSyDbyRiJkjf4CU5YO6B6sc_K_iQkw-rXC74'; // for general api access
var scopes = 'https://www.googleapis.com/auth/plus.me';


// handleClientLoad function called when Google JS library is loaded in index.html
function handleClientLoad() { 
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,1);
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}