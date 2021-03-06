var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var wordsService = require('./words');
var sentenceService = require('./sentence');
var userService = require('./user');
var questionService = require('./question');

function initialize () {
  return Promise.all([
    wordsService.loadWords(),
    sentenceService.loadSentences(),
    userService.loadUsers()
  ]);
}

app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/users/:id', function (req, res) {
  return res.json(userService.getUser(Number(req.params.id)));
});

app.get('/users/:id/questions/', function (req, res) {
  return res.json(questionService.getSetOfQuestions(Number(req.params.id)));
});

app.post('/users/:id/guesses', function (req, res) {
  var guesses = req.body.guesses;
  var userId = Number(req.params.id);

  guesses.forEach(function (guess) {
    userService.addGuess(userId, guess)
  });
  userService.saveUsers();
  return res.json(userService.getUser(Number(req.params.id)));
})

app.post('/words', function (req, res) {
  var newWords = wordsService.addNewWord(req.body);
  wordsService.assignTranslations(newWords);
  return wordsService.saveWords().then(function () {
    return res.json(newWords);
  });
});

app.get('/words', function (req, res) {
  return res.json(wordsService.getWords());
});

app.get('/sentences', function (req, res) {
  return res.json(sentenceService.getSentences());
});

app.post('/sentences', function (req, res) {
  var newSentences = sentenceService.addNewSentence(req.body);
  sentenceService.assignTranslations(newSentences);
  return sentenceService.saveSentences().then(function () {
    return res.json(newSentences);
  });
});

app.post('/bind-words-and-sentences', function (req, res) {
  var sentences = req.body.sentences;
  var words = req.body.words;

  Object.keys(words).forEach(function (key) {
    if (sentences[key]) {
      wordsService.assignSentence(words[key], sentences[key]);
    }
  })

  return wordsService.saveWords().then(function () {
    return res.json(wordsService.getWords());
  });
})

app.listen(3030, function () {
  initialize()
    .then(function () {
      console.log('Learnalabra-API listening on port 3030!');
    });
});
