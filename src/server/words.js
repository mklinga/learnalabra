var fs = require('fs');
var WORDS = '../assets/words.json';

var words = [];
var lastWordId;

function loadWords() {
  return new Promise(function (resolve, reject) {
    console.log('Reading words from', WORDS);
    fs.readFile(WORDS, 'utf8', function (err, data) {
      if (err) {
        console.error('Error reading the words.json!');
        reject(err);
      }
      words = JSON.parse(data);
      lastWordId = words.reduce(function(id, word) { return Math.max(id, word.id); }, 0);
      console.log(words.length + ' words loaded');
    });
  })
}

function saveWords () {
  return new Promise(function (resolve, reject) {
    fs.writeFile(WORDS, JSON.stringify(words), function (err) {
      if (err) {
        console.error('Error writing the words.json!');
        reject(err);
      }
      console.log('Saving words ok!');
      resolve();
    });
  })
}

function getWords () {
  return words;
}

// The word is an object of format { en: 'asdf', es: 'fdsa' }
function addNewWord (word) {

  var newWordsArray = Object
    .keys(word)
    .map(function (key) {
      return ({
        id: ++lastWordId,
        lang: key,
        value: word[key],
      });
    });

  console.log('Adding new words!', newWordsArray);
  words = words.concat(newWordsArray);
  return words;
}

function assignTranslations(words) {

}

function assignSentence(word, sentence) {

}

module.exports = {
  addNewWord: addNewWord,
  getWords: getWords,
  loadWords: loadWords,
  saveWords: saveWords
};
