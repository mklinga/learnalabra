var uuidV4 = require('uuid/v4');

var userService = require('./user');
var wordService = require('./words');
var sentenceService = require('./sentence');

function calculateWordProbability (word, guesses) {
  // Probability rules:
  //
  // If word has been guessed at least once, start from 100
  // Otherwise, start from 0
  //
  // For each correct guess on word, reduce 20
  // For each incorrect guess on word, add 25
  // 
  // Add random number to word (0-50)
  // 
  // TODO: Add a value based on last guess timestamp (the further away, the bigger the number)
  //
  // Take n amount of biggest values


  var randomNumber = Math.ceil(Math.random() * 50);

  var wordGuesses = guesses.filter(function (guess) {
    return guess.wordId === word.id;
  });

  if (wordGuesses.length === 0) {
    return randomNumber;
  }

  var initialValue = randomNumber + 100; 
  var correctGuesses = wordGuesses.filter(function (guess) {
    return guess.correct;
  });
  var incorrectGuesses = wordGuesses.length - correctGuesses.length;

  return Math.max(initialValue - (20 * correctGuesses.length) + (25 * incorrectGuesses), 1);
}

function buildWordProbabilities (words, guesses) {
  return words.map(function (word) {
    return Object.assign(word,
      { probability: calculateWordProbability(word, guesses) }
    );
  });
}

function takeEvenlyFromWeightedList (words) {
  var totalProbability = words.reduce(function(total, word) {
    return total + word.probability;
  }, 0);

  var point = Math.random() * totalProbability;

  var accumulated = 0, index = 0;
  while (true) {
    accumulated += words[index].probability;

    if (accumulated > point || index === (words.length - 1)) {
      return words[index];
    }

    index++;
  }
}

function getSetOfQuestions (userId, language, amount) {
  amount = amount || 1;

  var user = userService.getUser(userId);
  var allWords = wordService.getWords()

  var wordsWithQuestionLanguage = (language === undefined)
    ? allWords
    : allWords.filter(function (word) { return word.lang === language; });

  var weightedWords = buildWordProbabilities(wordsWithQuestionLanguage, user.guesses);
  var questionWords = [];
  for (var i = 0; i < amount; i++) {
    var nextWord = takeEvenlyFromWeightedList(weightedWords);
    questionWords.push(nextWord);

    // Remove the picked words from the pool so we don't get duplicates
    weightedWords = weightedWords.filter(function (weightedWord) {
      return !questionWords.find(function (questionWord) {
        return questionWord.id === weightedWord.id;
      })
    });
  }

  var richQuestionWords = questionWords.map(function (question) {
    var translations = allWords.filter(function (word) {
      return (question.translations.indexOf(word.id) !== -1);
    });

    var relatedSentences = sentenceService.getSentencesByIds(question.sentences || []);

    return ({ id: uuidV4(), word: question, translations: translations, sentences: relatedSentences });
  });

  return richQuestionWords;
}

module.exports = {
  getSetOfQuestions: getSetOfQuestions
};
