'use strict';


var clientId = '282322657286-thqf8d9ol44fcasamt9e358p2ghigb1c.apps.googleusercontent.com'; // for OAuth2
var apiKey = 'AIzaSyDbyRiJkjf4CU5YO6B6sc_K_iQkw-rXC74'; // for general api access
var scopes = 'https://www.googleapis.com/auth/plus.me';

// START
// handleClientLoad function called when Google JS library is loaded in index.html
function handleClientLoad() { 
  console.log('loaded');
  gapi.client.setApiKey(apiKey); // set the apuKey
  window.setTimeout(checkAuth,1); // calls the checkAuth() method after 1 millisecond
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

 // Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
  gapi.client.load('plus', 'v1', function() {
    var request = gapi.client.plus.people.get({
      'userId': 'me'
    });
    request.execute(function(resp) {
      var heading = document.createElement('h4');
      var image = document.createElement('img');
      image.src = resp.image.url;
      heading.appendChild(image);
      heading.appendChild(document.createTextNode(resp.displayName));
      document.getElementById('content').appendChild(heading);
    });
  });
}