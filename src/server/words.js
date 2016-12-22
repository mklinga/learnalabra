var fs = require('fs');
var WORDS = '../assets/words.json';

var words = [];
var lastWordId;

function loadWords() {
  return new Promise(function (resolve, reject) {
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

  words = words.concat(newWordsArray);
  return newWordsArray;
}

function assignTranslations(translations) {
  // We expect to get an array of words which mean the same thing in different languages
  var translationIds = translations.map(function (word) { return word.id });
  words = words.map(function(word) {
    if (translationIds.indexOf(word.id) === -1) {
      return word;
    }

    var wordTranslations = translationIds.filter(function(id) { return id !== word.id; });
    return Object.assign(
      word,
      { translations: wordTranslations }
    );
  });
}

function assignSentence(assignWord, assignSentence) {
  words = words.map(function (word) {
    if (word.id !== assignWord.id) {
      return word;
    }

    var sentences = word.sentences || [];
    sentences = sentences.concat(assignSentence.id);
    
    return Object.assign(word, { sentences: sentences });
  });
}

module.exports = {
  addNewWord: addNewWord,
  assignTranslations: assignTranslations,
  assignSentence: assignSentence,
  getWords: getWords,
  loadWords: loadWords,
  saveWords: saveWords
};
