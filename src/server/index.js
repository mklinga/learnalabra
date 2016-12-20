var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var words = [], sentences = [];

function readWords (cb) {
  var FILE = '../assets/words.json';

  console.log('Reading words from', FILE);
  fs.readFile(FILE, 'utf8', cb);
}

function saveWords (newWords) {
  console.log('Saving', newWords);
}

app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/words', function (req, res) {
  readWords(function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return res.end();
    }
    return res.json(JSON.parse(data));
  });
});

app.post('/words', function (req, res) {
  saveWords(req.body);
  res.json(req.body)
});

app.listen(3030, function () {
  console.log('Learnalabra-API listening on port 3030!');
});
