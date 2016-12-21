var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var words = [], sentences = [];

function loadWordsAndSentences () {
  var WORDS = '../assets/words.json';
  var SENTENCES = '../assets/sentences.json';

  return new Promise(function (resolve, reject) {

    console.log('Reading words from', WORDS);
    fs.readFile(WORDS, 'utf8', function (err, data) {
      if (err) {
        console.error('Error reading the words.json!');
        reject(err);
      }
      words = JSON.parse(data);
      console.log(words.length + ' words loaded');

      console.log('Reading sentences from', SENTENCES);
      fs.readFile(SENTENCES, 'utf8', function (err, data) {
        if (err) {
          console.error('Error reading the sentences.json!');
          reject(err);
        }
        sentences = JSON.parse(data);
        console.log(sentences.length + ' sentences loaded');
        resolve();
      });
    });
  });
}

function getWords () {
  return words;
}

function getSentences () {
  return sentences;
}

function saveNewWord (content) {
  // content: {
  //   word: { en: '...', es: '...' },
  //   sentence: { en: '...', es: '...' }
  // }

  var lastWordId = words.reduce(function(id, word) { return Math.max(id, word.id); }, 0);
  var lastSentenceId = sentences.reduce(function(id, sentence) { return Math.max(id, sentence.id); }, 0);

  // Assign id's to the objects
  var contentWithIds = {};
  
  contentWithIds.word = Object.keys(content.word)
    .map(function (key) {
      var result = {};
      result[key] = { value: content.word[key], id: ++lastWordId };
      return result;
    })
    .reduce(function (result, word) {
      return Object.assign(result, word) 
    }, {});

  contentWithIds.sentence = Object.keys(content.sentence)
    .map(function (key) {
      var result = {};
      result[key] = { value: content.sentence[key], id: ++lastSentenceId };
      return result;
    })
    .reduce(function (result, sentence) {
      return Object.assign(result, sentence) 
    }, {});

  var newSentences = Object.keys(contentWithIds.sentence).map(function(key) {
    var translations = Object.keys(contentWithIds.sentence)
      .filter(function (innerKey) { return innerKey !== key; })
      .map(function (key) { return contentWithIds.sentence[key].id });

    return ({
      id: contentWithIds.sentence[key].id,
      lang: key,
      value: contentWithIds.sentence[key].value,
      translations: translations
    });
  });

  var newWords = Object.keys(contentWithIds.word).map(function(key) {
    var correspondingSentences = newSentences.filter(function (sentence) {
      return sentence.lang === key;
    });
    var translations = Object.keys(contentWithIds.word)
      .filter(function (innerKey) { return innerKey !== key; })
      .map(function (key) { return contentWithIds.word[key].id });

    return ({
      id: contentWithIds.word[key].id,
      lang: key,
      value: contentWithIds.word[key].value,
      sentences: correspondingSentences.map(function (sentence) { return sentence.id; }),
      translations: translations
    });
  });

  words = words.concat(newWords);
  sentences = sentences.concat(newSentences);
}

app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/words', function (req, res) {
  return res.json(getWords());
});

app.get('/sentences', function (req, res) {
  return res.json(getSentences());
});

app.post('/words', function (req, res) {
  saveNewWord(req.body);
  res.json(req.body)
});

app.listen(3030, function () {
  loadWordsAndSentences()
    .then(function () {
      console.log('Learnalabra-API listening on port 3030!');
    });
});
