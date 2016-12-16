# web cat dog
A example of using (KerasJS)[https://github.com/transcranial/keras-js] and (WebRTC)[https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API] to create a app to predict if an image is a cat or dog.

*(See it in action)[https://theo-cat-or-dog.s3-eu-west-1.amazonaws.com/index.html]*

# With thanks:

Model trained following (this Keras blog)[https://blog.keras.io/building-powerful-image-classification-models-using-very-little-data.html].

WebRTC help from Mozzila particularly (this post)[https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos]

(Giorgio Cam)[https://aiexperiments.withgoogle.com/giorgio-cam] from Google AI experiments for inspiration.

# WebRTC and https
If not running on local host then https is required to allow WebRTC.
For me the easiest route for this was an amazon s3 bucket.


# Build
`npm install`
`webpack` or `npm run webpack`

then serve the root either

`python -m SimpleHTTPServer` or `webpack-dev-server`

*Note*: I found that `webpack-dev-server` wasn't correctly reloading content so
went for:

`webpack --watch & python -m SimpleHTTPServer &`

# Play

For the best experience run on a mobile but will also work on a desktop/laptop with a webcam.
If you've not got a heard of cats and dogs hand try pointing it at an image on another screen,
or test if household items are more cat than dog? *Spoiler* My mug is dog.
