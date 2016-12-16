const ndarray = require("ndarray");
const model = require("./model");
const showResult = require('./showResult');
const Promise = require('promise');

const MODEL_EXPECTED_DIM = 150;

var width = 0;
var height = 0;
var outwidth = MODEL_EXPECTED_DIM;
var outheight = MODEL_EXPECTED_DIM;

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.
var streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.
var video = null;
var canvas = null;
var photo = null;
var startbutton = null;

function startup(){
  // We'll try identify a rear facing camera if we can. Then start the app.
  chooseCam().then(startVid).catch(error)
}


function error(msg){
  // Lamest error handeling ever!
  alert("Sorry error: " + msg);
}

function chooseCam(){

  // Some devices might not support enumerateDevices
  if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevice){
    Promise.resolve(null)
  }
  // Serch all devices for one that is a videoinput and is labeled 'back'
  // Returns a promise which resolves to a device id or null.
  return navigator.mediaDevices.enumerateDevices().then((devices) => {
    var devid = null;
    for(var i=0; i<devices.length; i++){
      var device = devices[i]
      if(device.kind === 'videoinput' && device.label.search('back') >= 0){
        devid = device.deviceId;
        break;
      }
    }
    return devid;
  })
}

function startVid(videoSource){
  // Start the video with the chosen source (or any source).
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  photo = document.getElementById('photo');
  startbutton = document.getElementById('startbutton');

  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);
  navigator.getMedia(
    {
      video: {deviceId: videoSource ? {exact: videoSource} : undefined},
      audio: false
    },
    function(stream) {
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL.createObjectURL(stream);
      }
    },
    error
  );

  video.addEventListener('canplay', function(ev){
    // Set up some of the dimentions.
    if (!streaming) {
      if (video.videoHeight > video.videoWidth){
        width = 150
        height = video.videoHeight / (video.videoWidth/width);
      } else {
        height = 150
        width = video.videoWidth / (video.videoHeight/height);
      }

      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  // Start listening for the take a pickture button.
  startbutton.addEventListener('click', function(ev){
    takepicture();
    ev.preventDefault();
  }, false);

  clearphoto();
}

// Fill the photo with an indication that none has been
// captured.

function clearphoto() {
  var context = canvas.getContext('2d');
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  var data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

function takepicture() {
  showResult.showMsg('');
  var context = canvas.getContext('2d');
  if (width && height) {
    canvas.width = outwidth;
    canvas.height = outheight;
    var xoff = 0;
    var yoff = 0;
    var r = (video.videoWidth/width)
    if(height > width){
      yoff = r * (height - outheight) / 2
    } else {
      xoff = r *  (width - outwidth) / 2
    }
    context.drawImage(video, xoff, yoff, r*outwidth, r*outheight,
       0, 0, outwidth, outheight);
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    setTimeout(() => (predict(context, 150, 150))); // Timeout just lets the photo update before we use all the cpu cycles.
  } else {
    clearphoto();
  }
}

function predict(ctx){
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data, width, height } = imageData;
  var input = new Float32Array(width * height * 3);
  var j = 0;
  for (let i = 0, len = data.length; i < len; i += 4) {
    input[j] = data[i] / 255
    input[j + 1] = data[i + 1] / 255
    input[j + 2] = data[i + 2] / 255
    j += 3; // inc j by 3 not 4 so as to ignore the alpha channel
  }
  const inputData = {
    'input': input
  }
  model.predict(inputData).then((result)=>{
    var val = result.output[0];
    var animal = (val >= 0.5) ? 'dog' : 'cat';
    var ammount = 100 * ((animal === 'dog')? val : 1 - val);
    var message = "That's "+ ammount.toPrecision(2) + "% " + animal + "!";
    showResult.showMsg(message);
  });
}

module.exports = {startup:startup};
