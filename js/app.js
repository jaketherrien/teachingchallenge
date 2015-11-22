'use strict';


var clientId = '282322657286-thqf8d9ol44fcasamt9e358p2ghigb1c.apps.googleusercontent.com'; // for OAuth2
var apiKey = 'AIzaSyDbyRiJkjf4CU5YO6B6sc_K_iQkw-rXC74'; // for general api access

// list of scopes the user will be asked to grant access to separated by a space character (' ')
var scopes = ['https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/drive.metadata.readonly']; 

// START
// handleClientLoad function called when Google JS library is loaded in index.html head tag
function handleClientLoad() { 
  console.log("handleClientLoad() called");
  gapi.client.setApiKey(apiKey); // set the apuKey
  window.setTimeout(checkAuth,1); // calls the checkAuth() method after 1 millisecond
}

function checkAuth() {
  console.log("checkAuth() called");
  gapi.auth.authorize(
    {
      client_id: clientId, 
      scope: scopes.join(' '), // join the list of scopes separated by a space character (' ')
      immediate: true
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
  console.log("handleAuthResult() called");
  var authorizeButton = document.getElementById('authorize-button');

  // if the user has already authorized API access proceed to the API call, otherwise display button to authorize the app
  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = 'hidden';
    loadDriveApi(); // call method to load the Drive API
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}

// Google Drive
function loadDriveApi(){
  gapi.client.load('drive', 'v2', listFiles); // load the drive api, version 2, then call the list files function
}

function listFiles() {
  console.log("listFiles() called");
  // request up to ten Drive files, builds a request object
  var request = gapi.client.drive.files.list(
      {
        'maxResults': 10
      }
    );

    request.execute(function(resp) {
      appendPre('Files:');
      var files = resp.items;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          appendPre(file.title + ' (' + file.id + ')');
        }
      } else {
        appendPre('No files found.');
      }
    });
}

/**
* Append a pre element to the body containing the given message
* as its text node.
*
* @param {string} message Text to be placed in pre element.
*/
function appendPre(message) {
  var pre = document.getElementById('output');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}



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

