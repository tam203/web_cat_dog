// Set up our event listener to run the startup process
// once loading is complete.

// Shim

//require('webrtc-adapter');
var capture = require('./capture');
window.addEventListener('load', function(){
  capture.startup()
}, false);
