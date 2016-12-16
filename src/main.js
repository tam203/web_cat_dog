// Set up our event listener to run the startup process
// once loading is complete.


var capture = require('./capture');
window.addEventListener('load', function(){

  // Check compatability
  getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);
  if(getMedia){
    capture.startup()
  } else {
    document.getElementById('noCam').style.display = 'block'
  }


}, false);
