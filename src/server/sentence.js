var fs = require('fs');

var WORDS = '../assets/words.json';

var SENTENCES = '../assets/sentences.json';
var sentences = [];

var lastSentenceId;

function loadSentences() {
  return new Promise(function (resolve, reject) {
    fs.readFile(SENTENCES, 'utf8', function (err, data) {
      if (err) {
        console.error('Error reading the sentences.json!');
        reject(err);
      }
      sentences = JSON.parse(data);
      lastSentenceId = sentences.reduce(function(id, sentence) { return Math.max(id, sentence.id); }, 0);
      console.log(sentences.length + ' sentences loaded');
      resolve();
    });
  })
}

function saveSentences () {
  return new Promise(function (resolve, reject) {
    fs.writeFile(SENTENCES, JSON.stringify(sentences), function (err) {
      if (err) {
        console.error('Error writing the sentences.json!');
        reject(err);
      }
      console.log('Saving sentences ok!');
      resolve();
    });
  })
}

function getSentences () {
  return sentences;
}

// The sentence is an object of format { en: 'asdf', es: 'fdsa' }
function addNewSentence (sentence) {

  var newSentenceArray = Object
    .keys(sentence)
    .map(function (key) {
      return ({
        id: ++lastSentenceId,
        lang: key,
        value: sentence[key],
      });
    });

  sentences = sentences.concat(newSentenceArray);
  return newSentenceArray;
}

function assignTranslations(sentences) {

}

module.exports = {
  addNewSentence: addNewSentence,
  getSentences: getSentences,
  loadSentences: loadSentences,
  saveSentences: saveSentences
};
