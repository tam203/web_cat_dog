KerasJS = require('../lib/keras')
module.exports = new KerasJS.Model({
  filepaths: {
    model: 'data/trained.json',
    weights: 'data/trained_weights.buf',
    metadata: 'data/trained_metadata.json'
  },
  gpu: true
});
